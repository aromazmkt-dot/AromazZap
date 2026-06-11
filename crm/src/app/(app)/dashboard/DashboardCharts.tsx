'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { n } from '@/lib/fmt'
import { useLang } from '@/contexts/LanguageContext'

type MonthlyRow = { month: string; revenue: number; invoices: number; paid: number }
type SourceRow  = { source: string; count: number }

const SOURCE_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#14B8A6', '#F97316', '#EC4899', '#6366F1']

const QUICK = [
  { label: '3M',  months: 3  },
  { label: '6M',  months: 6  },
  { label: '12M', months: 12 },
  { label: '24M', months: 24 },
]

function fmtK(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return `$${v.toFixed(0)}`
}

function RevTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f172a', border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 20px 40px rgba(0,0,0,.4)', fontSize: 12,
    }}>
      <div style={{ color: 'rgba(255,255,255,.5)', fontWeight: 600, marginBottom: 5, fontSize: 11 }}>{label}</div>
      <div style={{ color: '#60A5FA', fontWeight: 800, fontSize: 16 }}>{fmtK(payload[0]?.value ?? 0)}</div>
    </div>
  )
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f172a', border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 20px 40px rgba(0,0,0,.4)', fontSize: 12,
    }}>
      <div style={{ color: 'rgba(255,255,255,.5)', fontWeight: 600, marginBottom: 5, fontSize: 11 }}>{label}</div>
      <div style={{ color: '#34D399', fontWeight: 800, fontSize: 16 }}>{payload[0]?.value ?? 0} facturas</div>
    </div>
  )
}

export default function DashboardCharts({ monthlyData, sourcesData }: { monthlyData: MonthlyRow[]; sourcesData: SourceRow[] }) {
  const { t } = useLang()

  const [quickRange, setQuickRange] = useState<number | null>(12)
  const [showCustom, setShowCustom] = useState(false)

  const allMonths = monthlyData.map(d => d.month).sort()
  const minMonth = allMonths[0] ?? ''
  const maxMonth = allMonths[allMonths.length - 1] ?? ''
  const [fromMonth, setFromMonth] = useState(minMonth)
  const [toMonth,   setToMonth]   = useState(maxMonth)

  function shortMonth(ym: string) {
    const [y, m] = ym.split('-')
    const key = `month.${m}` as Parameters<typeof t>[0]
    return `${t(key)} ${y.slice(2)}`
  }

  const chartData = useMemo(() => {
    let rows: MonthlyRow[]
    if (quickRange !== null) rows = monthlyData.slice(-quickRange)
    else rows = monthlyData.filter(d => d.month >= fromMonth && d.month <= toMonth)
    return rows.map(d => ({ ...d, label: shortMonth(d.month) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyData, quickRange, fromMonth, toMonth, t])

  const periodRevenue  = chartData.reduce((s, d) => s + d.revenue, 0)
  const periodInvoices = chartData.reduce((s, d) => s + d.invoices, 0)
  const totalLeads     = sourcesData.reduce((s, r) => s + r.count, 0)

  const cardStyle: React.CSSProperties = {
    background: 'var(--card)', borderRadius: 20,
    boxShadow: 'var(--shadow)', border: '1px solid var(--line)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Revenue area chart ── */}
      <div style={cardStyle}>
        <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>
              {t('chart.revenue.title')}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, margin: '3px 0 0' }}>
              {t('chart.revenue.sub', { amount: fmtK(periodRevenue), invoices: n(periodInvoices) })}
            </p>
          </div>

          {/* Range pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'inline-flex', gap: 2, background: '#F1F5F9', border: '1px solid var(--line)', borderRadius: 99, padding: '3px' }}>
              {QUICK.map(({ label, months }) => (
                <button key={label} onClick={() => { setQuickRange(months); setShowCustom(false) }} style={{
                  border: 0, fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 99, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all .15s',
                  background: quickRange === months ? 'var(--brand)' : 'transparent',
                  color: quickRange === months ? '#fff' : 'var(--muted)',
                  boxShadow: quickRange === months ? '0 2px 10px -2px rgba(30,127,204,.5)' : undefined,
                }}>{label}</button>
              ))}
              <button onClick={() => { setShowCustom(v => !v); setQuickRange(null) }} style={{
                border: 0, fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 99, cursor: 'pointer',
                fontFamily: 'inherit',
                background: showCustom ? 'var(--ink)' : 'transparent',
                color: showCustom ? '#fff' : 'var(--muted)',
              }}>{t('chart.range.custom')}</button>
            </div>
          </div>
        </div>

        {showCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 22px 0', padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{t('chart.range.from')}</span>
            <input type="month" value={fromMonth} min={minMonth} max={toMonth}
              onChange={e => { setFromMonth(e.target.value); setQuickRange(null) }}
              style={{ height: 34, padding: '0 10px', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'var(--ink)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{t('chart.range.to')}</span>
            <input type="month" value={toMonth} min={fromMonth} max={maxMonth}
              onChange={e => { setToMonth(e.target.value); setQuickRange(null) }}
              style={{ height: 34, padding: '0 10px', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'var(--ink)' }} />
            <button onClick={() => setQuickRange(null)} style={{ height: 34, padding: '0 14px', border: 0, background: 'var(--brand)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('chart.range.apply')}
            </button>
          </div>
        )}

        <div style={{ padding: '16px 8px 16px 0' }}>
          {chartData.length === 0
            ? <div style={{ height: 220, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('chart.nodata')}</div>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
                  <Tooltip content={<RevTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5}
                    fill="url(#gradRevenue)" dot={false}
                    activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* ── Pie + Bar row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>

        {/* Lead sources */}
        <div style={cardStyle}>
          <div style={{ padding: '18px 20px 10px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>
              {t('chart.sources.title')}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '3px 0 0' }}>
              {t('chart.sources.sub', { total: n(totalLeads) })}
            </p>
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={sourcesData} dataKey="count" nameKey="source"
                cx="50%" cy="50%" outerRadius={56} innerRadius={30}
                strokeWidth={2} stroke="var(--card)">
                {sourcesData.map((_, i) => (
                  <Cell key={i} fill={SOURCE_PALETTE[i % SOURCE_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sourcesData.slice(0, 5).map((s, i) => {
              const pct = totalLeads > 0 ? (s.count / totalLeads) * 100 : 0
              return (
                <div key={s.source}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: SOURCE_PALETTE[i], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{s.source}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{n(s.count)}</span>
                  </div>
                  <div style={{ height: 3, background: '#F1F5F9', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: SOURCE_PALETTE[i], borderRadius: 99 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Invoices bar */}
        <div style={cardStyle}>
          <div style={{ padding: '18px 22px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>
              {t('chart.invoices.title')}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '3px 0 0' }}>
              {t('chart.invoices.sub')}
            </p>
          </div>
          <div style={{ padding: '12px 8px 16px 0' }}>
            {chartData.length === 0
              ? <div style={{ height: 230, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('common.nodata')}</div>
              : (
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 0 }} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: '#F8FAFF', radius: 8 }} />
                    <Bar dataKey="invoices" radius={[6, 6, 2, 2]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={`url(#barGrad${i})`} />
                      ))}
                    </Bar>
                    <defs>
                      {chartData.map((_, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#10B981" stopOpacity={1} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
