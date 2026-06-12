'use client'

import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Plus, Search, ChevronLeft, ChevronRight, Mail, Phone, AlertCircle, Users, DollarSign, Activity, X } from 'lucide-react'
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

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#1B6FC7', '#0D9488', '#7C3AED', '#DC2626',
  '#EA580C', '#0891B2', '#16A34A', '#9333EA',
]

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

export default function CustomersClient({ customers, totalCount }: { customers: Customer[]; totalCount: number }) {
  const [q, setQ] = useState('')
  const [onlyBalance, setOnlyBalance] = useState(false)
  const [page, setPage] = useState(0)

  const totalRevenue = useMemo(() => customers.reduce((s, c) => s + Number(c.price || 0), 0), [customers])
  const activeCount  = useMemo(() => customers.filter(c => c.is_active !== false).length, [customers])
  const withBalance  = useMemo(() => customers.filter(c => Number(c.invoice_balance) > 0).length, [customers])

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
  const rows  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const stats = [
    { label: 'Total Clientes', value: n(totalCount), sub: 'en base de datos', icon: Users, color: '#1B6FC7' },
    { label: 'Revenue Total', value: `$${(totalRevenue / 1_000_000).toFixed(1)}M`, sub: 'acumulado histórico', icon: DollarSign, color: '#0D9488' },
    { label: 'Activos', value: n(activeCount), sub: 'clientes activos', icon: Activity, color: '#16A34A' },
    { label: 'Con Saldo', value: n(withBalance), sub: 'balance pendiente', icon: AlertCircle, color: withBalance > 0 ? '#DC2626' : '#64748B' },
  ]

  return (
    <>
      <Topbar title="Clientes" subtitle={`${n(totalCount)} clientes · ${n(customers.length)} cargados`} />

      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} style={{
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 18, padding: '18px 20px',
            boxShadow: 'var(--shadow-card)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '18px 18px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 4 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Buscar nombre, email, zona, empresa…"
            style={{
              width: '100%', height: 40, padding: '0 36px 0 38px',
              border: '1px solid var(--line)', borderRadius: 10,
              fontSize: 13.5, background: 'var(--card)', outline: 'none',
              fontFamily: 'inherit', color: 'var(--ink)',
              boxShadow: 'var(--shadow-sm)', transition: 'border-color .15s',
            }}
          />
          {q && (
            <button onClick={() => setQ('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, cursor: 'pointer', color: 'var(--faint)', display: 'flex', padding: 2 }}>
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => { setOnlyBalance(v => !v); setPage(0) }}
          style={{
            height: 40, padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: 6,
            border: `1.5px solid ${onlyBalance ? '#DC2626' : 'var(--line)'}`,
            background: onlyBalance ? '#FEF2F2' : 'var(--card)',
            color: onlyBalance ? '#DC2626' : 'var(--ink-2)',
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: 'var(--shadow-sm)', transition: 'all .15s',
          }}
        >
          <AlertCircle size={13} />
          Con saldo pendiente
          {onlyBalance && <X size={12} />}
        </button>

        <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600, marginLeft: 2 }}>
          {n(filtered.length)} resultado{filtered.length !== 1 ? 's' : ''}
        </span>

        <a href="/customers/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 40, padding: '0 18px', marginLeft: 'auto',
          background: 'var(--brand)', color: '#fff',
          borderRadius: 10, fontSize: 13.5, fontWeight: 700,
          cursor: 'pointer', textDecoration: 'none',
          boxShadow: '0 4px 14px -4px rgba(27,111,199,.5)',
          transition: 'all .15s',
        }}>
          <Plus size={15} /> Nuevo Cliente
        </a>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 18, boxShadow: 'var(--shadow-card)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--canvas-2)' }}>
                {[
                  { label: 'Cliente', align: 'left' },
                  { label: 'Contacto', align: 'left' },
                  { label: 'Zona', align: 'left' },
                  { label: 'Revenue', align: 'right' },
                  { label: 'Facturas', align: 'center' },
                  { label: 'Saldo', align: 'right' },
                  { label: '', align: 'left' },
                ].map(({ label, align }) => (
                  <th key={label} style={{
                    padding: '11px 16px', textAlign: align as 'left' | 'right' | 'center',
                    fontSize: 10.5, fontWeight: 800, color: 'var(--muted)',
                    textTransform: 'uppercase', letterSpacing: '.06em',
                    whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
                    position: 'sticky', top: 0, zIndex: 2, background: 'var(--canvas-2)',
                  }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                    Sin resultados para &ldquo;{q}&rdquo;
                  </td>
                </tr>
              ) : rows.map((c) => {
                const balance = Number(c.invoice_balance || 0)
                const name = c.full_name || c.company_name || `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || '—'
                const ini = initials(name)
                const bg = avatarColor(c.customer_id)
                return (
                  <tr key={c.customer_id} style={{ borderBottom: '1px solid var(--line)', transition: 'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    {/* Cliente */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: bg, color: '#fff',
                          display: 'grid', placeItems: 'center',
                          fontSize: 12, fontWeight: 800, letterSpacing: '.02em',
                        }}>
                          {ini || '?'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{name}</div>
                          {c.company_name && c.full_name && (
                            <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 1 }}>{c.company_name}</div>
                          )}
                          {c.lead_source && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: 2, padding: '1px 7px', background: 'var(--brand-50)', borderRadius: 99, fontSize: 10, fontWeight: 700, color: 'var(--brand)' }}>
                              {c.lead_source}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {c.email && (
                          <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>
                            <Mail size={11} />{c.email}
                          </a>
                        )}
                        {c.cell_phone && (
                          <a href={`tel:${c.cell_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}>
                            <Phone size={11} />{c.cell_phone}
                          </a>
                        )}
                        {!c.email && !c.cell_phone && <span style={{ color: 'var(--faint)', fontSize: 12 }}>—</span>}
                      </div>
                    </td>

                    {/* Zona */}
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {c.neighborhood && c.county
                        ? <><span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{c.neighborhood}</span>, {c.county}</>
                        : c.neighborhood || c.county || '—'
                      }
                    </td>

                    {/* Revenue */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {c.price ? money(c.price) : <span style={{ color: 'var(--faint)' }}>—</span>}
                    </td>

                    {/* Facturas */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {c.num_invoices != null && c.num_invoices > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand)', fontSize: 12, fontWeight: 700 }}>{c.num_invoices}</span>
                        : <span style={{ color: 'var(--faint)' }}>—</span>
                      }
                    </td>

                    {/* Saldo */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {balance > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 7, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                            <AlertCircle size={10} />{money(balance)}
                          </span>
                        : <span style={{ color: 'var(--faint)', fontSize: 12 }}>—</span>
                      }
                    </td>

                    {/* Ver */}
                    <td style={{ padding: '12px 16px' }}>
                      <a href={`/customers/${c.customer_id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 12, color: 'var(--brand)', fontWeight: 700,
                        textDecoration: 'none', padding: '5px 10px',
                        borderRadius: 7, background: 'var(--brand-50)',
                        border: '1px solid var(--brand-100)',
                        transition: 'all .12s', whiteSpace: 'nowrap',
                      }}>
                        Ver →
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid var(--line)', gap: 10, background: 'var(--canvas-2)' }}>
          <span style={{ marginRight: 'auto', color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>
            {n(page * PAGE_SIZE + 1)}–{n(Math.min((page + 1) * PAGE_SIZE, filtered.length))} de {n(filtered.length)}
          </span>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 9, cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', opacity: page === 0 ? .4 : 1, transition: 'all .12s' }}>
            <ChevronLeft size={14} /> Anterior
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, minWidth: 60, textAlign: 'center' }}>
            {page + 1} / {Math.max(1, pages)}
          </span>
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 9, cursor: page >= pages - 1 ? 'not-allowed' : 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', opacity: page >= pages - 1 ? .4 : 1, transition: 'all .12s' }}>
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
