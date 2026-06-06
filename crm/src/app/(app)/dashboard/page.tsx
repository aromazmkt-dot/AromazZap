import Topbar from '@/components/layout/Topbar'
import { TrendingUp, Users, FileText, Receipt, AlertCircle, CheckCircle } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

function KpiCard({ label, value, sub, icon: Icon, color, danger }: {
  label: string; value: string; sub: string; icon: React.ElementType
  color: string; danger?: boolean
}) {
  return (
    <div className={`border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${danger ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${danger ? 'text-red-500' : 'text-zinc-500'}`}>{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold font-mono ${danger ? 'text-red-700' : 'text-zinc-900'}`}>{value}</div>
        <div className="text-xs text-zinc-500 mt-1">{sub}</div>
      </div>
    </div>
  )
}

function PipelineRow({ label, count, color }: { label: string; count: number; color: string }) {
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

export default async function DashboardPage() {
  const supabase = createAdminClient()

  const [
    { data: invoiceStats },
    { data: leadsData },
    { data: paymentsData },
    { data: recentInvoices },
  ] = await Promise.all([
    supabase.from('invoices').select('total_sale, balance, paid_status, invoice_status'),
    supabase.from('leads').select('id, lead_source, lead_status, created_date').order('created_date', { ascending: false }).limit(529),
    supabase.from('payments').select('amount, payment_date').order('payment_date', { ascending: false }).limit(50),
    supabase.from('invoices').select('invoice_number, customer_name, total_sale, balance, paid_status, salesman, invoice_date').order('invoice_date', { ascending: false }).limit(5),
  ])

  const invoices = invoiceStats ?? []
  const leads = leadsData ?? []
  const payments = paymentsData ?? []

  const totalRevenue = invoices.reduce((s, i) => s + Number(i.total_sale || 0), 0)
  const totalBalance = invoices.reduce((s, i) => s + Math.max(0, Number(i.balance || 0)), 0)
  const partialCount = invoices.filter(i => i.paid_status === 'Partially Paid').length
  const paidCount = invoices.filter(i => ['Fully Paid', 'Completed'].includes(i.paid_status ?? '')).length
  const recentPayments = payments.slice(0, 10).reduce((s, p) => s + Number(p.amount || 0), 0)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Dashboard" subtitle="Datos reales · Aromaz Home" />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900">{greeting}, Marco.</h2>
          <p className="text-sm text-zinc-500 mt-1">Resumen operativo de Aromaz Home.</p>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Revenue Total"
            value={`$${(totalRevenue / 1000).toFixed(0)}k`}
            sub={`${invoices.length} facturas históricas`}
            icon={TrendingUp}
            color="bg-blue-600"
          />
          <KpiCard
            label="Leads en CRM"
            value={String(leads.length)}
            sub="registros importados"
            icon={Users}
            color="bg-violet-600"
          />
          <KpiCard
            label="Facturas Pagadas"
            value={String(paidCount)}
            sub={`de ${invoices.length} totales`}
            icon={FileText}
            color="bg-emerald-600"
          />
          <KpiCard
            label="Saldo Pendiente"
            value={`$${(totalBalance / 1000).toFixed(0)}k`}
            sub={`${partialCount} facturas parciales`}
            icon={Receipt}
            color="bg-red-500"
            danger={totalBalance > 50000}
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Lead sources */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Fuentes de Leads</h3>
              <a href="/leads" className="text-xs text-blue-600 hover:underline">Ver todos →</a>
            </div>
            {(() => {
              const counts: Record<string, number> = {}
              for (const l of leads) {
                const k = l.lead_source || 'Sin fuente'
                counts[k] = (counts[k] ?? 0) + 1
              }
              const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
              const colors = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-violet-500', 'bg-cyan-500', 'bg-zinc-400']
              return sorted.map(([src, cnt], i) => (
                <PipelineRow key={src} label={src} count={cnt} color={colors[i] ?? 'bg-zinc-400'} />
              ))
            })()}
          </div>

          {/* Recent invoices */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Facturas Recientes</h3>
              <a href="/invoices" className="text-xs text-blue-600 hover:underline">Ver todas →</a>
            </div>
            <div className="space-y-3">
              {(recentInvoices ?? []).map((inv, i) => {
                const isPaid = ['Fully Paid', 'Completed'].includes(inv.paid_status ?? '')
                const isPartial = inv.paid_status === 'Partially Paid'
                const Icon = isPaid ? CheckCircle : isPartial ? AlertCircle : Receipt
                const color = isPaid ? 'text-emerald-500' : isPartial ? 'text-amber-500' : 'text-blue-500'
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon size={15} className={`${color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-700 leading-snug">
                        {inv.invoice_number} — {inv.customer_name} ·{' '}
                        <span className="font-semibold">${Number(inv.total_sale || 0).toLocaleString()}</span>
                      </p>
                      <p className="text-xs text-zinc-400">{inv.salesman} · {inv.paid_status}</p>
                    </div>
                    <span className="text-xs text-zinc-400 whitespace-nowrap flex-shrink-0">
                      {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/leads', label: 'Ver Leads', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200' },
            { href: '/customers', label: 'Ver Clientes', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
            { href: '/invoices', label: 'Ver Facturas', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' },
            { href: '/products', label: 'Ver Productos', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' },
          ].map(({ href, label, color }) => (
            <a key={href} href={href} className={`border rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${color}`}>
              {label}
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
