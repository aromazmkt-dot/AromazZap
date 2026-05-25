import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Receipt, AlertCircle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  overdue: 'bg-red-100 text-red-600',
  cancelled: 'bg-zinc-100 text-zinc-400',
}
const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
}

const MOCK_INVOICES = [
  { id: '1', number: 'INV-02087', customer: 'María Suárez', date: '10 May 2026', dueDate: '25 May 2026', status: 'overdue', total: 2340, paid: 0, rep: 'Mike T.' },
  { id: '2', number: 'INV-02086', customer: 'Riverstone Plaza HOA', date: '18 May 2026', dueDate: '01 Jun 2026', status: 'sent', total: 24600, paid: 0, rep: 'Maria G.' },
  { id: '3', number: 'INV-02085', customer: 'Okafor Contracting', date: '12 May 2026', dueDate: '26 May 2026', status: 'paid', total: 13200, paid: 13200, rep: 'John S.' },
  { id: '4', number: 'INV-02084', customer: 'Kowalski & Assoc.', date: '08 May 2026', dueDate: '22 May 2026', status: 'overdue', total: 18900, paid: 9000, rep: 'Anya P.' },
  { id: '5', number: 'INV-02083', customer: 'Peterson Family', date: '05 May 2026', dueDate: '19 May 2026', status: 'paid', total: 8400, paid: 8400, rep: 'Mike T.' },
  { id: '6', number: 'INV-02082', customer: 'Chen Residence', date: '02 May 2026', dueDate: '16 May 2026', status: 'overdue', total: 6800, paid: 0, rep: 'Sarah K.' },
  { id: '7', number: 'INV-02081', customer: 'García Family', date: '28 Abr 2026', dueDate: '12 May 2026', status: 'paid', total: 4200, paid: 4200, rep: 'Maria G.' },
  { id: '8', number: 'INV-02080', customer: 'Williams Residence', date: '22 Abr 2026', dueDate: '06 May 2026', status: 'paid', total: 7100, paid: 7100, rep: 'Greg D.' },
]

function StatCard({ label, value, sub, danger }: { label: string; value: string; sub: string; danger?: boolean }) {
  return (
    <div className={`border rounded-xl p-4 ${danger ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${danger ? 'text-red-500' : 'text-zinc-500'}`}>{label}</div>
      <div className={`text-2xl font-bold font-mono ${danger ? 'text-red-600' : 'text-zinc-900'}`}>{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
    </div>
  )
}

export default function InvoicesPage() {
  const overdue = MOCK_INVOICES.filter(i => i.status === 'overdue')
  const pending = MOCK_INVOICES.filter(i => i.status === 'sent')
  const overdueAmt = overdue.reduce((s, i) => s + (i.total - i.paid), 0)
  const totalRevenue = MOCK_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.paid, 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Facturas" subtitle={`${MOCK_INVOICES.length} facturas · Este mes`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Cobrado" value={`$${(totalRevenue / 1000).toFixed(1)}k`} sub="este mes" />
          <StatCard label="Por Cobrar" value={`$${(pending.reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}k`} sub={`${pending.length} facturas`} />
          <StatCard label="Vencidas" value={String(overdue.length)} sub={`$${(overdueAmt / 1000).toFixed(1)}k en riesgo`} danger={overdue.length > 0} />
          <StatCard label="Tasa de Cobro" value={`${Math.round(MOCK_INVOICES.filter(i => i.status === 'paid').length / MOCK_INVOICES.length * 100)}%`} sub="del total emitidas" />
        </div>

        {/* Overdue alert */}
        {overdue.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">{overdue.length} factura{overdue.length > 1 ? 's' : ''} vencida{overdue.length > 1 ? 's' : ''}</p>
              <p className="text-xs text-red-500 mt-0.5">
                {overdue.map(i => `${i.number} (${i.customer})`).join(' · ')} — Total: ${overdueAmt.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar por número, cliente…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/invoices/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nueva Factura
          </a>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
              {label}
              <span className="font-mono">{MOCK_INVOICES.filter(i => i.status === status).length}</span>
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
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Emitida</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Vence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Saldo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rep.</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv) => {
                const balance = inv.total - inv.paid
                return (
                  <tr key={inv.id} className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${inv.status === 'overdue' ? 'bg-red-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Receipt size={14} className="text-zinc-400" />
                        <span className="font-mono text-sm font-semibold text-zinc-900">{inv.number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{inv.customer}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{inv.date}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[inv.status]}`}>
                        {STATUS_LABELS[inv.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-zinc-700">
                      ${inv.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold">
                      <span className={balance > 0 ? 'text-red-600' : 'text-emerald-600'}>
                        {balance > 0 ? `$${balance.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{inv.rep}</td>
                    <td className="px-4 py-3">
                      <a href={`/invoices/${inv.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
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
