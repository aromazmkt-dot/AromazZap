'use client'

import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Search, Package, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { n } from '@/lib/fmt'

type Product = {
  product_type: string
  source_product_id: number
  product_name: string | null
  style: string | null
  color: string | null
  sku: string | null
  category: string | null
  vendor: string | null
  unit_cost: number | null
  sales_price: number | null
  quantity: number | null
  available_quantity: number | null
  unit_measure: string | null
  is_stock: boolean | null
  discontinued: boolean | null
  visible: boolean | null
  description: string | null
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Carpet':                 { bg: 'var(--green-50)',  color: 'var(--green-700)' },
  'Installation Materials': { bg: '#EEF1F6',          color: '#5B6776' },
  'Remnant':                { bg: 'var(--amber-50)',  color: 'var(--amber-700)' },
  'Ceramic Tile':           { bg: 'var(--brand-50)',  color: 'var(--brand-700)' },
  'Vinyl/Resilient':        { bg: '#EDE9FE',           color: '#5B21B6' },
  'Resilient':              { bg: '#EDE9FE',           color: '#5B21B6' },
  'Laminate':               { bg: '#ECFEFF',           color: '#0E7490' },
  'Grout':                  { bg: '#F5F3FF',           color: '#6D28D9' },
  'Trim':                   { bg: '#FEF3C7',           color: '#92400E' },
  'Accessories':            { bg: '#EEF1F6',           color: '#475569' },
}

function catStyle(cat: string | null) {
  return CATEGORY_COLORS[cat ?? ''] ?? { bg: '#EEF1F6', color: '#5B6776' }
}

function margin(cost: number | null, price: number | null) {
  if (!cost || !price || price === 0) return null
  return ((price - cost) / price * 100)
}

const thStyle: React.CSSProperties = {
  background: 'var(--canvas-2)', textAlign: 'left',
  padding: '11px 16px', fontWeight: 700, color: 'var(--muted)',
  fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.6px',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
  position: 'sticky', top: 0, zIndex: 2,
}

const PAGE_SIZE = 50

export default function ProductsClient({ products }: { products: Product[] }) {
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('Todos')
  const [page, setPage] = useState(0)

  const active = useMemo(() => products.filter(p => !p.discontinued), [products])
  const outOfStock = useMemo(() => active.filter(p => p.is_stock && Number(p.available_quantity ?? p.quantity ?? 0) === 0), [active])
  const lowStock = useMemo(() => active.filter(p => {
    const qty = Number(p.available_quantity ?? p.quantity ?? 0)
    return p.is_stock && qty > 0 && qty < 50
  }), [active])

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of active) counts[p.category || 'Sin categoría'] = (counts[p.category || 'Sin categoría'] ?? 0) + 1
    return counts
  }, [active])
  const topCats = useMemo(() => Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 9), [catCounts])

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return active.filter(p => {
      if (catFilter !== 'Todos' && p.category !== catFilter) return false
      if (!ql) return true
      return [p.product_name, p.sku, p.vendor, p.category, p.style, p.color]
        .some(v => v?.toLowerCase().includes(ql))
    })
  }, [active, q, catFilter])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <>
      <Topbar title="Productos" subtitle={`${n(active.length)} activos · Catálogo real`} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {[
          { label: 'SKUs Activos', value: n(active.length), sub: 'en catálogo' },
          { label: 'Categorías', value: n(Object.keys(catCounts).length), sub: 'tipos de producto' },
          { label: 'Stock Bajo', value: n(lowStock.length), sub: 'requieren reorden', warn: lowStock.length > 0 },
          { label: 'Agotados', value: n(outOfStock.length), sub: 'sin stock', danger: outOfStock.length > 0 },
        ].map(({ label, value, sub, warn, danger }) => (
          <div key={label} style={{
            background: danger ? 'var(--red-50)' : warn ? 'var(--amber-50)' : 'var(--card)',
            border: `1px solid ${danger ? 'var(--red-50)' : warn ? 'var(--amber-50)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: danger ? 'var(--red-700)' : warn ? 'var(--amber-700)' : 'var(--muted)' }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', color: danger ? 'var(--red-700)' : warn ? 'var(--amber-700)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 9 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        <button onClick={() => { setCatFilter('Todos'); setPage(0) }} style={{
          padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
          border: catFilter === 'Todos' ? '1px solid var(--brand-700)' : '1px solid transparent',
          background: catFilter === 'Todos' ? 'var(--brand-50)' : 'var(--card)',
          color: catFilter === 'Todos' ? 'var(--brand-700)' : 'var(--muted)',
          cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
        }}>Todos</button>
        {topCats.map(([cat, cnt]) => {
          const s = catStyle(cat)
          const active2 = catFilter === cat
          return (
            <button key={cat} onClick={() => { setCatFilter(active2 ? 'Todos' : cat); setPage(0) }} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
              border: active2 ? `1px solid ${s.color}40` : '1px solid transparent',
              background: active2 ? s.bg : 'var(--card)',
              color: active2 ? s.color : 'var(--muted)',
              cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            }}>
              {cat} <span style={{ fontVariantNumeric: 'tabular-nums', opacity: .8 }}>{cnt}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 440 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input value={q} onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Buscar por nombre, SKU, proveedor…"
            style={{ width: '100%', height: 40, padding: '0 12px 0 36px', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', fontSize: 13.5, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)' }} />
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 12.5, fontWeight: 600, marginLeft: 'auto' }}>
          {n(filtered.length)} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 420px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Proveedor</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Costo</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Precio</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Margen</th>
                <th style={thStyle}>Stock</th>
                <th style={{ ...thStyle, width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>Sin resultados</td></tr>
              ) : rows.map((p, i) => {
                const qty = Number(p.available_quantity ?? p.quantity ?? 0)
                const mgn = margin(Number(p.unit_cost), Number(p.sales_price))
                const isOut = !!p.is_stock && qty === 0
                const isLow = !!p.is_stock && qty > 0 && qty < 50
                const s = catStyle(p.category)
                const productKey = `${p.product_type}-${p.source_product_id}`
                return (
                  <tr key={productKey} style={{ borderBottom: '1px solid #EFF2F7', background: i % 2 === 1 ? '#FBFCFE' : undefined }}>
                    <td style={{ padding: '11px 16px', maxWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <Package size={14} style={{ color: s.color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.product_name || '—'}
                          </div>
                          {p.color && <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 1 }}>{p.color}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {p.sku || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
                        {p.category || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {p.vendor || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 12.5, color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                      {p.unit_cost ? `$${Number(p.unit_cost).toFixed(2)}` : '—'}
                      {p.unit_measure && <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>/{p.unit_measure}</span>}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {p.sales_price ? `$${Number(p.sales_price).toFixed(2)}` : '—'}
                      {p.unit_measure && <span style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--faint)' }}>/{p.unit_measure}</span>}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {mgn !== null ? (
                        <span style={{ fontSize: 12.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: mgn >= 40 ? 'var(--green-700)' : mgn >= 20 ? 'var(--amber-700)' : 'var(--red-700)' }}>
                          {mgn.toFixed(0)}%
                        </span>
                      ) : <span style={{ color: 'var(--faint)' }}>—</span>}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      {p.is_stock ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {(isLow || isOut) && <AlertTriangle size={12} style={{ color: isOut ? 'var(--red-700)' : 'var(--amber-700)' }} />}
                          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5, fontWeight: 600, color: isOut ? 'var(--red-700)' : isLow ? 'var(--amber-700)' : 'var(--ink-2)' }}>
                            {n(qty)} {p.unit_measure}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11.5, color: 'var(--faint)' }}>No aplica</span>
                      )}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <a href={`/products/${encodeURIComponent(p.product_type)}/${p.source_product_id}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Ver →</a>
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
