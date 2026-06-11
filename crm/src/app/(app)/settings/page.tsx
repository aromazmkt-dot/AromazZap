'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import MFAClient from './MFAClient'
import {
  User, Bell, Shield, Building2, Palette,
  Mail, Phone, Briefcase, Globe, MapPin, Percent,
  Users, FileCheck, AlertTriangle, BarChart3,
  ChevronRight, Check,
} from 'lucide-react'

/* ── Field ── */
function Field({ label, defaultValue, type = 'text', icon: Icon, span2 = false }: {
  label: string; defaultValue: string; type?: string; icon?: React.ElementType; span2?: boolean
}) {
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />}
        <input
          type={type}
          defaultValue={defaultValue}
          className={`w-full bg-white border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-300
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all
            py-2.5 ${Icon ? 'pl-9 pr-3' : 'px-3.5'} shadow-sm`}
        />
      </div>
    </div>
  )
}

/* ── Toggle ── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-[22px] rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${on ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,.35)]' : 'bg-zinc-200'}`}
    >
      <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  )
}

/* ── Notification row ── */
function NotifRow({ icon: Icon, color, label, sub, on, onChange }: {
  icon: React.ElementType; color: string; label: string; sub: string; on: boolean; onChange: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/60 transition-colors">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-800">{label}</div>
        <div className="text-xs text-zinc-400 mt-0.5">{sub}</div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

/* ── Section wrapper ── */
function Section({ id, title, icon: Icon, accent, children }: {
  id: string; title: string; icon: React.ElementType; accent: string; children: React.ReactNode
}) {
  return (
    <div id={id} className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-zinc-100 bg-gradient-to-r ${accent}`}>
        <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
          <Icon size={15} className="text-zinc-700" />
        </div>
        <h2 className="text-sm font-bold text-zinc-800 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ── Nav item ── */
function NavItem({ icon: Icon, label, target, active, onClick }: {
  icon: React.ElementType; label: string; target: string; active: boolean; onClick: (id: string) => void
}) {
  return (
    <button
      onClick={() => {
        onClick(target)
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
        ${active ? 'bg-blue-50 text-blue-700' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'}`}
    >
      <Icon size={15} />
      {label}
      {active && <ChevronRight size={13} className="ml-auto" />}
    </button>
  )
}

const NAV = [
  { id: 'perfil',         label: 'Perfil',         icon: User },
  { id: 'notificaciones', label: 'Notificaciones',  icon: Bell },
  { id: 'empresa',        label: 'Empresa',         icon: Building2 },
  { id: 'apariencia',     label: 'Apariencia',      icon: Palette },
  { id: 'seguridad',      label: 'Seguridad',       icon: Shield },
]

export default function SettingsPage() {
  const [active, setActive] = useState('perfil')
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ leads: true, quotes: true, invoices: true, weekly: false })

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs(p => ({ ...p, [key]: !p[key] }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Configuración" subtitle="Administra tu cuenta y preferencias" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 flex gap-6 items-start">

          {/* ── Left nav ── */}
          <aside className="w-44 flex-shrink-0 sticky top-0 pt-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-3">Secciones</p>
            <nav className="space-y-0.5">
              {NAV.map(n => (
                <NavItem key={n.id} icon={n.icon} label={n.label} target={n.id} active={active === n.id} onClick={setActive} />
              ))}
            </nav>
          </aside>

          {/* ── Right content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── PERFIL ── */}
            <Section id="perfil" title="Perfil" icon={User} accent="from-blue-50/80 to-white">
              {/* Banner + Avatar */}
              <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-xl font-bold tracking-tight">MB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-12 pb-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-base">Marco Baeza</h3>
                    <p className="text-sm text-zinc-500">marco@aromazhome.com</p>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    Admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <Field label="Nombre completo" defaultValue="Marco Baeza" icon={User} />
                  <Field label="Email" defaultValue="marco@aromazhome.com" type="email" icon={Mail} />
                  <Field label="Teléfono" defaultValue="+1 201-555-0100" icon={Phone} />
                  <Field label="Cargo" defaultValue="General Manager" icon={Briefcase} />
                </div>

                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
                  >
                    {saved ? <><Check size={14} /> Guardado</> : 'Guardar cambios'}
                  </button>
                  <button className="px-4 py-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl text-sm font-medium transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            </Section>

            {/* ── NOTIFICACIONES ── */}
            <Section id="notificaciones" title="Notificaciones" icon={Bell} accent="from-amber-50/60 to-white">
              <div className="divide-y divide-zinc-100">
                <NotifRow icon={Users} color="bg-blue-50 text-blue-600" label="Nuevo lead asignado" sub="Email cuando un lead te es asignado" on={notifs.leads} onChange={() => toggleNotif('leads')} />
                <NotifRow icon={FileCheck} color="bg-green-50 text-green-600" label="Cotización aceptada" sub="Notificación cuando un cliente firma" on={notifs.quotes} onChange={() => toggleNotif('quotes')} />
                <NotifRow icon={AlertTriangle} color="bg-amber-50 text-amber-600" label="Factura vencida" sub="Alerta cuando una factura supera su vencimiento" on={notifs.invoices} onChange={() => toggleNotif('invoices')} />
                <NotifRow icon={BarChart3} color="bg-violet-50 text-violet-600" label="Resumen semanal" sub="Email con métricas cada lunes 8:00 AM" on={notifs.weekly} onChange={() => toggleNotif('weekly')} />
              </div>
            </Section>

            {/* ── EMPRESA ── */}
            <Section id="empresa" title="Empresa" icon={Building2} accent="from-emerald-50/60 to-white">
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nombre de la empresa" defaultValue="Aromaz Home" icon={Building2} span2 />
                  <Field label="Teléfono empresa" defaultValue="+1 800-555-0100" icon={Phone} />
                  <Field label="Sitio web" defaultValue="www.aromazhome.com" icon={Globe} />
                  <Field label="Estado / Región" defaultValue="New Jersey, USA" icon={MapPin} />
                  <Field label="Tasa de impuesto (%)" defaultValue="0" type="number" icon={Percent} />
                </div>
                <button onClick={handleSave} className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20">
                  {saved ? <><Check size={14} /> Guardado</> : 'Guardar cambios'}
                </button>
              </div>
            </Section>

            {/* ── APARIENCIA ── */}
            <Section id="apariencia" title="Apariencia" icon={Palette} accent="from-purple-50/60 to-white">
              <div className="px-6 py-5">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Idioma de la interfaz</label>
                <div className="flex gap-3">
                  {[{ val: 'es', label: 'Español 🇨🇱' }, { val: 'en', label: 'English 🇺🇸' }].map(({ val, label }) => (
                    <button key={val} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                      ${val === 'es'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* ── SEGURIDAD ── */}
            <Section id="seguridad" title="Seguridad" icon={Shield} accent="from-rose-50/60 to-white">
              <div className="p-6 space-y-4">
                {/* MFA card */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                  <MFAClient />
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">Contraseña</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Última actualización hace más de 30 días</div>
                  </div>
                  <button className="px-4 py-2 border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    Cambiar
                  </button>
                </div>

                {/* Sessions */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">Sesiones activas</div>
                    <div className="text-xs text-zinc-400 mt-0.5">1 dispositivo conectado actualmente</div>
                  </div>
                  <button className="px-4 py-2 border border-red-200 bg-white text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    Cerrar todas
                  </button>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  )
}
