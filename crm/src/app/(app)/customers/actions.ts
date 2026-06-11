'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createCustomer(formData: FormData) {
  const supabase = createAdminClient()

  const full_name = [
    formData.get('first_name') as string,
    formData.get('last_name') as string,
  ].filter(Boolean).join(' ') || null

  const payload = {
    first_name: formData.get('first_name') as string || null,
    last_name: formData.get('last_name') as string || null,
    full_name,
    company_name: formData.get('company_name') as string || null,
    cell_phone: formData.get('cell_phone') as string || null,
    email: formData.get('email') as string || null,
    full_address: formData.get('full_address') as string || null,
    lead_source: formData.get('lead_source') as string || null,
    status: (formData.get('status') as string) || 'Active',
    is_active: true,
    created_date: new Date().toISOString(),
  }

  const { error } = await supabase.from('customers').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/customers')
  redirect('/customers')
}
