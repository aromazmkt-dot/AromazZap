'use client'

import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { n, fmtDate } from '@/lib/fmt'

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  'Google Search':    { bg: 'var(--brand-50)',  color: 'var(--brand-700)' },
  'Flags & Banners':  { bg: 'var(--amber-50)',  color: 'var(--amber-700)' },
  'Repeat':           { bg: 'var(--green-50)',  color: 'var(--green-700)' },
  'Walk-in':          { bg: '#EDE9FE',           color: '#5B21B6' },
  'Website':          { bg: '#ECFEFF',           color: '#0E7490' },
  'Referral':         { bg: 'var(--amber-50)',  color: '#92400E' },
  'ZapAssist AI':     { bg: '#FCE7F3',           color: '#9D174D' },
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'New':        { bg: 'var(--brand-50)', color: 'var(--brand-700)' },
  'Qualified':  { bg: 'var(--green-50)', color: 'var(--green-700)' },
  'In Progress':{ bg: 'var(--amber-50)', color: 'var(--amber-700)' },
  'Lost':       { bg: 'var(--red-50)',   color: 'var(--red-700)' },
  'Converted':  { bg: '#DCFCE7',         color: '#166534' },
}

function badge(map: Record<string, { bg: string; color: string }>, key: string | null, fallback = 'N/A') {
  const s = map[key ?? ''] ?? { bg: '#EEF1F6', color: '#5B6776' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: 'currentColor', opacity: .9, flexShrink: 0 }} />
      {key || fallback}
    </span>
  )
}


const PAGE_SIZE = 50

type Lead = {
  id: number
  full_name: string | null
  company_name: string | null
  cell_phone: string | null
  email: string | null
  lead_source: string | null
  lead_status: string | null
  stage: string | null
  created_by: string | null
  lead_date: string | null
  created_date: string | null
}

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [q, setQ] = useState('')
  const [sourceFilter, setSourceFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(0)

  const sources = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const l of leads) counts[l.lead_source || 'Sin fuente'] = (counts[l.lead_source || 'Sin fuente'] ?? 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [leads])

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return leads.filter(l => {
      if (sourceFilter !== 'Todos' && l.lead_source !== sourceFilter) return false
      if (statusFilter !== 'Todos' && l.lead_status !== statusFilter) return false
      if (!ql) return true
      return [l.full_name, l.company_name, l.email, l.cell_phone, l.lead_source, l.created_by]
        .some(v => v?.toLowerCase().includes(ql))
    })
  }, [leads, q, sourceFilter, statusFilter])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function setFilter(setter: (v: string) => void, val: string) {
    setter(val); setPage(0)
  }

  const thStyle: React.CSSProperties = {
    background: 'var(--canvas-2)', textAlign: 'left',
    padding: '11px 16px', fontWeight: 700, color: 'var(--muted)',
    fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.6px',
    whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
    position: 'sticky', top: 0, zIndex: 2,
  }

  return (
    <>
      <Topbar title="Leads" subtitle={`${n(leads.length)} registros · Datos reales`} />

      {/* Source pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {sources.map(([src, cnt]) => {
          const s = SOURCE_COLORS[src] ?? { bg: '#EEF1F6', color: '#5B6776' }
          const active = sourceFilter === src
          return (
            <button key={src} onClick={() => setFilter(setSourceFilter, active ? 'Todos' : src)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 99,
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
              border: active ? `1px solid ${s.color}40` : '1px solid transparent',
              background: active ? s.bg : 'var(--card)',
              color: active ? s.color : 'var(--muted)',
              boxShadow: 'var(--shadow-sm)',
              transition: '.15s',
            }}>
              {src} <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cnt}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Buscar nombre, email, teléfono…"
            style={{
              width: '100%', height: 40, padding: '0 12px 0 36px',
              border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
              fontSize: 13.5, background: 'var(--card)', outline: 'none',
              fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setFilter(setStatusFilter, e.target.value)}
          style={{
            height: 38, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
            background: 'var(--card)', fontSize: 12.5, fontWeight: 600,
            color: 'var(--ink-2)', padding: '0 8px', outline: 'none',
            fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
          }}
        >
          <option value="Todos">Todos los estados</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span style={{ color: 'var(--muted)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {n(filtered.length)} resultado{filtered.length !== 1 ? 's' : ''}
        </span>

        <div style={{ marginLeft: 'auto' }}>
          <a href="/leads/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            height: 38, padding: '0 16px',
            background: 'var(--brand)', color: '#fff', border: 0,
            borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', textDecoration: 'none',
            boxShadow: '0 6px 16px -6px rgba(30,127,204,.6)',
          }}>
            <Plus size={15} /> Nuevo Lead
          </a>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>Fuente</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Creado por</th>
                <th style={thStyle}>Fecha</th>
                <th style={{ ...thStyle, width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>
                    Sin resultados para "{q}"
                  </td>
                </tr>
              ) : rows.map((lead, i) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #EFF2F7', background: i % 2 === 1 ? '#FBFCFE' : undefined }}>
                  <td style={{ padding: '11px 16px', color: 'var(--ink-2)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{lead.full_name || lead.company_name || '—'}</b>
                    {lead.email && <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 1 }}>{lead.email}</div>}
                  </td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums', color: 'var(--muted)', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                    {lead.cell_phone || '—'}
                  </td>
                  <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                    {badge(SOURCE_COLORS, lead.lead_source)}
                  </td>
                  <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                    {badge(STATUS_COLORS, lead.lead_status)}
                  </td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                    {lead.created_by || '—'}
                  </td>
                  <td style={{ padding: '11px 16px', color: 'var(--faint)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {fmtDate(lead.lead_date || lead.created_date)}
                  </td>
                  <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                    <a href={`/leads/${lead.id}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Ver →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '11px 16px', borderTop: '1px solid var(--line)', gap: 10 }}>
          <span style={{ marginRight: 'auto', color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>
            {n(page * PAGE_SIZE + 1)}–{n(Math.min((page + 1) * PAGE_SIZE, filtered.length))} de {n(filtered.length)}
          </span>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 13px', border: '1px solid var(--line)',
              background: 'var(--card)', borderRadius: 9, cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)',
              opacity: page === 0 ? .4 : 1,
            }}
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{page + 1} / {Math.max(1, pages)}</span>
          <button
            onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 13px', border: '1px solid var(--line)',
              background: 'var(--card)', borderRadius: 9, cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)',
              opacity: page >= pages - 1 ? .4 : 1,
            }}
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
