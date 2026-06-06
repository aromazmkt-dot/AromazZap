import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Receipt, AlertCircle } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

const PAID_STATUS_COLORS: Record<string, string> = {
  'Fully Paid':        'bg-emerald-100 text-emerald-700',
  'Completed':         'bg-emerald-100 text-emerald-700',
  'Partially Paid':    'bg-amber-100 text-amber-700',
  'Invoice Confirmed': 'bg-blue-100 text-blue-700',
  'Invoice Signed':    'bg-blue-100 text-blue-700',
  'Sent To Customer':  'bg-cyan-100 text-cyan-700',
  'New':               'bg-zinc-100 text-zinc-600',
  'Reset':             'bg-zinc-100 text-zinc-500',
  'Void':              'bg-zinc-100 text-zinc-400',
  'Cancelled':         'bg-zinc-100 text-zinc-400',
  'Over Paid':         'bg-violet-100 text-violet-700',
}

function statusColor(s: string | null) {
  return PAID_STATUS_COLORS[s ?? ''] ?? 'bg-zinc-100 text-zinc-500'
}

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function money(n: number | null) {
  if (!n) return '—'
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default async function InvoicesPage() {
  const supabase = createAdminClient()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('invoice_id, invoice_number, customer_name, company_name, paid_status, invoice_status, salesman, total_sale, total_payment, balance, is_paid, invoice_date, created_date')
    .order('invoice_date', { ascending: false })
    .limit(300)

  const rows = invoices ?? []

  const partiallyPaid = rows.filter(i => i.paid_status === 'Partially Paid')
  const overdue = rows.filter(i => ['New', 'Invoice Confirmed', 'Invoice Signed', 'Sent To Customer'].includes(i.paid_status ?? ''))
  const paid = rows.filter(i => ['Fully Paid', 'Completed'].includes(i.paid_status ?? ''))

  const totalRevenue = rows.reduce((s, i) => s + Number(i.total_sale || 0), 0)
  const totalBalance = rows.reduce((s, i) => s + Number(i.balance || 0), 0)

  // Status pill counts
  const statusCounts: Record<string, number> = {}
  for (const inv of rows) {
    const k = inv.paid_status || 'N/A'
    statusCounts[k] = (statusCounts[k] ?? 0) + 1
  }
  const topStatuses = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Facturas" subtitle={`${rows.length} registros · Datos reales`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Revenue Total</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">${(totalRevenue / 1000).toFixed(0)}k</div>
            <div className="text-xs text-zinc-500 mt-0.5">{rows.length} facturas</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Pagadas</div>
            <div className="text-2xl font-bold font-mono text-emerald-600">{paid.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">fully paid + completed</div>
          </div>
          <div className={`border rounded-xl p-4 ${partiallyPaid.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-zinc-200'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${partiallyPaid.length > 0 ? 'text-amber-600' : 'text-zinc-500'}`}>Parciales</div>
            <div className={`text-2xl font-bold font-mono ${partiallyPaid.length > 0 ? 'text-amber-600' : 'text-zinc-900'}`}>{partiallyPaid.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">${(partiallyPaid.reduce((s, i) => s + Number(i.balance || 0), 0) / 1000).toFixed(0)}k pendiente</div>
          </div>
          <div className={`border rounded-xl p-4 ${totalBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${totalBalance > 0 ? 'text-red-500' : 'text-zinc-500'}`}>Saldo Total</div>
            <div className={`text-2xl font-bold font-mono ${totalBalance > 0 ? 'text-red-600' : 'text-zinc-900'}`}>${(totalBalance / 1000).toFixed(0)}k</div>
            <div className="text-xs text-zinc-500 mt-0.5">por cobrar</div>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {topStatuses.map(([status, count]) => (
            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusColor(status)}`}>
              {status} <span className="font-mono">{count}</span>
            </span>
          ))}
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
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Número</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Saldo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Vendedor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fecha</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => {
                const balance = Number(inv.balance || 0)
                const isPartial = inv.paid_status === 'Partially Paid'
                const customerName = inv.customer_name || inv.company_name || '—'
                return (
                  <tr key={inv.invoice_id} className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${isPartial ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Receipt size={14} className="text-zinc-400" />
                        <span className="font-mono text-sm font-semibold text-zinc-900">{inv.invoice_number || `#${inv.invoice_id}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(inv.paid_status)}`}>
                        {inv.paid_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-zinc-700">
                      {money(inv.total_sale)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold">
                      <span className={balance > 0 ? 'text-red-600' : 'text-zinc-300'}>
                        {balance > 0 ? money(balance) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{inv.salesman || '—'}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{fmt(inv.invoice_date)}</td>
                    <td className="px-4 py-3">
                      <a href={`/invoices/${inv.invoice_id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
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
