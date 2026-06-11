import { createAdminClient } from '@/lib/supabase/admin'
import ExpirationsClient from './ExpirationsClient'

export const revalidate = 60

export default async function ExpirationsPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('expirations')
    .select('*')
    .order('due_date', { ascending: true })

  return <ExpirationsClient obligations={data ?? []} />
}
