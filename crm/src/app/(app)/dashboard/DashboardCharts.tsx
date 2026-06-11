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

const SOURCE_PALETTE = ['#1E7FCC', '#F37920', '#16A34A', '#7C3AED', '#0E8A82', '#94A3B8', '#DB2777', '#CA8A04']

const QUICK = [
  { label: '3M',  months: 3 },
  { label: '6M',  months: 6 },
  { label: '12M', months: 12 },
  { label: '24M', months: 24 },
]

function fmtK(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return `$${v.toFixed(0)}`
}

function TooltipRevenue({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--brand)', fontWeight: 600 }}>{fmtK(payload[0]?.value ?? 0)}</div>
    </div>
  )
}

function TooltipBar({ active, payload, label, invoicesLabel }: { active?: boolean; payload?: { value: number }[]; label?: string; invoicesLabel: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#1E7FCC', fontWeight: 600 }}>{payload[0]?.value ?? 0} {invoicesLabel}</div>
    </div>
  )
}

function PieLabel({ cx, cy, midAngle, outerRadius, percent }: { cx: number; cy: number; midAngle: number; outerRadius: number; percent: number }) {
  if (percent < 0.07) return null
  const R = Math.PI / 180
  const x = cx + (outerRadius + 18) * Math.cos(-midAngle * R)
  const y = cy + (outerRadius + 18) * Math.sin(-midAngle * R)
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
      style={{ fontSize: 11, fill: 'var(--muted)', fontWeight: 600 }}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function DashboardCharts({
  monthlyData,
  sourcesData,
}: {
  monthlyData: MonthlyRow[]
  sourcesData: SourceRow[]
}) {
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
    if (quickRange !== null) {
      rows = monthlyData.slice(-quickRange)
    } else {
      rows = monthlyData.filter(d => d.month >= fromMonth && d.month <= toMonth)
    }
    return rows.map(d => ({ ...d, label: shortMonth(d.month) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyData, quickRange, fromMonth, toMonth, t])

  const periodRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const periodInvoices = chartData.reduce((s, d) => s + d.invoices, 0)
  const totalLeads = sourcesData.reduce((s, r) => s + r.count, 0)

  const inputStyle: React.CSSProperties = {
    height: 34, padding: '0 10px',
    border: '1px solid var(--line)', borderRadius: 8,
    fontSize: 12.5, background: 'var(--card)', color: 'var(--ink)',
    outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Revenue area chart */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('chart.revenue.title')}</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, margin: 0 }}>
              {t('chart.revenue.sub', { amount: fmtK(periodRevenue), invoices: n(periodInvoices) })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', gap: 3, background: 'var(--canvas-2)', border: '1px solid var(--line)', borderRadius: 99, padding: 3 }}>
              {QUICK.map(({ label, months }) => (
                <button key={label} onClick={() => { setQuickRange(months); setShowCustom(false) }} style={{
                  border: 0, fontSize: 11.5, fontWeight: 600, padding: '4px 11px', borderRadius: 99,
                  background: quickRange === months ? 'var(--brand)' : 'transparent',
                  color: quickRange === months ? '#fff' : 'var(--muted)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: quickRange === months ? '0 2px 8px -2px rgba(30,127,204,.5)' : undefined,
                }}>{label}</button>
              ))}
              <button onClick={() => setShowCustom(v => !v)} style={{
                border: 0, fontSize: 11.5, fontWeight: 600, padding: '4px 13px', borderRadius: 99,
                background: showCustom ? 'var(--ink)' : 'transparent',
                color: showCustom ? '#fff' : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{t('chart.range.custom')}</button>
            </div>
          </div>
        </div>

        {showCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '12px 14px', background: 'var(--canvas-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{t('chart.range.from')}</span>
            <input
              type="month" value={fromMonth} min={minMonth} max={toMonth}
              onChange={e => { setFromMonth(e.target.value); setQuickRange(null) }}
              style={inputStyle}
            />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{t('chart.range.to')}</span>
            <input
              type="month" value={toMonth} min={fromMonth} max={maxMonth}
              onChange={e => { setToMonth(e.target.value); setQuickRange(null) }}
              style={inputStyle}
            />
            <button
              onClick={() => setQuickRange(null)}
              style={{ height: 34, padding: '0 14px', border: 0, background: 'var(--brand)', color: '#fff', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >{t('chart.range.apply')}</button>
            {quickRange === null && (
              <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>
                {t('chart.range.selected', { n: n(chartData.length) })}
              </span>
            )}
          </div>
        )}

        {chartData.length === 0 ? (
          <div style={{ height: 200, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('chart.nodata')}</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1E7FCC" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E7FCC" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={54} />
              <Tooltip content={<TooltipRevenue />} />
              <Area type="monotone" dataKey="revenue" stroke="#1E7FCC" strokeWidth={2.5}
                fill="url(#gradRevenue)" dot={false}
                activeDot={{ r: 5, fill: '#1E7FCC', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie + Bar row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>

        {/* Lead sources pie */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)', border: '1px solid var(--line)' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('chart.sources.title')}</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, margin: 0 }}>{t('chart.sources.sub', { total: n(totalLeads) })}</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={sourcesData} dataKey="count" nameKey="source"
                cx="50%" cy="50%" outerRadius={60} innerRadius={32}
                labelLine={false} label={PieLabel as never}>
                {sourcesData.map((_, i) => (
                  <Cell key={i} fill={SOURCE_PALETTE[i % SOURCE_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
            {sourcesData.slice(0, 5).map((s, i) => (
              <div key={s.source} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: SOURCE_PALETTE[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>{s.source}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink)', flexShrink: 0 }}>{n(s.count)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices bar chart */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)', border: '1px solid var(--line)' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('chart.invoices.title')}</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, margin: 0 }}>{t('chart.invoices.sub')}</p>
          </div>
          {chartData.length === 0 ? (
            <div style={{ height: 180, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('common.nodata')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<TooltipBar invoicesLabel={t('nav.invoices').toLowerCase()} />} cursor={{ fill: 'var(--brand-50)' }} />
                <Bar dataKey="invoices" fill="#1E7FCC" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  )
}
