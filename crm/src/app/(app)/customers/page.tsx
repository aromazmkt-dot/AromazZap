import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

function formatPhone(p: string | null) {
  return p || '—'
}

function formatCurrency(n: number | null) {
  if (!n) return '—'
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default async function CustomersPage() {
  const supabase = createAdminClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('customer_id, full_name, company_name, first_name, last_name, cell_phone, email, full_address, neighborhood, county, contact_type, status, num_invoices, invoice_balance, price, is_active, lead_source')
    .order('customer_id', { ascending: false })
    .limit(300)

  const rows = customers ?? []
  const active = rows.filter(c => c.is_active !== false)
  const withBalance = rows.filter(c => Number(c.invoice_balance) > 0)
  const totalRevenue = rows.reduce((s, c) => s + Number(c.price || 0), 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Clientes" subtitle={`${rows.length} clientes · Base de datos real`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Total Clientes</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">{rows.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">en base de datos</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Revenue Total</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">${(totalRevenue / 1000).toFixed(0)}k</div>
            <div className="text-xs text-zinc-500 mt-0.5">acumulado histórico</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Activos</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">{active.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">clientes activos</div>
          </div>
          <div className={`border rounded-xl p-4 ${withBalance.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${withBalance.length > 0 ? 'text-red-500' : 'text-zinc-500'}`}>Saldo Pendiente</div>
            <div className={`text-2xl font-bold font-mono ${withBalance.length > 0 ? 'text-red-600' : 'text-zinc-900'}`}>{withBalance.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">clientes con balance</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar clientes…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/customers/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nuevo Cliente
          </a>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Zona</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Revenue</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Facturas</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Saldo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fuente</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const balance = Number(c.invoice_balance || 0)
                const name = c.full_name || c.company_name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || '—'
                return (
                  <tr key={c.customer_id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-zinc-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{name}</div>
                          {c.company_name && c.full_name && <div className="text-xs text-zinc-400">{c.company_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {c.email && (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Mail size={11} /> {c.email}
                          </span>
                        )}
                        {c.cell_phone && (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                            <Phone size={11} /> {formatPhone(c.cell_phone)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {(c.neighborhood || c.county) && (
                        <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <MapPin size={11} className="text-zinc-400" />
                          {c.neighborhood || c.county}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-zinc-900">
                      {formatCurrency(c.price)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm text-zinc-700">
                      {c.num_invoices ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold">
                      <span className={balance > 0 ? 'text-red-600' : 'text-zinc-400'}>
                        {balance > 0 ? formatCurrency(balance) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{c.lead_source || '—'}</td>
                    <td className="px-4 py-3">
                      <a href={`/customers/${c.customer_id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
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
