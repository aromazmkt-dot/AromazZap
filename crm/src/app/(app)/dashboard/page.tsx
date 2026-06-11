import { createAdminClient } from '@/lib/supabase/admin'
import { n, money, fmtDate } from '@/lib/fmt'
import Topbar from '@/components/layout/Topbar'
import DashboardCharts from './DashboardCharts'
import { TrendingUp, Users, FileText, Receipt, AlertCircle, CheckCircle } from 'lucide-react'
import { getServerLang } from '@/lib/get-server-lang'
import { t } from '@/lib/i18n'

export const revalidate = 120

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
      .limit(6),
  ])

  const stats = statsRows?.[0] ?? {
    total_count: 0, total_revenue: 0, total_balance: 0,
    paid_count: 0, partial_count: 0, partial_balance: 0,
  }

  const totalRevenue = Number(stats.total_revenue)
  const totalBalance = Number(stats.total_balance)
  const paidCount = Number(stats.paid_count)
  const partialCount = Number(stats.partial_count)
  const totalCount = Number(stats.total_count)
  const totalLeads = leadsTotal ?? 0

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

      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{greeting}, Marco.</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{t(lang, 'dash.summary')}</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14, marginBottom: 20 }}>
        <a href="/invoices" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(140deg,#2A8BD8,var(--brand-700) 75%)', borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: 'radial-gradient(closest-side,rgba(255,255,255,.16),transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,.82)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t(lang, 'dash.kpi.revenue')}</span>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center' }}><TrendingUp size={16} color="#fff" /></div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>${(totalRevenue / 1000000).toFixed(2)}M</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', marginTop: 9 }}>{n(totalCount)} {t(lang, 'dash.kpi.revenue.sub')}</div>
          </div>
        </a>

        <a href="/leads" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(140deg,#12A39A,#0C746D 80%)', borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: 'radial-gradient(closest-side,rgba(255,255,255,.16),transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,.82)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t(lang, 'dash.kpi.leads')}</span>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center' }}><Users size={16} color="#fff" /></div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{n(totalLeads)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', marginTop: 9 }}>{t(lang, 'dash.kpi.leads.sub')}</div>
          </div>
        </a>

        <a href="/invoices?status=Fully+Paid" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t(lang, 'dash.kpi.paid')}</span>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--brand-50)', display: 'grid', placeItems: 'center' }}><FileText size={16} color="var(--brand)" /></div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{n(paidCount)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 9 }}>{t(lang, 'dash.kpi.paid.sub', { total: n(totalCount) })}</div>
          </div>
        </a>

        <a href="/invoices" style={{ textDecoration: 'none' }}>
          <div style={{ background: totalBalance > 50000 ? 'var(--red-50)' : 'var(--card)', border: `1px solid ${totalBalance > 50000 ? '#FEE2E2' : 'var(--line)'}`, borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: totalBalance > 50000 ? 'var(--red-700)' : 'var(--muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t(lang, 'dash.kpi.balance')}</span>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: totalBalance > 50000 ? '#FEE2E2' : 'var(--brand-50)', display: 'grid', placeItems: 'center' }}><Receipt size={16} color={totalBalance > 50000 ? 'var(--red-700)' : 'var(--brand)'} /></div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: totalBalance > 50000 ? 'var(--red-700)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>${(totalBalance / 1000).toFixed(0)}k</div>
            <div style={{ fontSize: 12, color: totalBalance > 50000 ? 'var(--red-700)' : 'var(--muted)', marginTop: 9 }}>{t(lang, 'dash.kpi.balance.sub', { count: n(partialCount) })}</div>
          </div>
        </a>
      </div>

      {/* Charts */}
      <DashboardCharts monthlyData={monthlyData} sourcesData={sourcesData} />

      {/* Recent invoices */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{t(lang, 'dash.recent')}</h3>
          <a href="/invoices" style={{ fontSize: 11.5, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>{t(lang, 'dash.recent.all')}</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(recentInvoices ?? []).map((inv, i) => {
            const isPaid = ['Fully Paid', 'Completed'].includes(inv.paid_status ?? '')
            const isPartial = inv.paid_status === 'Partially Paid'
            const Icon = isPaid ? CheckCircle : isPartial ? AlertCircle : Receipt
            const color = isPaid ? 'var(--green-700)' : isPartial ? 'var(--amber-700)' : 'var(--brand)'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--canvas-2)', borderRadius: 'var(--radius-sm)' }}>
                <Icon size={15} style={{ color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4, margin: 0 }}>
                    <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</b>
                    {' — '}{inv.customer_name} · <b style={{ fontWeight: 700 }}>{money(inv.total_sale)}</b>
                  </p>
                  <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 2, margin: 0 }}>{inv.salesman} · {inv.paid_status}</p>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--faint)', whiteSpace: 'nowrap', flexShrink: 0 }}>{fmtDate(inv.invoice_date)}</span>
                <a href={`/invoices/${inv.invoice_number}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>{t(lang, 'common.view')}</a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 16 }}>
        {[
          {
            href: '/leads', labelKey: 'nav.leads' as const, cta: t(lang, 'common.viewall'),
            bg: 'var(--brand-50)', color: 'var(--brand-700)', border: 'var(--brand-50)',
            stat: n(totalLeads), statLabel: t(lang, 'dash.nav.leads.sub'),
          },
          {
            href: '/customers', labelKey: 'nav.customers' as const, cta: t(lang, 'common.viewall'),
            bg: '#EFF6FF', color: '#1D4ED8', border: '#DBEAFE',
            stat: '11,432', statLabel: t(lang, 'dash.nav.customers.sub'),
          },
          {
            href: '/invoices', labelKey: 'nav.invoices' as const, cta: t(lang, 'common.viewall'),
            bg: 'var(--green-50)', color: 'var(--green-700)', border: '#BBF7D0',
            stat: n(totalCount), statLabel: t(lang, 'dash.nav.invoices.sub', { paid: n(paidCount) }),
          },
          {
            href: '/products', labelKey: 'nav.products' as const, cta: t(lang, 'common.viewall'),
            bg: 'var(--amber-50)', color: 'var(--amber-700)', border: '#FDE68A',
            stat: '405', statLabel: t(lang, 'dash.nav.products.sub'),
          },
        ].map(({ href, labelKey, cta, bg, color, border, stat, statLabel }) => (
          <a key={href} href={href} style={{ border: `1px solid ${border}`, background: bg, borderRadius: 'var(--radius)', padding: '16px 18px', textDecoration: 'none', display: 'block', transition: 'box-shadow .15s' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color }}>{t(lang, labelKey)}</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', color, marginTop: 10, fontVariantNumeric: 'tabular-nums' }}>{stat}</div>
            <div style={{ fontSize: 12, color, opacity: .75, marginTop: 6 }}>{statLabel}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color, marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>{cta}</div>
          </a>
        ))}
      </div>
    </>
  )
}
