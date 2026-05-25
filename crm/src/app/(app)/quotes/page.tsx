import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, FileText } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  expired: 'bg-amber-100 text-amber-700',
}
const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  expired: 'Vencida',
}

const MOCK_QUOTES = [
  { id: '1', number: 'QT-01042', customer: 'Peterson Family', date: '20 May 2026', validUntil: '03 Jun 2026', status: 'sent', total: 8400, lines: 4, rep: 'Mike T.' },
  { id: '2', number: 'QT-01041', customer: 'Riverstone Plaza HOA', date: '18 May 2026', validUntil: '01 Jun 2026', status: 'accepted', total: 24600, lines: 7, rep: 'Maria G.' },
  { id: '3', number: 'QT-01040', customer: 'Okafor Contracting', date: '15 May 2026', validUntil: '29 May 2026', status: 'draft', total: 13200, lines: 5, rep: 'John S.' },
  { id: '4', number: 'QT-01039', customer: 'Chen Residence', date: '12 May 2026', validUntil: '26 May 2026', status: 'sent', total: 6800, lines: 3, rep: 'Sarah K.' },
  { id: '5', number: 'QT-01038', customer: 'García Family', date: '08 May 2026', validUntil: '22 May 2026', status: 'expired', total: 4200, lines: 2, rep: 'Maria G.' },
  { id: '6', number: 'QT-01037', customer: 'Kowalski & Assoc.', date: '05 May 2026', validUntil: '19 May 2026', status: 'accepted', total: 18900, lines: 6, rep: 'Anya P.' },
  { id: '7', number: 'QT-01036', customer: 'Williams Residence', date: '01 May 2026', validUntil: '15 May 2026', status: 'rejected', total: 7100, lines: 3, rep: 'Greg D.' },
]

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
    </div>
  )
}

export default function QuotesPage() {
  const total = MOCK_QUOTES.reduce((s, q) => s + q.total, 0)
  const accepted = MOCK_QUOTES.filter(q => q.status === 'accepted')
  const pending = MOCK_QUOTES.filter(q => q.status === 'sent' || q.status === 'draft')

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Cotizaciones" subtitle={`${MOCK_QUOTES.length} cotizaciones · Este mes`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Pipeline" value={`$${(total / 1000).toFixed(0)}k`} sub="valor cotizado" />
          <StatCard label="Aceptadas" value={`$${(accepted.reduce((s, q) => s + q.total, 0) / 1000).toFixed(0)}k`} sub={`${accepted.length} cotizaciones`} />
          <StatCard label="Pendientes" value={String(pending.length)} sub="esperando respuesta" />
          <StatCard label="Tasa Cierre" value={`${Math.round(accepted.length / MOCK_QUOTES.length * 100)}%`} sub="del total enviadas" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar por número, cliente…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/quotes/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nueva Cotización
          </a>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
              {label}
              <span className="font-mono">{MOCK_QUOTES.filter(q => q.status === status).length}</span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Número</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Vence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Líneas</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rep.</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_QUOTES.map((q) => (
                <tr key={q.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-zinc-400" />
                      <span className="font-mono text-sm font-semibold text-zinc-900">{q.number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">{q.customer}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{q.date}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{q.validUntil}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[q.status]}`}>
                      {STATUS_LABELS[q.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-zinc-900">
                    ${q.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-zinc-600">{q.lines}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{q.rep}</td>
                  <td className="px-4 py-3">
                    <a href={`/quotes/${q.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
