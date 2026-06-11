'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type Obligation = {
  id: string
  name: string
  subtitle: string | null
  category: string
  due_date: string
  start_date: string | null
  amount: number
  currency: string
  frequency: string
  responsible: string | null
  notes: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
}

export async function createObligation(data: Omit<Obligation, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('expirations').insert({ ...data, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
  revalidatePath('/expirations')
}

export async function updateObligation(id: string, data: Partial<Omit<Obligation, 'id' | 'created_at'>>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('expirations').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/expirations')
}

export async function deleteObligation(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('expirations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/expirations')
}

export async function renewObligation(id: string, currentDueDate: string, frequency: string, notes?: string) {
  const due = new Date(currentDueDate)
  let next: Date
  if (frequency === 'Mensual') {
    next = new Date(due); next.setMonth(next.getMonth() + 1)
  } else if (frequency === 'Trimestral') {
    next = new Date(due); next.setMonth(next.getMonth() + 3)
  } else {
    next = new Date(due); next.setFullYear(next.getFullYear() + 1)
  }
  const newDueDate = next.toISOString().split('T')[0]

  const supabase = createAdminClient()
  const { error } = await supabase.from('expirations').update({
    due_date: newDueDate,
    notes: notes ?? null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/expirations')
  return newDueDate
}
