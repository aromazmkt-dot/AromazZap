'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createLead(formData: FormData) {
  const supabase = createAdminClient()

  const payload = {
    full_name: formData.get('full_name') as string || null,
    company_name: formData.get('company_name') as string || null,
    cell_phone: formData.get('cell_phone') as string || null,
    email: formData.get('email') as string || null,
    lead_source: formData.get('lead_source') as string || null,
    lead_status: (formData.get('lead_status') as string) || 'New',
    stage: formData.get('stage') as string || null,
    notes: formData.get('notes') as string || null,
    created_date: new Date().toISOString(),
    lead_date: new Date().toISOString(),
  }

  const { error } = await supabase.from('leads').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/leads')
  redirect('/leads')
}

export async function updateLeadStage(id: number, stage: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').update({ stage }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/leads')
}
