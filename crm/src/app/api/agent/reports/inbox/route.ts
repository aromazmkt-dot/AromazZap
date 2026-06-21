import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

type Invoice = {
  invoice_number: string | null
  customer_name: string | null
  company_name: string | null
  total_sale: number | null
  balance: number | null
  paid_status: string | null
  salesman: string | null
  invoice_date: string | null
}

type Lead = {
  full_name: string | null
  company_name: string | null
  lead_status: string | null
  lead_source: string | null
  created_by: string | null
  lead_date: string | null
  created_date: string | null
}

type Product = {
  product_name: string | null
  style: string | null
  vendor: string | null
  available_quantity: number | null
  unit_measure: string | null
  discontinued: boolean | null
}

type Expiration = {
  name?: string | null
  title?: string | null
  category?: string | null
  responsible?: string | null
  due_date?: string | null
  amount?: number | null
}

function todayOnly() {
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
}

function daysUntil(date: string | null | undefined) {
  if (!date) return null
  const due = new Date(date)
  if (Number.isNaN(due.getTime())) return null
  return Math.ceil((due.getTime() - todayOnly().getTime()) / 86_400_000)
}

function invoicePriority(balance: number) {
  if (balance >= 50_000) return 'critical'
  if (balance >= 15_000) return 'high'
  return 'medium'
}

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const supabase = createAdminClient()
  const [
    { data: invoiceRows, error: invoicesError },
    { data: leadRows, error: leadsError },
    { data: productRows, error: productsError },
    { data: expirationRows, error: expirationsError },
  ] = await Promise.all([
    supabase
      .from('invoices')
      .select('invoice_number,customer_name,company_name,total_sale,balance,paid_status,salesman,invoice_date')
      .gt('balance', 0)
      .order('balance', { ascending: false })
      .limit(25),
    supabase
      .from('leads')
      .select('full_name,company_name,lead_status,lead_source,created_by,lead_date,created_date')
      .order('created_date', { ascending: false, nullsFirst: false })
      .limit(25),
    supabase
      .from('products')
      .select('product_name,style,vendor,available_quantity,unit_measure,discontinued')
      .eq('discontinued', false)
      .lte('available_quantity', 5)
      .order('available_quantity', { ascending: true })
      .limit(25),
    supabase
      .from('expirations')
      .select('*')
      .order('due_date', { ascending: true })
      .limit(25),
  ])

  const errors = [invoicesError, leadsError, productsError, expirationsError]
    .filter(Boolean)
    .map(error => error?.message)

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: 'inbox_query_failed', details: errors }, { status: 502 })
  }

  const criticalCollections = ((invoiceRows ?? []) as Invoice[]).map(invoice => {
    const balance = Number(invoice.balance ?? 0)
    return {
      type: 'collection',
      priority: invoicePriority(balance),
      title: `Cobranza crítica · ${invoice.invoice_number ?? 'sin folio'}`,
      subject: invoice.company_name || invoice.customer_name || 'Cliente sin nombre',
      owner: invoice.salesman || 'Sin vendedor',
      amount: balance,
      date: invoice.invoice_date,
      approvalRequired: true,
      recommendedAction: 'Preparar seguimiento de cobranza para aprobación del GM.',
    }
  })

  const leadFollowUps = ((leadRows ?? []) as Lead[])
    .filter(lead => String(lead.lead_status ?? '').toLowerCase() !== 'lost')
    .slice(0, 12)
    .map(lead => ({
      type: 'lead_followup',
      priority: 'medium',
      title: 'Lead pendiente de seguimiento',
      subject: lead.company_name || lead.full_name || 'Lead sin nombre',
      owner: lead.created_by || 'Sin responsable',
      source: lead.lead_source,
      date: lead.lead_date || lead.created_date,
      approvalRequired: false,
      recommendedAction: 'Confirmar próximo contacto y registrar nota en CRM.',
    }))

  const inventoryAlerts = ((productRows ?? []) as Product[]).map(product => ({
    type: 'inventory',
    priority: Number(product.available_quantity ?? 0) <= 0 ? 'high' : 'medium',
    title: 'Inventario bajo stock',
    subject: product.product_name || product.style || 'Producto sin nombre',
    owner: product.vendor || 'Proveedor sin asignar',
    quantity: Number(product.available_quantity ?? 0),
    unit: product.unit_measure,
    approvalRequired: true,
    recommendedAction: 'Revisar reposición/compra antes de confirmar nuevos trabajos.',
  }))

  const expirationAlerts = ((expirationRows ?? []) as Expiration[])
    .map(expiration => ({ expiration, days: daysUntil(expiration.due_date) }))
    .filter(({ days }) => days !== null && days <= 90)
    .map(({ expiration, days }) => ({
      type: 'expiration',
      priority: days !== null && days <= 30 ? 'high' : 'medium',
      title: 'Vencimiento próximo',
      subject: expiration.name || expiration.title || 'Obligación sin nombre',
      owner: expiration.responsible || 'Sin responsable',
      category: expiration.category,
      dueInDays: days,
      date: expiration.due_date,
      amount: Number(expiration.amount ?? 0),
      approvalRequired: true,
      recommendedAction: 'Validar renovación/pago y marcar decisión aprobada.',
    }))

  const pendingReports = [
    ...criticalCollections.slice(0, 8),
    ...leadFollowUps.slice(0, 6),
    ...inventoryAlerts.slice(0, 6),
    ...expirationAlerts.slice(0, 6),
  ]

  return NextResponse.json({
    ok: true,
    report: 'gm_inbox',
    generatedAt: new Date().toISOString(),
    counts: {
      pendingReports: pendingReports.length,
      criticalCollections: criticalCollections.length,
      leadFollowUps: leadFollowUps.length,
      inventoryAlerts: inventoryAlerts.length,
      expirationAlerts: expirationAlerts.length,
      approvalRequired: pendingReports.filter(item => item.approvalRequired).length,
    },
    sections: {
      pendingReports,
      criticalCollections,
      leadFollowUps,
      inventoryAlerts,
      expirationAlerts,
    },
  })
}
