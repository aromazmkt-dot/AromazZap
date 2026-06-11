'use client'

import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { n, money as moneyFmt, fmtDate } from '@/lib/fmt'

const PAID_STATUS: Record<string, { bg: string; color: string }> = {
  'Fully Paid':        { bg: 'var(--green-50)', color: 'var(--green-700)' },
  'Completed':         { bg: 'var(--green-50)', color: 'var(--green-700)' },
  'Partially Paid':    { bg: 'var(--amber-50)', color: 'var(--amber-700)' },
  'Invoice Confirmed': { bg: 'var(--brand-50)', color: 'var(--brand-700)' },
  'Invoice Signed':    { bg: 'var(--brand-50)', color: 'var(--brand-700)' },
  'Sent To Customer':  { bg: '#ECFEFF',          color: '#0E7490' },
  'New':               { bg: '#EEF1F6',           color: '#5B6776' },
  'Void':              { bg: '#EEF1F6',           color: '#94A3B8' },
  'Cancelled':         { bg: '#EEF1F6',           color: '#94A3B8' },
  'Over Paid':         { bg: '#EDE9FE',           color: '#5B21B6' },
}

function statusBadge(s: string | null) {
  const c = PAID_STATUS[s ?? ''] ?? { bg: '#EEF1F6', color: '#5B6776' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: 'currentColor', opacity: .9, flexShrink: 0 }} />
      {s || 'N/A'}
    </span>
  )
}

function money(v: number | null) { return moneyFmt(v) }
function fmt(d: string | null) { return fmtDate(d) }

const PAGE_SIZE = 50

type Invoice = {
  invoice_id: number
  invoice_number: string | null
  customer_name: string | null
  company_name: string | null
  paid_status: string | null
  invoice_type_name: string | null
  salesman: string | null
  total_sale: number | null
  total_payment: number | null
  balance: number | null
  invoice_date: string | null
  created_date: string | null
}

type InvoiceStats = {
  totalCount: number
  totalRevenue: number
  totalBalance: number
  paidCount: number
  partialCount: number
  partialBalance: number
}

const thStyle: React.CSSProperties = {
  background: 'var(--canvas-2)', textAlign: 'left',
  padding: '11px 16px', fontWeight: 700, color: 'var(--muted)',
  fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.6px',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
  position: 'sticky', top: 0, zIndex: 2,
}

const STATUS_GROUPS = ['Todos', 'Fully Paid', 'Partially Paid', 'New', 'Invoice Confirmed', 'Sent To Customer', 'Void']

export default function InvoicesClient({ invoices, stats }: { invoices: Invoice[]; stats: InvoiceStats }) {
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return invoices.filter(i => {
      if (statusFilter !== 'Todos' && i.paid_status !== statusFilter) return false
      if (!ql) return true
      return [i.invoice_number, i.customer_name, i.company_name, i.salesman]
        .some(v => v?.toLowerCase().includes(ql))
    })
  }, [invoices, q, statusFilter])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <>
      <Topbar title="Facturas" subtitle={`${n(stats.totalCount)} registros · Datos reales`} />

      {/* Stats */}
      <div className="kpi-grid">
        {[
          { label: 'Revenue Total', value: `$${(stats.totalRevenue / 1000000).toFixed(2)}M`, sub: `${n(stats.totalCount)} facturas históricas`, accent: true },
          { label: 'Pagadas', value: n(stats.paidCount), sub: `de ${n(stats.totalCount)} totales`, color: 'var(--green-700)', bg: 'var(--green-50)' },
          { label: 'Parciales', value: n(stats.partialCount), sub: `$${(stats.partialBalance / 1000).toFixed(0)}k pendiente`, color: 'var(--amber-700)', bg: 'var(--amber-50)' },
          { label: 'Por Cobrar', value: `$${(stats.totalBalance / 1000).toFixed(0)}k`, sub: 'saldo total pendiente', danger: stats.totalBalance > 100000 },
        ].map(({ label, value, sub, accent, color, bg, danger }) => (
          <div key={label} style={{
            background: accent ? 'linear-gradient(140deg, #2A8BD8, var(--brand-700) 75%)' : danger ? 'var(--red-50)' : bg ?? 'var(--card)',
            border: `1px solid ${accent || bg ? 'transparent' : danger ? 'var(--red-50)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)',
            position: 'relative', overflow: 'hidden',
          }}>
            {accent && <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: 'radial-gradient(closest-side, rgba(255,255,255,.16), transparent)' }} />}
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: accent ? 'rgba(255,255,255,.82)' : danger ? 'var(--red-700)' : color ?? 'var(--muted)' }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', color: accent ? '#fff' : danger ? 'var(--red-700)' : color ?? 'var(--ink)' }}>{value}</div>
            <div style={{ fontSize: 12, marginTop: 9, color: accent ? 'rgba(255,255,255,.82)' : 'var(--muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar-row" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="toolbar-search" style={{ position: 'relative', flex: 1, minWidth: 180, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input value={q} onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Buscar número, cliente, vendedor…"
            style={{ width: '100%', height: 40, padding: '0 12px 0 36px', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', fontSize: 13.5, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)' }} />
        </div>

        <div style={{ display: 'inline-flex', gap: 3, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 99, padding: 3, boxShadow: 'var(--shadow-sm)' }}>
          {STATUS_GROUPS.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }} style={{
              border: 0, background: statusFilter === s ? 'var(--brand)' : 'transparent',
              color: statusFilter === s ? '#fff' : 'var(--muted)',
              fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 99,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              boxShadow: statusFilter === s ? '0 2px 8px -2px rgba(30,127,204,.6)' : undefined,
            }}>{s === 'Todos' ? 'Todos' : s.replace('Invoice ', '').replace('Fully Paid', 'Pagadas').replace('Partially Paid', 'Parciales').replace('Sent To Customer', 'Enviadas')}</button>
          ))}
        </div>

        <span style={{ color: 'var(--muted)', fontSize: 12.5, fontWeight: 600, marginLeft: 'auto' }}>
          {n(filtered.length)} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div className="table-scroll" style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Número</th>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Tipo</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Saldo</th>
                <th style={thStyle}>Vendedor</th>
                <th style={thStyle}>Fecha</th>
                <th style={{ ...thStyle, width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>Sin resultados</td></tr>
              ) : rows.map((inv, i) => {
                const balance = Number(inv.balance || 0)
                return (
                  <tr key={inv.invoice_id} style={{ borderBottom: '1px solid #EFF2F7', background: inv.paid_status === 'Partially Paid' ? '#FFFDF5' : i % 2 === 1 ? '#FBFCFE' : undefined }}>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <b style={{ color: 'var(--ink)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{inv.invoice_number || `#${inv.invoice_id}`}</b>
                    </td>
                    <td style={{ padding: '11px 16px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink-2)', fontWeight: 500 }}>
                      {inv.customer_name || inv.company_name || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>{statusBadge(inv.paid_status)}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {inv.invoice_type_name || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {money(inv.total_sale)}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      <span style={{ color: balance > 0 ? 'var(--red-700)' : 'var(--faint)' }}>{balance > 0 ? money(balance) : '—'}</span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{inv.salesman || '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--faint)', whiteSpace: 'nowrap' }}>{fmt(inv.invoice_date || inv.created_date)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <a href={`/invoices/${inv.invoice_id}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Ver →</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '11px 16px', borderTop: '1px solid var(--line)', gap: 10 }}>
          <span style={{ marginRight: 'auto', color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>
            {n(page * PAGE_SIZE + 1)}–{n(Math.min((page + 1) * PAGE_SIZE, filtered.length))} de {n(filtered.length)}
          </span>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', opacity: page === 0 ? .4 : 1 }}>
            <ChevronLeft size={14} /> Anterior
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{page + 1} / {Math.max(1, pages)}</span>
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', opacity: page >= pages - 1 ? .4 : 1 }}>
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
