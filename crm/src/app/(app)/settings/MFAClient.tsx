'use client'

import { useState, useEffect, useMemo, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Smartphone, QrCode, Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react'

type Step = 'idle' | 'enrolling' | 'verifying' | 'done'

export default function MFAClient() {
  const [enrolled, setEnrolled] = useState<boolean | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [factorId, setFactorId] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const hasTOTP = (data?.totp?.length ?? 0) > 0 && data?.totp?.[0]?.status === 'verified'
      setEnrolled(hasTOTP)
    })
  }, [supabase])

  async function startEnroll() {
    setError(null)
    setStep('enrolling')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'Aromaz Home', friendlyName: 'Google Authenticator' })
    if (error || !data) { setError(error?.message ?? 'Error al iniciar enrollment'); setStep('idle'); return }
    setFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const { data: challenge, error: ce } = await supabase.auth.mfa.challenge({ factorId })
      if (ce) { setError(ce.message); return }
      const { error: ve } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code: code.replace(/\s/g, '') })
      if (ve) { setError('Código incorrecto. Intenta de nuevo.'); return }
      setEnrolled(true)
      setStep('done')
      setCode('')
    })
  }

  async function unenroll() {
    if (!confirm('¿Desactivar autenticación de dos factores?')) return
    setError(null)
    const { data } = await supabase.auth.mfa.listFactors()
    const factor = data?.totp?.[0]
    if (!factor) return
    const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id })
    if (error) { setError(error.message); return }
    setEnrolled(false)
    setStep('idle')
  }

  if (enrolled === null) {
    return <div className="px-5 py-4"><Loader2 size={16} className="animate-spin text-zinc-400" /></div>
  }

  return (
    <div>
      {/* Status row */}
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${enrolled ? 'bg-green-50' : 'bg-zinc-100'}`}>
            <ShieldCheck size={14} className={enrolled ? 'text-green-600' : 'text-zinc-500'} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900">Autenticación de dos factores</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {enrolled ? 'Activa — Google Authenticator vinculado' : 'Agrega una capa extra de seguridad con Google Authenticator'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {enrolled ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <CheckCircle2 size={11} /> Activa
              </span>
              <button onClick={unenroll} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Desactivar 2FA">
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={startEnroll}
              disabled={step === 'enrolling' || step === 'verifying'}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              Activar 2FA
            </button>
          )}
        </div>
      </div>

      {/* QR enrollment flow */}
      {(step === 'enrolling' || step === 'verifying') && !enrolled && (
        <div className="mx-5 mb-5 bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-5">

          {/* Step 1 — Scan QR */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span className="text-sm font-semibold text-zinc-800">Escanea el código QR con Google Authenticator</span>
            </div>
            <div className="flex gap-5 items-start">
              {qrCode ? (
                <div className="bg-white rounded-xl p-2 border border-zinc-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCode} alt="QR Code 2FA" width={140} height={140} />
                </div>
              ) : (
                <div className="w-[140px] h-[140px] bg-white border border-zinc-200 rounded-xl flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-zinc-400" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Smartphone size={13} />
                  Abre la app y toca <b>+</b> → <b>Escanear código QR</b>
                </div>
                {secret && (
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 mb-1">O ingresa la clave manualmente:</p>
                    <code className="block bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-zinc-700 break-all select-all">
                      {secret}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 — Enter code */}
          <form onSubmit={verifyEnroll} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span className="text-sm font-semibold text-zinc-800">Ingresa el código de 6 dígitos para confirmar</span>
            </div>
            <div className="flex gap-3">
              <input
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xl font-mono text-center tracking-[.4em] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-300"
              />
              <button
                type="submit"
                disabled={isPending || code.length < 6}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                Verificar
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle size={13} /> {error}
              </div>
            )}
            <button type="button" onClick={() => { setStep('idle'); setCode(''); setError(null) }} className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Success */}
      {step === 'done' && (
        <div className="mx-5 mb-5 flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} /> Google Authenticator vinculado correctamente. Tu cuenta ahora está protegida con 2FA.
        </div>
      )}

      {error && step === 'idle' && (
        <div className="mx-5 mb-4 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}
    </div>
  )
}
