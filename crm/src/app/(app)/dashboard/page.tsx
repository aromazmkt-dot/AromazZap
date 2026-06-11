import { createAdminClient } from '@/lib/supabase/admin'
import { n, money, fmtDate } from '@/lib/fmt'
import Topbar from '@/components/layout/Topbar'
import DashboardCharts from './DashboardCharts'
import {
  TrendingUp, Users, CheckCircle2, AlertCircle,
  ArrowUpRight, Activity, Zap,
} from 'lucide-react'
import { getServerLang } from '@/lib/get-server-lang'
import { t } from '@/lib/i18n'

export const revalidate = 120

const STATUS_DOT: Record<string, string> = {
  'Fully Paid': '#16A34A', 'Completed': '#16A34A',
  'Partially Paid': '#F59E0B',
  'Invoice Confirmed': '#1E7FCC', 'Invoice Signed': '#1E7FCC',
  'New': '#94A3B8', 'Void': '#CBD5E1', 'Cancelled': '#CBD5E1',
}

function KpiCard({
  label, value, sub, accent, icon: Icon, href, progress,
}: {
  label: string; value: string; sub: string; accent: string
  icon: React.ElementType; href: string; progress?: number
}) {
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: accent,
        borderRadius: 20,
        padding: '20px 22px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .15s, box-shadow .15s',
      }}
        className="kpi-card-hover"
      >
        {/* Noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.04\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(255,255,255,.12), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>
              {label}
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>
              <Icon size={15} color="rgba(255,255,255,.9)" />
            </div>
          </div>

          <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{sub}</span>
            <ArrowUpRight size={14} color="rgba(255,255,255,.5)" />
          </div>

          {progress !== undefined && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, progress)}%`, background: 'rgba(255,255,255,.7)', borderRadius: 99, transition: 'width .5s ease' }} />
              </div>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.6)', marginTop: 4, display: 'block' }}>
                {progress.toFixed(0)}% completado
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

export default async function DashboardPage() {
  const supabase = createAdminClient()
  const lang = await getServerLang()

  const [
    { data: statsRows },
    { data: monthlyRows },
    { data: sourcesRows },
    { count: leadsTotal },
    { data: recentInvoices },
  ] = await Promise.all([
    supabase.rpc('invoice_stats'),
    supabase.rpc('monthly_revenue', { months_back: 24 }),
    supabase.rpc('leads_by_source'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase
      .from('invoices')
      .select('invoice_number, customer_name, total_sale, balance, paid_status, salesman, invoice_date')
      .order('invoice_date', { ascending: false, nullsFirst: false })
      .limit(7),
  ])

  const stats = statsRows?.[0] ?? {
    total_count: 0, total_revenue: 0, total_balance: 0,
    paid_count: 0, partial_count: 0, partial_balance: 0,
  }

  const totalRevenue  = Number(stats.total_revenue)
  const totalBalance  = Number(stats.total_balance)
  const paidCount     = Number(stats.paid_count)
  const totalCount    = Number(stats.total_count)
  const totalLeads    = leadsTotal ?? 0
  const paidPct       = totalCount > 0 ? (paidCount / totalCount) * 100 : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t(lang, 'dash.greeting.am') : hour < 18 ? t(lang, 'dash.greeting.pm') : t(lang, 'dash.greeting.night')

  const monthlyData = (monthlyRows ?? []).map((r: Record<string, unknown>) => ({
    month: r.month as string,
    revenue: Number(r.revenue),
    invoices: Number(r.invoice_count),
    paid: Number(r.paid_count),
  }))

  const sourcesData = (sourcesRows ?? []).map((r: Record<string, unknown>) => ({
    source: r.source as string,
    count: Number(r.cnt),
  }))

  return (
    <>
      <Topbar title={t(lang, 'dash.title')} subtitle={t(lang, 'dash.subtitle')} />

      {/* ── Greeting ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.03em', margin: 0 }}>
            {greeting}, Marco.
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, margin: 0 }}>
            {t(lang, 'dash.summary')}
          </p>
        </div>
        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 99, boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: '#16A34A', boxShadow: '0 0 0 3px #dcfce7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-2)' }}>Live · Datos reales</span>
          <Activity size={13} color="var(--muted)" />
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <KpiCard
          href="/invoices"
          label={t(lang, 'dash.kpi.revenue')}
          value={`$${(totalRevenue / 1_000_000).toFixed(2)}M`}
          sub={`${n(totalCount)} ${t(lang, 'dash.kpi.revenue.sub')}`}
          accent="linear-gradient(145deg, #1a6eb5 0%, #1244a0 60%, #0e3278 100%)"
          icon={TrendingUp}
        />
        <KpiCard
          href="/leads"
          label={t(lang, 'dash.kpi.leads')}
          value={n(totalLeads)}
          sub={t(lang, 'dash.kpi.leads.sub')}
          accent="linear-gradient(145deg, #0d9488 0%, #0a7a70 60%, #065e57 100%)"
          icon={Users}
        />
        <KpiCard
          href="/invoices?status=Fully+Paid"
          label={t(lang, 'dash.kpi.paid')}
          value={n(paidCount)}
          sub={t(lang, 'dash.kpi.paid.sub', { total: n(totalCount) })}
          accent="linear-gradient(145deg, #16a34a 0%, #127a38 60%, #0d5c2a 100%)"
          icon={CheckCircle2}
          progress={paidPct}
        />
        <KpiCard
          href="/invoices"
          label={t(lang, 'dash.kpi.balance')}
          value={`$${(totalBalance / 1_000).toFixed(0)}k`}
          sub={t(lang, 'dash.kpi.balance.sub', { count: n(Number(stats.partial_count)) })}
          accent={totalBalance > 50_000
            ? 'linear-gradient(145deg, #dc2626 0%, #b91c1c 60%, #921515 100%)'
            : 'linear-gradient(145deg, #475569 0%, #334155 60%, #1e293b 100%)'}
          icon={AlertCircle}
        />
      </div>

      {/* ── Charts ── */}
      <DashboardCharts monthlyData={monthlyData} sourcesData={sourcesData} />

      {/* ── Recent invoices ── */}
      <div style={{
        background: 'var(--card)', borderRadius: 20,
        boxShadow: 'var(--shadow)', border: '1px solid var(--line)',
        marginTop: 16, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--brand-50)', display: 'grid', placeItems: 'center' }}>
              <Zap size={15} color="var(--brand)" />
            </div>
            <div>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>
                {t(lang, 'dash.recent')}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, marginTop: 1 }}>Últimas 7 transacciones</p>
            </div>
          </div>
          <a href="/invoices" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: 'var(--brand)', fontWeight: 700,
            textDecoration: 'none', padding: '6px 12px',
            background: 'var(--brand-50)', borderRadius: 99,
            transition: 'all .15s',
          }}>
            {t(lang, 'dash.recent.all')} <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#FAFBFD' }}>
                {['N° Factura', 'Cliente', 'Total', 'Saldo', 'Estado', 'Vendedor', 'Fecha'].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 18px', textAlign: i >= 2 && i <= 3 ? 'right' : 'left',
                    fontSize: 10, fontWeight: 800, color: 'var(--muted)',
                    textTransform: 'uppercase', letterSpacing: '.08em',
                    borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentInvoices ?? []).map((inv, i) => {
                const balance = Number(inv.balance ?? 0)
                const dotColor = STATUS_DOT[inv.paid_status ?? ''] ?? '#94A3B8'
                return (
                  <tr key={i} style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background .12s',
                  }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '13px 18px', whiteSpace: 'nowrap' }}>
                      <a href={`/invoices/${inv.invoice_number}`} style={{ fontWeight: 700, color: 'var(--brand)', textDecoration: 'none', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                        {inv.invoice_number}
                      </a>
                    </td>
                    <td style={{ padding: '13px 18px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink-2)', fontWeight: 500 }}>
                      {inv.customer_name}
                    </td>
                    <td style={{ padding: '13px 18px', textAlign: 'right', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {money(inv.total_sale)}
                    </td>
                    <td style={{ padding: '13px 18px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      <span style={{ color: balance > 0 ? 'var(--red-700)' : 'var(--faint)', fontWeight: balance > 0 ? 700 : 400 }}>
                        {balance > 0 ? money(balance) : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 99,
                        fontSize: 11, fontWeight: 700,
                        background: `${dotColor}18`, color: dotColor,
                        border: `1px solid ${dotColor}30`,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: 99, background: dotColor, flexShrink: 0 }} />
                        {inv.paid_status ?? 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px', color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {inv.salesman ?? '—'}
                    </td>
                    <td style={{ padding: '13px 18px', color: 'var(--faint)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {fmtDate(inv.invoice_date)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #dcfce7; }
          50% { box-shadow: 0 0 0 5px #bbf7d0; }
        }
        .kpi-card-hover:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -12px rgba(0,0,0,.25); }
        .table-row-hover:hover { background: #F8FAFF !important; }
      `}</style>
    </>
  )
}
