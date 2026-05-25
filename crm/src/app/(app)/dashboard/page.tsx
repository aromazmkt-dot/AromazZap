import Topbar from '@/components/layout/Topbar'
import { TrendingUp, Users, FileText, Receipt, AlertCircle, CheckCircle } from 'lucide-react'

function KpiCard({ label, value, sub, icon: Icon, trend, color }: {
  label: string; value: string; sub: string; icon: React.ElementType
  trend?: string; color: string
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-zinc-900 font-mono">{value}</div>
        <div className="text-xs text-zinc-500 mt-1">{sub}</div>
      </div>
      {trend && (
        <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
          <TrendingUp size={11} /> {trend}
        </div>
      )}
    </div>
  )
}

function PipelineStage({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm text-zinc-700">{label}</span>
      </div>
      <span className="text-sm font-semibold font-mono text-zinc-900">{count}</span>
    </div>
  )
}

export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Dashboard" subtitle="Semana 21 · 17–23 Mayo 2026" />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900">{greeting}, Marco.</h2>
          <p className="text-sm text-zinc-500 mt-1">Aquí está el resumen comercial de hoy.</p>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Ventas Semana" value="$84.320" sub="Meta: $108.000 · 78%" icon={TrendingUp} color="bg-blue-600" trend="+12.4% vs semana anterior" />
          <KpiCard label="Leads Activos" value="47" sub="8 nuevos esta semana" icon={Users} color="bg-violet-600" trend="+5 esta semana" />
          <KpiCard label="Cotizaciones" value="23" sub="6 pendientes de firma" icon={FileText} color="bg-amber-500" />
          <KpiCard label="Por Cobrar" value="$67.800" sub="3 facturas vencidas" icon={Receipt} color="bg-red-500" />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Pipeline funnel */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Embudo de Leads</h3>
              <a href="/leads" className="text-xs text-blue-600 hover:underline">Ver todos →</a>
            </div>
            <PipelineStage label="Nuevo" count={18} color="bg-zinc-400" />
            <PipelineStage label="Contactado" count={14} color="bg-blue-500" />
            <PipelineStage label="Calificado" count={9} color="bg-violet-500" />
            <PipelineStage label="Ganado" count={6} color="bg-emerald-500" />
            <PipelineStage label="Perdido" count={3} color="bg-red-400" />
            <div className="mt-3 pt-3 border-t border-zinc-100">
              <div className="text-xs text-zinc-500">Tasa de conversión</div>
              <div className="text-lg font-bold font-mono text-emerald-600">27%</div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Actividad Reciente</h3>
              <span className="text-xs text-zinc-400">Última actualización hace 5m</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: 'text-emerald-500', msg: 'Mike Thompson cerró venta — $12.000 hardwood', time: 'hace 1h' },
                { icon: FileText, color: 'text-blue-500', msg: 'Nueva cotización enviada a Peterson Family — $8.400', time: 'hace 2h' },
                { icon: AlertCircle, color: 'text-red-500', msg: 'Factura INV-2087 vencida — María Suárez · $2.340', time: 'hace 3h' },
                { icon: Users, color: 'text-violet-500', msg: 'Lead calificado: Chen Residence — Google Ads · $15k est.', time: 'hace 4h' },
                { icon: CheckCircle, color: 'text-emerald-500', msg: 'Cotización QT-1042 firmada — Robert Okafor', time: 'hace 5h' },
              ].map(({ icon: Icon, color, msg, time }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon size={15} className={`${color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700 leading-snug">{msg}</p>
                  </div>
                  <span className="text-xs text-zinc-400 whitespace-nowrap flex-shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/leads/new', label: 'Nuevo Lead', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200' },
            { href: '/customers/new', label: 'Nuevo Cliente', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
            { href: '/quotes/new', label: 'Nueva Cotización', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' },
            { href: '/invoices/new', label: 'Nueva Factura', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' },
          ].map(({ href, label, color }) => (
            <a
              key={href}
              href={href}
              className={`border rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${color}`}
            >
              {label}
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
