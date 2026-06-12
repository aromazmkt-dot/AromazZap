import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function splitNames(value: string | null | undefined) {
  return String(value ?? '').split(',').map(name => name.trim()).filter(Boolean)
}

function topCounts(rows: Record<string, unknown>[], key: string, limit = 12) {
  const counts = new Map<string, number>()
  for (const row of rows) {
    for (const name of splitNames(row[key] as string | null | undefined)) counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export async function POST(request: NextRequest) {
  const supabaseSession = await createClient()
  const { data: { user } } = await supabaseSession.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { message = '' } = await request.json().catch(() => ({ message: '' })) as { message?: string }
  const q = message.toLowerCase()
  const supabase = createAdminClient()

  if (q.includes('vendedor') || q.includes('sales')) {
    const { data, error } = await supabase.from('invoices').select('salesman').not('salesman', 'is', null).limit(5000)
    if (error) throw new Error(error.message)
    const top = topCounts((data ?? []) as Record<string, unknown>[], 'salesman', 15)
    return NextResponse.json({ ok: true, answer: `Vendedores detectados: ${top.length} principales por documentos.\n${top.map(([name, count], index) => `${index + 1}. ${name} — ${count}`).join('\n')}` })
  }

  if (q.includes('proveedor') || q.includes('vendor')) {
    const { data, error } = await supabase.from('products').select('vendor').not('vendor', 'is', null).limit(5000)
    if (error) throw new Error(error.message)
    const top = topCounts((data ?? []) as Record<string, unknown>[], 'vendor', 12)
    return NextResponse.json({ ok: true, answer: `Proveedores principales por catálogo:\n${top.map(([name, count], index) => `${index + 1}. ${name} — ${count} productos`).join('\n')}` })
  }

  if (q.includes('stock') || q.includes('inventario')) {
    const { data, error } = await supabase.from('products').select('product_name,style,available_quantity,unit_measure').lte('available_quantity', 5).eq('discontinued', false).limit(10)
    if (error) throw new Error(error.message)
    const rows = data ?? []
    return NextResponse.json({ ok: true, answer: `Productos con bajo stock (≤5):\n${rows.length ? rows.map(p => `• ${p.product_name || p.style} · ${p.available_quantity ?? 0} ${p.unit_measure ?? ''}`).join('\n') : 'No detecté bajo stock.'}` })
  }

  const [{ data: invoices }, { data: leads }] = await Promise.all([
    supabase.from('invoices').select('total_sale,balance').limit(5000),
    supabase.from('leads').select('id').limit(5000),
  ])
  const total = (invoices ?? []).reduce((sum, row) => sum + Number(row.total_sale ?? 0), 0)
  const balance = (invoices ?? []).reduce((sum, row) => sum + Number(row.balance ?? 0), 0)
  return NextResponse.json({ ok: true, answer: `Resumen operativo: ${money(total)} en ventas cargadas, ${money(balance)} por cobrar, ${(invoices ?? []).length} documentos y ${(leads ?? []).length} leads en la muestra consultada. Para cambios reales, primero preparo dry-run y pido aprobación.` })
}
