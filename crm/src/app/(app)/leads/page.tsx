import { createAdminClient } from '@/lib/supabase/admin'
import LeadsClient from './LeadsClient'

export const revalidate = 120

export default async function LeadsPage() {
  const supabase = createAdminClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id, full_name, company_name, cell_phone, email, lead_source, lead_status, stage, created_by, lead_date, created_date')
    .order('created_date', { ascending: false })
    .limit(2000)

  return <LeadsClient leads={leads ?? []} />
}
