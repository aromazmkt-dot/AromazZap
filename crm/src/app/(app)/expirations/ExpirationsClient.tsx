'use client'

import { useState, useMemo, useTransition } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Search, Plus, X, ChevronUp, ChevronDown, RefreshCw, Trash2 } from 'lucide-react'
import { n } from '@/lib/fmt'
import { useLang } from '@/contexts/LanguageContext'
import type { DictKey } from '@/lib/i18n'
import type { Obligation } from './actions'
import { createObligation, updateObligation, deleteObligation, renewObligation } from './actions'

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'insurance',  bg: 'var(--brand-50)',  color: 'var(--brand-700)' },
  { key: 'license',   bg: '#EDE9FE',         color: '#5B21B6' },
  { key: 'software',  bg: '#ECFEFF',         color: '#0E7490' },
  { key: 'vehicle',   bg: 'var(--amber-50)', color: 'var(--amber-700)' },
  { key: 'vendor',    bg: 'var(--green-50)', color: 'var(--green-700)' },
  { key: 'installer', bg: '#FEF3C7',         color: '#92400E' },
  { key: 'lease',     bg: '#FCE7F3',         color: '#9D174D' },
] as const

type CatKey = typeof CATEGORIES[number]['key']
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c])) as unknown as Record<CatKey, { bg: string; color: string }>

const FREQUENCY_OPTIONS = ['Anual', 'Mensual', 'Trimestral', 'Único']
const RESPONSIBLE_OPTIONS = ['Marco B.', 'Anya P.', 'Greg D.', 'Daniel R.']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return Math.round((due.getTime() - today.getTime()) / 86_400_000)
}

function obligationStatus(days: number) {
  if (days < 0)    return 'overdue'
  if (days <= 30)  return 'critical'
  if (days <= 90)  return 'upcoming'
  return 'ok'
}

function fmtOblDate(d: string | null | undefined, monthNames: string[]) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${Number(day)} ${monthNames[Number(m) - 1]} ${y}`
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  background: 'var(--canvas-2)', textAlign: 'left',
  padding: '11px 16px', fontWeight: 700, color: 'var(--muted)',
  fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.6px',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--line)',
  position: 'sticky', top: 0, zIndex: 2, cursor: 'pointer', userSelect: 'none',
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 40, padding: '0 12px',
  border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
  fontSize: 13.5, background: 'var(--canvas-2)', outline: 'none',
  fontFamily: 'inherit', color: 'var(--ink)',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10.5, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '.6px',
  color: 'var(--muted)', marginBottom: 5,
}

// ─── Obligation Form ──────────────────────────────────────────────────────────

function ObligationForm({
  initial, onSave, onCancel, isSaving, t,
}: {
  initial?: Partial<Obligation>
  onSave: (data: Omit<Obligation, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
  isSaving: boolean
  t: (key: DictKey, vars?: Record<string, string | number>) => string
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    subtitle: initial?.subtitle ?? '',
    category: initial?.category ?? 'insurance',
    due_date: initial?.due_date ?? '',
    start_date: initial?.start_date ?? '',
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? 'USD',
    frequency: initial?.frequency ?? 'Anual',
    responsible: initial?.responsible ?? '',
    notes: initial?.notes ?? '',
    auto_renew: initial?.auto_renew ?? false,
  })

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...form,
      subtitle: form.subtitle || null,
      start_date: form.start_date || null,
      notes: form.notes || null,
      responsible: form.responsible || null,
      amount: Number(form.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{t('exp.form.name')} *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required style={inputStyle} placeholder={t('exp.form.name.ph')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{t('exp.form.subtitle')}</label>
          <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} style={inputStyle} placeholder={t('exp.form.subtitle.ph')} />
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.category')} *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{t(`cat.${c.key}`)}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.responsible')}</label>
          <select value={form.responsible} onChange={e => set('responsible', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">{t('common.unassigned')}</option>
            {RESPONSIBLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.duedate')} *</label>
          <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.startdate')}</label>
          <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.amount')}</label>
          <input type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('exp.form.frequency')}</label>
          <select value={form.frequency} onChange={e => set('frequency', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{t('exp.form.notes')}</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }}
            placeholder={t('exp.form.notes.ph')} />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="auto_renew" checked={form.auto_renew} onChange={e => set('auto_renew', e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--brand)' }} />
          <label htmlFor="auto_renew" style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, cursor: 'pointer' }}>
            {t('exp.form.autorenew')}
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
        <button type="submit" disabled={isSaving} style={{
          flex: 1, height: 40, border: 0, background: 'var(--brand)', color: '#fff',
          borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
          cursor: isSaving ? 'wait' : 'pointer', fontFamily: 'inherit',
          opacity: isSaving ? .7 : 1,
        }}>{isSaving ? t('common.saving') : initial?.id ? t('exp.form.save') : t('exp.form.create')}</button>
        <button type="button" onClick={onCancel} style={{
          height: 40, padding: '0 16px', border: '1px solid var(--line)',
          background: 'var(--card)', color: 'var(--ink-2)',
          borderRadius: 'var(--radius-sm)', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
        }}>{t('common.cancel')}</button>
      </div>
    </form>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type SortKey = 'due_date' | 'name' | 'amount' | 'responsible'

export default function ExpirationsClient({ obligations: initial }: { obligations: Obligation[] }) {
  const { t, lang } = useLang()

  const MONTHS = ['month.01','month.02','month.03','month.04','month.05','month.06',
                  'month.07','month.08','month.09','month.10','month.11','month.12']
    .map(k => t(k as Parameters<typeof t>[0]))

  function StatusBadge({ days }: { days: number }) {
    const status = obligationStatus(days)
    const cfg = {
      overdue:  { bg: 'var(--red-50)',   color: 'var(--red-700)',   text: t('exp.status.overdue') },
      critical: { bg: 'var(--red-50)',   color: 'var(--red-700)',   text: `${days}d` },
      upcoming: { bg: 'var(--amber-50)', color: 'var(--amber-700)', text: `${days}d` },
      ok:       { bg: 'var(--green-50)', color: 'var(--green-700)', text: t('exp.status.vigente') },
    }[status]
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: 'currentColor', flexShrink: 0 }} />
        {cfg.text}
      </span>
    )
  }

  const [obligations, setObligations] = useState<Obligation[]>(initial)
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('due_date')
  const [sortAsc, setSortAsc] = useState(true)

  const [detailId, setDetailId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [renewId, setRenewId] = useState<string | null>(null)
  const [renewNotes, setRenewNotes] = useState('')

  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)

  const enriched = useMemo(() => obligations.map(o => ({
    ...o, days: daysUntil(o.due_date), status: obligationStatus(daysUntil(o.due_date)),
  })), [obligations])

  const critical = enriched.filter(o => o.status === 'critical' || o.status === 'overdue').length
  const upcoming = enriched.filter(o => o.status === 'upcoming').length
  const totalAnnual = obligations.reduce((s, o) => {
    if (!o.amount || o.amount === 0) return s
    return s + (o.frequency === 'Mensual' ? o.amount * 12 : o.frequency === 'Trimestral' ? o.amount * 4 : o.amount)
  }, 0)

  const STATUS_FILTERS = [
    { key: 'all',     label: t('exp.filter.all') },
    { key: 'overdue', label: t('exp.filter.overdue') },
    { key: 'critical',label: t('exp.filter.critical') },
    { key: 'upcoming',label: t('exp.filter.upcoming') },
    { key: 'ok',      label: t('exp.filter.ok') },
  ]

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return enriched.filter(o => {
      if (catFilter.length > 0 && !catFilter.includes(o.category)) return false
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!ql) return true
      const catLabel = t(`cat.${o.category}` as Parameters<typeof t>[0])
      return [o.name, o.subtitle, o.responsible, catLabel]
        .some(v => v?.toLowerCase().includes(ql))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enriched, q, catFilter, statusFilter, lang])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number, bv: string | number
      if (sortKey === 'due_date') { av = a.days; bv = b.days }
      else if (sortKey === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
      else if (sortKey === 'amount') { av = a.amount; bv = b.amount }
      else { av = (a.responsible ?? '').toLowerCase(); bv = (b.responsible ?? '').toLowerCase() }
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortAsc])

  const detailOb = enriched.find(o => o.id === detailId) ?? null
  const editOb   = obligations.find(o => o.id === editId) ?? null
  const deleteOb = obligations.find(o => o.id === deleteId) ?? null
  const renewOb  = enriched.find(o => o.id === renewId) ?? null

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(v => !v)
    else { setSortKey(key); setSortAsc(true) }
  }

  function toggleCat(key: string) {
    setCatFilter(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function handleCreate(data: Omit<Obligation, 'id' | 'created_at' | 'updated_at'>) {
    setActionError(null)
    startTransition(async () => {
      try {
        await createObligation(data)
        const tmp: Obligation = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        setObligations(prev => [...prev, tmp])
        setShowCreate(false)
      } catch (e) { setActionError(e instanceof Error ? e.message : 'Error') }
    })
  }

  function handleEdit(data: Omit<Obligation, 'id' | 'created_at' | 'updated_at'>) {
    if (!editId) return
    setActionError(null)
    startTransition(async () => {
      try {
        await updateObligation(editId, data)
        setObligations(prev => prev.map(o => o.id === editId ? { ...o, ...data, updated_at: new Date().toISOString() } : o))
        setEditId(null)
      } catch (e) { setActionError(e instanceof Error ? e.message : 'Error') }
    })
  }

  function handleDelete() {
    if (!deleteId) return
    setActionError(null)
    startTransition(async () => {
      try {
        await deleteObligation(deleteId)
        setObligations(prev => prev.filter(o => o.id !== deleteId))
        setDeleteId(null)
        if (detailId === deleteId) setDetailId(null)
      } catch (e) { setActionError(e instanceof Error ? e.message : 'Error') }
    })
  }

  function handleRenew() {
    if (!renewOb) return
    setActionError(null)
    startTransition(async () => {
      try {
        const newDate = await renewObligation(renewOb.id, renewOb.due_date, renewOb.frequency, renewNotes || undefined)
        setObligations(prev => prev.map(o => o.id === renewOb.id ? { ...o, due_date: newDate, notes: renewNotes || o.notes, updated_at: new Date().toISOString() } : o))
        setRenewId(null)
        setRenewNotes('')
      } catch (e) { setActionError(e instanceof Error ? e.message : 'Error') }
    })
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(10,28,51,.45)',
    zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(2px)',
  }
  const panelStyle: React.CSSProperties = {
    background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: '0 24px 80px rgba(0,0,0,.22)',
    padding: '28px 32px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: .3, fontSize: 9, marginLeft: 3 }}>↕</span>
    return sortAsc ? <ChevronUp size={11} style={{ marginLeft: 3, display: 'inline' }} /> : <ChevronDown size={11} style={{ marginLeft: 3, display: 'inline' }} />
  }

  const resultCount = sorted.length === 1 ? t('common.results_one') : t('common.results_other', { n: n(sorted.length) })

  return (
    <>
      <Topbar title={t('exp.title')} subtitle={`${n(obligations.length)} · ${n(critical)} ${t('exp.filter.critical').toLowerCase()}`} />

      {/* KPI Cards */}
      <div className="kpi-grid">
        {[
          { label: t('exp.kpi.critical'), value: n(critical), sub: t('exp.kpi.critical.sub'), danger: critical > 0 },
          { label: t('exp.kpi.upcoming'), value: n(upcoming), sub: t('exp.kpi.upcoming.sub'), warn: upcoming > 0 },
          { label: t('exp.kpi.total'),    value: n(obligations.length), sub: t('exp.kpi.total.sub') },
          { label: t('exp.kpi.annual'),   value: `$${(totalAnnual / 1000).toFixed(0)}k`, sub: t('exp.kpi.annual.sub') },
        ].map(({ label, value, sub, danger, warn }) => (
          <div key={label} style={{
            background: danger ? 'var(--red-50)' : warn ? 'var(--amber-50)' : 'var(--card)',
            border: `1px solid ${danger ? '#FEE2E2' : warn ? '#FDE68A' : 'var(--line)'}`,
            borderRadius: 'var(--radius)', padding: '17px 18px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: danger ? 'var(--red-700)' : warn ? 'var(--amber-700)' : 'var(--muted)' }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', color: danger ? 'var(--red-700)' : warn ? 'var(--amber-700)' : 'var(--ink)' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 9 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {CATEGORIES.map(c => {
          const cnt = obligations.filter(o => o.category === c.key).length
          const active = catFilter.includes(c.key)
          const cat = CAT_MAP[c.key]
          return (
            <button key={c.key} onClick={() => toggleCat(c.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
              border: active ? `1px solid ${cat.color}40` : '1px solid transparent',
              background: active ? cat.bg : 'var(--card)',
              color: active ? cat.color : 'var(--muted)',
              cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            }}>
              {t(`cat.${c.key}` as Parameters<typeof t>[0])} <span style={{ fontVariantNumeric: 'tabular-nums', opacity: .8 }}>{cnt}</span>
            </button>
          )
        })}
        {catFilter.length > 0 && (
          <button onClick={() => setCatFilter([])} style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, border: 0, background: 'var(--canvas-2)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>
            {t('common.clear')}
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="toolbar-row" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 380 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)', pointerEvents: 'none' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('exp.search')}
            style={{ ...inputStyle, padding: '0 12px 0 36px' }} />
        </div>

        <div style={{ display: 'inline-flex', gap: 3, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 99, padding: 3, boxShadow: 'var(--shadow-sm)' }}>
          {STATUS_FILTERS.map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)} style={{
              border: 0, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 99,
              background: statusFilter === s.key ? 'var(--brand)' : 'transparent',
              color: statusFilter === s.key ? '#fff' : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{s.label}</button>
          ))}
        </div>

        <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{resultCount}</span>

        <button onClick={() => setShowCreate(true)} style={{
          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 40, padding: '0 18px', border: 0, background: 'var(--brand)', color: '#fff',
          borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 16px -6px rgba(30,127,204,.55)',
        }}>
          <Plus size={15} /> {t('exp.new')}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div className="table-scroll" style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => toggleSort('name')}>{t('exp.col.obligation')} <SortIcon col="name" /></th>
                <th style={thStyle}>{t('exp.col.category')}</th>
                <th style={thStyle} onClick={() => toggleSort('due_date')}>{t('exp.col.duedate')} <SortIcon col="due_date" /></th>
                <th style={thStyle}>{t('exp.col.status')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('amount')}>{t('exp.col.amount')} <SortIcon col="amount" /></th>
                <th style={thStyle}>{t('exp.col.frequency')}</th>
                <th style={thStyle} onClick={() => toggleSort('responsible')}>{t('exp.col.responsible')} <SortIcon col="responsible" /></th>
                <th style={{ ...thStyle, width: 100, cursor: 'default' }} />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>{t('exp.empty.title')}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{q ? t('exp.empty.search', { q }) : t('exp.empty.filter')}</div>
                  </td>
                </tr>
              ) : sorted.map((ob, i) => {
                const cat = CAT_MAP[ob.category as CatKey]
                const catLabel = t(`cat.${ob.category}` as Parameters<typeof t>[0])
                const isOver = ob.status === 'overdue'
                const isCrit = ob.status === 'critical'
                return (
                  <tr key={ob.id} style={{ borderBottom: '1px solid #EFF2F7', background: isOver ? '#FFF5F5' : isCrit ? '#FFFDF0' : i % 2 === 1 ? '#FBFCFE' : undefined }}>
                    <td style={{ padding: '12px 16px', maxWidth: 260 }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ob.name}</div>
                      {ob.subtitle && <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 1 }}>{ob.subtitle}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      {cat && <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: cat.bg, color: cat.color }}>{catLabel}</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 600, color: isOver ? 'var(--red-700)' : 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                      {fmtOblDate(ob.due_date, MONTHS)}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><StatusBadge days={ob.days} /></td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {ob.amount > 0 ? `$${n(ob.amount)}` : <span style={{ color: 'var(--faint)' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>{ob.frequency}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--ink-2)' }}>{ob.responsible || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => setDetailId(ob.id)} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, background: 'none', border: 0, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{t('common.view')}</button>
                        <button onClick={() => setRenewId(ob.id)} title={t('exp.modal.renew')} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--canvas-2)', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><RefreshCw size={12} /></button>
                        <button onClick={() => setDeleteId(ob.id)} title={t('common.delete')} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--canvas-2)', cursor: 'pointer', display: 'flex', color: 'var(--muted)' }}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail modal ─────────────────────────────────────────────────── */}
      {detailOb && (
        <div style={overlayStyle} onClick={() => setDetailId(null)}>
          <div style={{ ...panelStyle, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{detailOb.name}</h2>
                {detailOb.subtitle && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, margin: 0 }}>{detailOb.subtitle}</p>}
              </div>
              <button onClick={() => setDetailId(null)} style={{ padding: 6, border: 0, background: 'var(--canvas-2)', borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <StatusBadge days={detailOb.days} />
              {CAT_MAP[detailOb.category as CatKey] && (
                <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: CAT_MAP[detailOb.category as CatKey].bg, color: CAT_MAP[detailOb.category as CatKey].color }}>
                  {t(`cat.${detailOb.category}` as Parameters<typeof t>[0])}
                </span>
              )}
              {detailOb.auto_renew && (
                <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: 'var(--green-50)', color: 'var(--green-700)' }}>
                  {t('exp.detail.autorenew')}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
              {[
                { label: t('exp.detail.duedate'),    value: fmtOblDate(detailOb.due_date, MONTHS) },
                { label: t('exp.detail.start'),      value: fmtOblDate(detailOb.start_date, MONTHS) },
                { label: t('exp.detail.amount'),     value: detailOb.amount > 0 ? `$${n(detailOb.amount)}` : '—' },
                { label: t('exp.detail.frequency'),  value: detailOb.frequency },
                { label: t('exp.detail.responsible'),value: detailOb.responsible || '—' },
                { label: t('exp.detail.days'), value: detailOb.days < 0
                    ? t('exp.detail.overdue', { n: Math.abs(detailOb.days) })
                    : detailOb.days === 0 ? t('exp.detail.today')
                    : t('exp.detail.days.left', { n: detailOb.days }) },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px 16px', background: 'var(--canvas-2)' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{value}</div>
                </div>
              ))}
            </div>

            {detailOb.notes && (
              <div style={{ padding: '14px 16px', background: 'var(--canvas-2)', borderRadius: 10, marginBottom: 18, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)', marginBottom: 6 }}>{t('exp.detail.notes')}</div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>{detailOb.notes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setDetailId(null); setEditId(detailOb.id) }} style={{
                flex: 1, height: 40, border: 0, background: 'var(--brand)', color: '#fff',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>{t('common.edit')}</button>
              <button onClick={() => { setDetailId(null); setRenewId(detailOb.id) }} style={{
                height: 40, padding: '0 16px', border: '1px solid var(--line)',
                background: 'var(--canvas-2)', color: 'var(--ink-2)',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}><RefreshCw size={14} /> {t('exp.modal.renew')}</button>
              <button onClick={() => { setDetailId(null); setDeleteId(detailOb.id) }} style={{
                height: 40, padding: '0 14px', border: '1px solid #FEE2E2',
                background: 'var(--red-50)', color: 'var(--red-700)',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create modal ─────────────────────────────────────────────────── */}
      {showCreate && (
        <div style={overlayStyle} onClick={() => setShowCreate(false)}>
          <div style={{ ...panelStyle, maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('exp.modal.create')}</h2>
              <button onClick={() => setShowCreate(false)} style={{ padding: 6, border: 0, background: 'var(--canvas-2)', borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            {actionError && <div style={{ padding: '10px 14px', background: 'var(--red-50)', border: '1px solid #FEE2E2', borderRadius: 8, color: 'var(--red-700)', fontSize: 13, marginBottom: 14 }}>{actionError}</div>}
            <ObligationForm onSave={handleCreate} onCancel={() => setShowCreate(false)} isSaving={isPending} t={t} />
          </div>
        </div>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      {editOb && (
        <div style={overlayStyle} onClick={() => setEditId(null)}>
          <div style={{ ...panelStyle, maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('exp.modal.edit')}</h2>
              <button onClick={() => setEditId(null)} style={{ padding: 6, border: 0, background: 'var(--canvas-2)', borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            {actionError && <div style={{ padding: '10px 14px', background: 'var(--red-50)', border: '1px solid #FEE2E2', borderRadius: 8, color: 'var(--red-700)', fontSize: 13, marginBottom: 14 }}>{actionError}</div>}
            <ObligationForm initial={editOb} onSave={handleEdit} onCancel={() => setEditId(null)} isSaving={isPending} t={t} />
          </div>
        </div>
      )}

      {/* ── Renew modal ──────────────────────────────────────────────────── */}
      {renewOb && (
        <div style={overlayStyle} onClick={() => setRenewId(null)}>
          <div style={{ ...panelStyle, maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('exp.modal.renew')}</h2>
              <button onClick={() => setRenewId(null)} style={{ padding: 6, border: 0, background: 'var(--canvas-2)', borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--canvas-2)', borderRadius: 10, marginBottom: 18, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{renewOb.name}</div>
              <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: 'var(--muted)' }}>
                <span>{t('exp.detail.duedate')}: <b style={{ color: 'var(--ink-2)' }}>{fmtOblDate(renewOb.due_date, MONTHS)}</b></span>
                <span>{t('exp.detail.frequency')}: <b style={{ color: 'var(--ink-2)' }}>{renewOb.frequency}</b></span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
              {t('exp.modal.renew.desc', { freq: renewOb.frequency.toLowerCase() })}
            </p>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{t('exp.renew.notes')}</label>
              <textarea value={renewNotes} onChange={e => setRenewNotes(e.target.value)} rows={2}
                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.5 }}
                placeholder={t('exp.form.notes.ph')} />
            </div>
            {actionError && <div style={{ padding: '10px 14px', background: 'var(--red-50)', borderRadius: 8, color: 'var(--red-700)', fontSize: 13, marginBottom: 14 }}>{actionError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleRenew} disabled={isPending} style={{
                flex: 1, height: 40, border: 0, background: 'var(--green-700)', color: '#fff',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
                cursor: isPending ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: isPending ? .7 : 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}><RefreshCw size={14} /> {isPending ? t('exp.renew.confirming') : t('exp.renew.confirm')}</button>
              <button onClick={() => setRenewId(null)} style={{
                height: 40, padding: '0 16px', border: '1px solid var(--line)',
                background: 'var(--canvas-2)', color: 'var(--ink-2)',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
              }}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ─────────────────────────────────────────── */}
      {deleteOb && (
        <div style={overlayStyle} onClick={() => setDeleteId(null)}>
          <div style={{ ...panelStyle, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{t('exp.modal.delete')}</h2>
              <button onClick={() => setDeleteId(null)} style={{ padding: 6, border: 0, background: 'var(--canvas-2)', borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 8 }}>
              {t('exp.modal.delete.confirm', { name: deleteOb.name })}
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--red-700)', marginBottom: 22, padding: '10px 14px', background: 'var(--red-50)', borderRadius: 8 }}>
              {t('common.undone')}
            </p>
            {actionError && <div style={{ padding: '10px 14px', background: 'var(--red-50)', borderRadius: 8, color: 'var(--red-700)', fontSize: 13, marginBottom: 14 }}>{actionError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleDelete} disabled={isPending} style={{
                flex: 1, height: 40, border: 0, background: 'var(--red-700)', color: '#fff',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
                cursor: isPending ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: isPending ? .7 : 1,
              }}>{isPending ? t('common.deleting') : t('exp.modal.delete.yes')}</button>
              <button onClick={() => setDeleteId(null)} style={{
                height: 40, padding: '0 16px', border: '1px solid var(--line)',
                background: 'var(--canvas-2)', color: 'var(--ink-2)',
                borderRadius: 'var(--radius-sm)', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
              }}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
