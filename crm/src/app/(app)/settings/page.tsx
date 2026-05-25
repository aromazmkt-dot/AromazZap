import Topbar from '@/components/layout/Topbar'
import { User, Bell, Shield, Database, Globe, Palette } from 'lucide-react'

function SettingsSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center">
          <Icon size={14} className="text-zinc-600" />
        </div>
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      </div>
      <div className="divide-y divide-zinc-100">{children}</div>
    </div>
  )
}

function SettingsRow({ label, sub, children }: { label: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div>
        <div className="text-sm font-medium text-zinc-900">{label}</div>
        {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${enabled ? 'bg-blue-600' : 'bg-zinc-200'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Configuración" subtitle="Administra tu cuenta y preferencias" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Profile */}
          <SettingsSection icon={User} title="Perfil">
            <div className="px-5 py-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">MB</span>
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Marco Baeza</div>
                  <div className="text-sm text-zinc-500">marco@aromazhome.com</div>
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Admin</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Nombre completo</label>
                  <input defaultValue="Marco Baeza" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input defaultValue="marco@aromazhome.com" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Teléfono</label>
                  <input defaultValue="+1 201-555-0100" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Cargo</label>
                  <input defaultValue="General Manager" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Guardar cambios
              </button>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection icon={Bell} title="Notificaciones">
            <SettingsRow label="Nuevo lead asignado" sub="Recibe un email cuando un lead te es asignado">
              <Toggle enabled={true} />
            </SettingsRow>
            <SettingsRow label="Cotización aceptada" sub="Notificación cuando un cliente firma una cotización">
              <Toggle enabled={true} />
            </SettingsRow>
            <SettingsRow label="Factura vencida" sub="Alerta cuando una factura supera su fecha de vencimiento">
              <Toggle enabled={true} />
            </SettingsRow>
            <SettingsRow label="Resumen semanal" sub="Email con métricas cada lunes a las 8:00 AM">
              <Toggle enabled={false} />
            </SettingsRow>
          </SettingsSection>

          {/* Company */}
          <SettingsSection icon={Database} title="Empresa">
            <div className="px-5 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Nombre de la empresa</label>
                  <input defaultValue="Aromaz Home" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Teléfono empresa</label>
                  <input defaultValue="+1 800-555-0100" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Sitio web</label>
                  <input defaultValue="www.aromazhome.com" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Estado / Región</label>
                  <input defaultValue="New Jersey, USA" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Tasa de impuesto (%)</label>
                  <input defaultValue="0" type="number" step="0.01" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Guardar cambios
              </button>
            </div>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection icon={Palette} title="Apariencia">
            <SettingsRow label="Idioma" sub="Idioma de la interfaz">
              <select className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </SettingsRow>
          </SettingsSection>

          {/* Security */}
          <SettingsSection icon={Shield} title="Seguridad">
            <SettingsRow label="Autenticación de dos factores" sub="Agrega una capa extra de seguridad a tu cuenta">
              <Toggle enabled={false} />
            </SettingsRow>
            <div className="px-5 py-4">
              <button className="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                Cambiar contraseña
              </button>
            </div>
          </SettingsSection>

        </div>
      </main>
    </div>
  )
}
