'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  // Check if user has TOTP enrolled → require step 2
  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (aalData?.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const totpFactor = factors?.totp?.[0]
    if (totpFactor) {
      return { mfaRequired: true as const, factorId: totpFactor.id }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function verifyMfa(factorId: string, code: string) {
  const supabase = await createClient()

  const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId })
  if (challengeErr) return { error: challengeErr.message }

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code: code.replace(/\s/g, ''),
  })

  if (error) return { error: 'Código incorrecto. Verifica Google Authenticator.' }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
