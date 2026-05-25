import Topbar from '@/components/layout/Topbar'
import { Plus, AlertTriangle, CheckCircle, Clock, Calendar, DollarSign } from 'lucide-react'

const CATEGORIES = [
  { key: 'insurance', label: 'Seguros', color: 'bg-blue-100 text-blue-700' },
  { key: 'license', label: 'Licencias negocio', color: 'bg-violet-100 text-violet-700' },
  { key: 'software', label: 'Software / SaaS', color: 'bg-cyan-100 text-cyan-700' },
  { key: 'vehicle', label: 'Vehículos', color: 'bg-amber-100 text-amber-700' },
  { key: 'vendor', label: 'Contratos proveedores', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'installer', label: 'Docs instaladores', color: 'bg-orange-100 text-orange-700' },
  { key: 'lease', label: 'Arrendamientos', color: 'bg-pink-100 text-pink-700' },
]

const TODAY = new Date(2026, 4, 25)

function daysUntil(dateStr: string): number {
  const [d, m, y] = dateStr.split(' ')
  const months: Record<string, number> = { Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11 }
  const date = new Date(Number(y), months[m] ?? 0, Number(d))
  return Math.round((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

const MOCK_OBLIGATIONS = [
  { id: '1', name: 'Workers Compensation Insurance', category: 'insurance', dueDate: '10 Jun 2026', amount: 4200, frequency: 'Anual', responsible: 'Anya P.', status: 'active', note: 'Travelers Insurance' },
  { id: '2', name: 'Business License — Short Hills', category: 'license', dueDate: '01 Jul 2026', amount: 350, frequency: 'Anual', responsible: 'Marco B.', status: 'active', note: 'Municipal — NJ' },
  { id: '3', name: 'FloorZap CRM Subscription', category: 'software', dueDate: '15 Jun 2026', amount: 890, frequency: 'Anual', responsible: 'Anya P.', status: 'active', note: 'Plan Enterprise' },
  { id: '4', name: 'Microsoft 365 Business', category: 'software', dueDate: '01 Aug 2026', amount: 1200, frequency: 'Anual', responsible: 'Anya P.', status: 'active', note: '10 licencias' },
  { id: '5', name: 'Truck #1 — Ford Transit 2022', category: 'vehicle', dueDate: '30 May 2026', amount: 185, frequency: 'Anual', responsible: 'Greg D.', status: 'active', note: 'Registración NJ' },
  { id: '6', name: 'Truck #2 — Sprinter 2021', category: 'vehicle', dueDate: '30 Jun 2026', amount: 185, frequency: 'Anual', responsible: 'Greg D.', status: 'active', note: 'Registración NJ' },
  { id: '7', name: 'Proveedor — Armstrong Flooring', category: 'vendor', dueDate: '01 Sep 2026', amount: 0, frequency: 'Anual', responsible: 'Marco B.', status: 'active', note: 'Acuerdo de distribución' },
  { id: '8', name: 'Local Short Hills — Contrato arrendamiento', category: 'lease', dueDate: '31 Dec 2026', amount: 8500, frequency: 'Mensual', responsible: 'Marco B.', status: 'active', note: 'Renovación automática' },
  { id: '9', name: 'Licencia Instalador — Roberto Castillo', category: 'installer', dueDate: '01 Jan 2027', amount: 150, frequency: 'Anual', responsible: 'Greg D.', status: 'active', note: 'NJ Contractor License' },
  { id: '10', name: 'Seguro — J&R Flooring Sub', category: 'installer', dueDate: '10 May 2026', amount: 0, frequency: 'Anual', responsible: 'Greg D.', status: 'overdue', note: 'Vencido — suspender trabajos' },
  { id: '11', name: 'General Liability Insurance', category: 'insurance', dueDate: '01 Oct 2026', amount: 6800, frequency: 'Anual', responsible: 'Anya P.', status: 'active', note: 'Hartford Business Insurance' },
  { id: '12', name: 'Business License — Edison', category: 'license', dueDate: '01 Nov 2026', amount: 280, frequency: 'Anual', responsible: 'Anya P.', status: 'active', note: 'Municipal — Edison NJ' },
]

function StatusBadge({ days, status }: { days: number; status: string }) {
  if (status === 'overdue' || days < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <AlertTriangle size={11} /> Vencido
      </span>
    )
  }
  if (days <= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <Clock size={11} /> {days}d
      </span>
    )
  }
  if (days <= 60) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <Clock size={11} /> {days}d
      </span>
    )
  }
  if (days <= 90) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <Clock size={11} /> {days}d
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      <CheckCircle size={11} /> Vigente
    </span>
  )
}

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]))

export default function ExpirationsPage() {
  const sorted = [...MOCK_OBLIGATIONS].sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
  const critical = MOCK_OBLIGATIONS.filter(o => daysUntil(o.dueDate) <= 30)
  const upcoming = MOCK_OBLIGATIONS.filter(o => { const d = daysUntil(o.dueDate); return d > 30 && d <= 90 })
  const totalAnnual = MOCK_OBLIGATIONS.filter(o => o.amount > 0).reduce((s, o) => s + (o.frequency === 'Mensual' ? o.amount * 12 : o.amount), 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Vencimientos y Obligaciones" subtitle={`${MOCK_OBLIGATIONS.length} registros · Alertas activas`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1">Críticos ≤ 30 días</div>
            <div className="text-2xl font-bold font-mono text-red-600">{critical.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">requieren acción urgente</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Próximos ≤ 90 días</div>
            <div className="text-2xl font-bold font-mono text-amber-600">{upcoming.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">en ventana de atención</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Total registros</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">{MOCK_OBLIGATIONS.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">obligaciones activas</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Comprometido / año</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">${(totalAnnual / 1000).toFixed(0)}k</div>
            <div className="text-xs text-zinc-500 mt-0.5">costos fijos proyectados</div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map(({ key, label, color }) => (
            <span key={key} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
              {label}
              <span className="font-mono">{MOCK_OBLIGATIONS.filter(o => o.category === key).length}</span>
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Calendar size={14} />
            <span>Buscar obligación…</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nueva Obligación
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Obligación</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Vencimiento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Monto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Frecuencia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Responsable</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sorted.map((ob) => {
                const days = daysUntil(ob.dueDate)
                const cat = CAT_MAP[ob.category]
                const rowBg = (ob.status === 'overdue' || days <= 0) ? 'bg-red-50/50' : days <= 30 ? 'bg-amber-50/30' : ''
                return (
                  <tr key={ob.id} className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${rowBg}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-900">{ob.name}</div>
                      {ob.note && <div className="text-xs text-zinc-400 mt-0.5">{ob.note}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat?.color}`}>
                        {cat?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 font-medium">{ob.dueDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge days={days} status={ob.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-zinc-700">
                      {ob.amount > 0 ? `$${ob.amount.toLocaleString()}` : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{ob.frequency}</td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{ob.responsible}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline font-medium">Ver →</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
