'use client'

import { useState, useTransition } from 'react'
import { Eye, EyeOff, LogIn, ShieldCheck, ArrowLeft, Smartphone } from 'lucide-react'
import { signIn, verifyMfa } from './actions'

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // MFA step state
  const [mfaState, setMfaState] = useState<{ factorId: string } | null>(null)
  const [otp, setOtp] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await signIn(formData)
      if (!result) return
      if (result.error) { setError(result.error); return }
      if (result.mfaRequired) setMfaState({ factorId: result.factorId })
    })
  }

  function handleMfa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await verifyMfa(mfaState!.factorId, otp)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-4 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">Aromaz Home</h1>
          <p className="text-zinc-500 text-sm mt-1">Panel de gestión interno</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

          {/* ── STEP 1: Email + Password ── */}
          {!mfaState && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue="marco@aromazhome.com"
                  required
                  autoComplete="email"
                  className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-2.5 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_28px_rgba(37,99,235,0.5)] mt-2"
              >
                <LogIn size={16} />
                {isPending ? 'Verificando…' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* ── STEP 2: TOTP Code ── */}
          {mfaState && (
            <form onSubmit={handleMfa} className="space-y-5">
              <div className="flex flex-col items-center gap-3 pb-4 border-b border-white/[0.06]">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Smartphone size={22} className="text-blue-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-white font-semibold text-sm">Verificación en dos pasos</h2>
                  <p className="text-zinc-500 text-xs mt-1">Abre Google Authenticator e ingresa el código de 6 dígitos</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Código de verificación
                </label>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000 000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  autoFocus
                  className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-3.5 py-3 text-2xl text-white text-center tracking-[.5em] font-mono placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <ShieldCheck size={13} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-2.5 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.35)]"
              >
                <ShieldCheck size={16} />
                {isPending ? 'Verificando…' : 'Confirmar acceso'}
              </button>

              <button
                type="button"
                onClick={() => { setMfaState(null); setError(null); setOtp('') }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ArrowLeft size={12} /> Volver al inicio de sesión
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          Aromaz Home © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
