import { createAdminClient } from '@/lib/supabase/admin'
import InvoicesClient from './InvoicesClient'

export const revalidate = 120

export default async function InvoicesPage() {
  const supabase = createAdminClient()

  // Real aggregate stats via RPC (bypasses row limit)
  const { data: statsRows } = await supabase.rpc('invoice_stats')
  const stats = statsRows?.[0] ?? {
    total_count: 0, total_revenue: 0, total_balance: 0,
    paid_count: 0, partial_count: 0, partial_balance: 0,
  }

  // Load invoices in parallel batches to overcome 1000-row PostgREST limit
  const cols = 'invoice_id, invoice_number, customer_name, company_name, paid_status, invoice_type_name, salesman, total_sale, total_payment, balance, invoice_date, created_date'
  const order = { ascending: false, nullsFirst: false } as const
  const [r1, r2, r3, r4] = await Promise.all([
    supabase.from('invoices').select(cols).order('invoice_date', order).range(0, 999),
    supabase.from('invoices').select(cols).order('invoice_date', order).range(1000, 1999),
    supabase.from('invoices').select(cols).order('invoice_date', order).range(2000, 2999),
    supabase.from('invoices').select(cols).order('invoice_date', order).range(3000, 3999),
  ])

  const invoices = [
    ...(r1.data ?? []),
    ...(r2.data ?? []),
    ...(r3.data ?? []),
    ...(r4.data ?? []),
  ]

  return (
    <InvoicesClient
      invoices={invoices}
      stats={{
        totalCount: Number(stats.total_count),
        totalRevenue: Number(stats.total_revenue),
        totalBalance: Number(stats.total_balance),
        paidCount: Number(stats.paid_count),
        partialCount: Number(stats.partial_count),
        partialBalance: Number(stats.partial_balance),
      }}
    />
  )
}
