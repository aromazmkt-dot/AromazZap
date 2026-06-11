'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserCheck } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { createCustomer } from '../actions'

const LEAD_SOURCES = [
  'Google Search', 'Flags & Banners', 'Repeat', 'Walk-in', 'Website',
  'ZapAssist AI', 'Referral', 'Facebook', 'Instagram', 'Other',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all'
const selectCls = inputCls + ' cursor-pointer'

export default function NewCustomerPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCustomer(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Nuevo Cliente" subtitle="Agregar cliente a la base de datos" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> Volver a Clientes
          </button>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <UserCheck size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Nuevo Cliente</h2>
                <p className="text-xs text-zinc-500">Complete los datos de contacto</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre">
                  <input name="first_name" type="text" placeholder="Ana" className={inputCls} />
                </Field>
                <Field label="Apellido">
                  <input name="last_name" type="text" placeholder="García" className={inputCls} />
                </Field>
              </div>

              <Field label="Empresa (opcional)">
                <input name="company_name" type="text" placeholder="Empresa S.A." className={inputCls} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Teléfono">
                  <input name="cell_phone" type="tel" placeholder="+1 555 000 0000" className={inputCls} />
                </Field>
                <Field label="Email">
                  <input name="email" type="email" placeholder="ana@empresa.com" className={inputCls} />
                </Field>
              </div>

              <Field label="Dirección">
                <input name="full_address" type="text" placeholder="123 Main St, City, State 00000" className={inputCls} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Cómo nos encontró">
                  <select name="lead_source" className={selectCls}>
                    <option value="">Seleccionar…</option>
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Estado">
                  <select name="status" className={selectCls}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Lead">Lead</option>
                  </select>
                </Field>
              </div>

              {error && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border border-zinc-200 rounded-xl py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck size={15} />
                  {isPending ? 'Guardando…' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
