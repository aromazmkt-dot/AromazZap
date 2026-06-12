import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { readLimit, readOffset, requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const limit = readLimit(request, 100, 1000)
  const offset = readOffset(request)
  const supabase = createAdminClient()
  const cols = 'invoice_id, invoice_number, customer_name, company_name, paid_status, invoice_type_name, salesman, total_sale, total_payment, balance, invoice_date, created_date'
  const [{ data, count, error }, { data: statsRows, error: statsError }] = await Promise.all([
    supabase
      .from('invoices')
      .select(cols, { count: 'exact' })
      .order('invoice_date', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1),
    supabase.rpc('invoice_stats'),
  ])

  if (error || statsError) {
    return NextResponse.json({
      ok: false,
      error: error?.message ?? statsError?.message ?? 'invoice_query_failed',
    }, { status: 502 })
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
    resource: 'invoices',
    count: count ?? data?.length ?? 0,
    limit,
    offset,
    stats: {
      totalCount: Number(stats.total_count ?? 0),
      totalRevenue: Number(stats.total_revenue ?? 0),
      totalBalance: Number(stats.total_balance ?? 0),
      paidCount: Number(stats.paid_count ?? 0),
      partialCount: Number(stats.partial_count ?? 0),
      partialBalance: Number(stats.partial_balance ?? 0),
    },
    data: data ?? [],
  })
}
