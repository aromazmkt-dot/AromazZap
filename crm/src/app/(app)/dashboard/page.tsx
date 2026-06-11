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
  label, value, sub, color, icon: Icon, href, progress,
}: {
  label: string; value: string; sub: string; color: string
  icon: React.ElementType; href: string; progress?: number
}) {
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{
        background: 'var(--card)',
        borderRadius: 18,
        padding: '20px 22px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow)',
        transition: 'transform .15s, box-shadow .15s',
        boxSizing: 'border-box',
      }}
        className="kpi-card-hover"
      >
        {/* Colored top stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: color, borderRadius: '18px 18px 0 0',
        }} />

        <div style={{ marginTop: 6 }}>
          {/* Icon + label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: `${color}18`, display: 'grid', placeItems: 'center',
              border: `1px solid ${color}28`,
            }}>
              <Icon size={16} color={color} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>
              {label}
            </span>
          </div>

          {/* Value */}
          <div style={{
            fontSize: 32, fontWeight: 900, color: 'var(--ink)',
            letterSpacing: '-.04em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </div>

          {/* Sub + arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{sub}</span>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: `${color}12`, display: 'grid', placeItems: 'center',
            }}>
              <ArrowUpRight size={13} color={color} />
            </div>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 5, background: `${color}18`, borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(100, progress)}%`,
                  background: color, borderRadius: 99, transition: 'width .5s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 600 }}>
                  {progress.toFixed(0)}% cobradas
                </span>
                <span style={{ fontSize: 10.5, color, fontWeight: 700 }}>
                  {progress.toFixed(0)}%
                </span>
              </div>
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
          color="#1E7FCC"
          icon={TrendingUp}
        />
        <KpiCard
          href="/leads"
          label={t(lang, 'dash.kpi.leads')}
          value={n(totalLeads)}
          sub={t(lang, 'dash.kpi.leads.sub')}
          color="#0D9488"
          icon={Users}
        />
        <KpiCard
          href="/invoices?status=Fully+Paid"
          label={t(lang, 'dash.kpi.paid')}
          value={n(paidCount)}
          sub={t(lang, 'dash.kpi.paid.sub', { total: n(totalCount) })}
          color="#16A34A"
          icon={CheckCircle2}
          progress={paidPct}
        />
        <KpiCard
          href="/invoices"
          label={t(lang, 'dash.kpi.balance')}
          value={`$${(totalBalance / 1_000).toFixed(0)}k`}
          sub={t(lang, 'dash.kpi.balance.sub', { count: n(Number(stats.partial_count)) })}
          color={totalBalance > 50_000 ? '#DC2626' : '#64748B'}
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
        .kpi-card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -8px rgba(0,0,0,.12); }
        .table-row-hover:hover { background: #F8FAFF !important; }
      `}</style>
    </>
  )
}
