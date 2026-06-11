import { createAdminClient } from '@/lib/supabase/admin'
import CustomersClient from './CustomersClient'

export const revalidate = 120

export default async function CustomersPage() {
  const supabase = createAdminClient()
  const [{ data: customers }, { count: totalCount }] = await Promise.all([
    supabase
      .from('customers')
      .select('customer_id, full_name, company_name, first_name, last_name, cell_phone, email, full_address, neighborhood, county, status, num_invoices, invoice_balance, price, is_active, lead_source')
      .order('customer_id', { ascending: false })
      .limit(500),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
  ])
  return <CustomersClient customers={customers ?? []} totalCount={totalCount ?? 0} />
}
