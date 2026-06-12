import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const supabase = createAdminClient()
  const [
    { data: statsRows, error: statsError },
    { data: monthlyRows, error: monthlyError },
    { data: sourcesRows, error: sourcesError },
    { count: leadsTotal, error: leadsError },
    { count: customersTotal, error: customersError },
    { count: productsTotal, error: productsError },
    { count: expirationsTotal, error: expirationsError },
    { data: recentInvoices, error: invoicesError },
  ] = await Promise.all([
    supabase.rpc('invoice_stats'),
    supabase.rpc('monthly_revenue', { months_back: 12 }),
    supabase.rpc('leads_by_source'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('expirations').select('*', { count: 'exact', head: true }),
    supabase
      .from('invoices')
      .select('invoice_number, customer_name, total_sale, balance, paid_status, salesman, invoice_date')
      .order('invoice_date', { ascending: false, nullsFirst: false })
      .limit(10),
  ])

  const errors = [
    statsError, monthlyError, sourcesError, leadsError, customersError,
    productsError, expirationsError, invoicesError,
  ].filter(Boolean).map(error => error?.message)

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: 'dashboard_query_failed', details: errors }, { status: 502 })
  }

  const stats = statsRows?.[0] ?? {
    total_count: 0,
    total_revenue: 0,
    total_balance: 0,
    paid_count: 0,
    partial_count: 0,
    partial_balance: 0,
  }

  return NextResponse.json({
    ok: true,
    report: 'dashboard',
    generatedAt: new Date().toISOString(),
    kpis: {
      invoices: {
        totalCount: Number(stats.total_count ?? 0),
        totalRevenue: Number(stats.total_revenue ?? 0),
        totalBalance: Number(stats.total_balance ?? 0),
        paidCount: Number(stats.paid_count ?? 0),
        partialCount: Number(stats.partial_count ?? 0),
        partialBalance: Number(stats.partial_balance ?? 0),
      },
      leads: { totalCount: leadsTotal ?? 0 },
      customers: { totalCount: customersTotal ?? 0 },
      products: { totalCount: productsTotal ?? 0 },
      expirations: { totalCount: expirationsTotal ?? 0 },
    },
    charts: {
      monthlyRevenue: monthlyRows ?? [],
      leadsBySource: sourcesRows ?? [],
    },
    recentInvoices: recentInvoices ?? [],
  })
}
