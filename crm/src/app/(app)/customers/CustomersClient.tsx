'use client'

import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Plus, Search, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react'
import { n, money } from '@/lib/fmt'

const PAGE_SIZE = 50

type Customer = {
  customer_id: number
  full_name: string | null
  company_name: string | null
  first_name: string | null
  last_name: string | null
  cell_phone: string | null
  email: string | null
  full_address: string | null
  neighborhood: string | null
  county: string | null
  status: string | null
  num_invoices: number | null
  invoice_balance: number | null
  price: number | null
  is_active: boolean | null
  lead_source: string | null
}

const thStyle: React.CSSProperties = {
  background: 'var(--canvas-2)', textAlign: 'left',
  padding: '11px 16px', fontWeight: 700, color: 'var(--muted)',
  fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.6px',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
  position: 'sticky', top: 0, zIndex: 2,
}

export default function CustomersClient({ customers, totalCount }: { customers: Customer[]; totalCount: number }) {
  const [q, setQ] = useState('')
  const [onlyBalance, setOnlyBalance] = useState(false)
  const [page, setPage] = useState(0)

  const totalRevenue = useMemo(() => customers.reduce((s, c) => s + Number(c.price || 0), 0), [customers])
  const withBalance = useMemo(() => customers.filter(c => Number(c.invoice_balance) > 0).length, [customers])

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return customers.filter(c => {
      if (onlyBalance && !(Number(c.invoice_balance) > 0)) return false
      if (!ql) return true
      const name = c.full_name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()
      return [name, c.company_name, c.email, c.cell_phone, c.neighborhood, c.county, c.lead_source]
        .some(v => v?.toLowerCase().includes(ql))
    })
  }, [customers, q, onlyBalance])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <>
      <Topbar title="Clientes" subtitle={`${n(totalCount)} clientes · Mostrando ${customers.length}`} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {[
          { label: 'Total Clientes', value: n(totalCount), sub: 'en base de datos' },
          { label: 'Revenue Total', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'acumulado histórico' },
          { label: 'Activos', value: n(customers.filter(c => c.is_active !== false).length), sub: 'clientes activos' },
          { label: 'Con Saldo', value: n(withBalance), sub: 'balance pendiente', danger: withBalance > 0 },
        ].map(({ label, value, sub, danger }) => (
          <div key={label} style={{
            background: danger ? 'var(--red-50)' : 'var(--card)',
            border: `1px solid ${danger ? 'var(--red-50)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)', padding: '17px 18px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: danger ? 'var(--red-700)' : 'var(--muted)' }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: danger ? 'var(--red-700)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 9 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Buscar nombre, email, zona…"
            style={{
              width: '100%', height: 40, padding: '0 12px 0 36px',
              border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
              fontSize: 13.5, background: 'var(--card)', outline: 'none',
              fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        <button
          onClick={() => { setOnlyBalance(!onlyBalance); setPage(0) }}
          style={{
            height: 38, padding: '0 14px',
            border: `1px solid ${onlyBalance ? 'var(--red-700)' : 'var(--line)'}`,
            background: onlyBalance ? 'var(--red-50)' : 'var(--card)',
            color: onlyBalance ? 'var(--red-700)' : 'var(--ink-2)',
            borderRadius: 'var(--radius-sm)', fontSize: 12.5, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)',
          }}
        >
          {onlyBalance ? '✕ ' : ''}Con saldo pendiente
        </button>

        <span style={{ color: 'var(--muted)', fontSize: 12.5, fontWeight: 600 }}>
          {n(filtered.length)} resultado{filtered.length !== 1 ? 's' : ''}
        </span>

        <div style={{ marginLeft: 'auto' }}>
          <a href="/customers/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            height: 38, padding: '0 16px',
            background: 'var(--brand)', color: '#fff', border: 0,
            borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', textDecoration: 'none',
            boxShadow: '0 6px 16px -6px rgba(30,127,204,.6)',
          }}>
            <Plus size={15} /> Nuevo Cliente
          </a>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Contacto</th>
                <th style={thStyle}>Zona</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Revenue</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Facturas</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Saldo</th>
                <th style={{ ...thStyle, width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>Sin resultados</td></tr>
              ) : rows.map((c, i) => {
                const balance = Number(c.invoice_balance || 0)
                const name = c.full_name || c.company_name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || '—'
                return (
                  <tr key={c.customer_id} style={{ borderBottom: '1px solid #EFF2F7', background: i % 2 === 1 ? '#FBFCFE' : undefined }}>
                    <td style={{ padding: '11px 16px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{name}</b>
                      {c.company_name && c.full_name && <div style={{ fontSize: 11.5, color: 'var(--faint)' }}>{c.company_name}</div>}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {c.email && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--muted)' }}><Mail size={11} />{c.email}</span>}
                        {c.cell_phone && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--faint)', fontVariantNumeric: 'tabular-nums' }}><Phone size={11} />{c.cell_phone}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {c.neighborhood || c.county || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {money(c.price)}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-2)' }}>
                      {c.num_invoices ?? '—'}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      <span style={{ color: balance > 0 ? 'var(--red-700)' : 'var(--faint)' }}>
                        {balance > 0 ? money(balance) : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <a href={`/customers/${c.customer_id}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Ver →</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '11px 16px', borderTop: '1px solid var(--line)', gap: 10 }}>
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
