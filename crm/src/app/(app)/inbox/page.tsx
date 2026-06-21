import { createAdminClient } from '@/lib/supabase/admin'
import { money, fmtDate, n } from '@/lib/fmt'
import Topbar from '@/components/layout/Topbar'
import { AlertTriangle, CheckCircle2, Clock, DollarSign, Package, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'

export const revalidate = 60

type InboxItem = {
  type: 'collection' | 'lead_followup' | 'inventory' | 'expiration'
  priority: 'critical' | 'high' | 'medium'
  title: string
  subject: string
  owner: string
  amount?: number
  quantity?: number
  unit?: string | null
  source?: string | null
  category?: string | null
  dueInDays?: number | null
  date?: string | null
  approvalRequired: boolean
  recommendedAction: string
}

type InvoiceRow = {
  invoice_number: string | null
  customer_name: string | null
  company_name: string | null
  balance: number | null
  salesman: string | null
  invoice_date: string | null
}

type LeadRow = {
  full_name: string | null
  company_name: string | null
  lead_status: string | null
  lead_source: string | null
  created_by: string | null
  lead_date: string | null
  created_date: string | null
}

type ProductRow = {
  product_name: string | null
  style: string | null
  vendor: string | null
  available_quantity: number | null
  unit_measure: string | null
  discontinued: boolean | null
}

type ExpirationRow = {
  name?: string | null
  title?: string | null
  category?: string | null
  responsible?: string | null
  due_date?: string | null
  amount?: number | null
}

const colors = {
  critical: '#DC2626',
  high: '#F59E0B',
  medium: '#1E7FCC',
}

function priorityLabel(priority: InboxItem['priority']) {
  if (priority === 'critical') return 'Crítico'
  if (priority === 'high') return 'Alto'
  return 'Medio'
}

function todayOnly() {
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
}

function daysUntil(date: string | null | undefined) {
  if (!date) return null
  const due = new Date(date)
  if (Number.isNaN(due.getTime())) return null
  return Math.ceil((due.getTime() - todayOnly().getTime()) / 86_400_000)
}

function invoicePriority(balance: number): InboxItem['priority'] {
  if (balance >= 50_000) return 'critical'
  if (balance >= 15_000) return 'high'
  return 'medium'
}

function Card({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18, boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 3, background: color }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, display: 'grid', placeItems: 'center', background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={16} color={color} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</div>
      </div>
      <div style={{ marginTop: 14, fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.04em' }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
    </div>
  )
}

function InboxRow({ item }: { item: InboxItem }) {
  const color = colors[item.priority]
  const meta = item.amount ? money(item.amount) : item.quantity !== undefined ? `${n(item.quantity)} ${item.unit ?? ''}` : item.dueInDays !== undefined && item.dueInDays !== null ? `${item.dueInDays} días` : item.source || item.category || '—'
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color, background: `${color}14`, border: `1px solid ${color}24`, borderRadius: 999, padding: '4px 8px' }}>{priorityLabel(item.priority)}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: item.approvalRequired ? '#7C2D12' : '#166534', background: item.approvalRequired ? '#FFEDD5' : '#DCFCE7', borderRadius: 999, padding: '4px 8px' }}>
            {item.approvalRequired ? 'Requiere aprobación GM' : 'Seguimiento directo'}
          </span>
        </div>
        <h3 style={{ margin: '10px 0 2px', fontSize: 14, color: 'var(--ink)' }}>{item.title}</h3>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 700 }}>{item.subject}</div>
        <div style={{ marginTop: 5, fontSize: 12, color: 'var(--muted)' }}>Responsable: {item.owner} · {item.date ? fmtDate(item.date) : 'sin fecha'}</div>
        <div style={{ marginTop: 9, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>{item.recommendedAction}</div>
      </div>
      <div style={{ minWidth: 90, textAlign: 'right', fontSize: 15, fontWeight: 900, color }}>{meta}</div>
    </div>
  )
}

export default async function InboxPage() {
  const supabase = createAdminClient()
  const [
    { data: invoiceRows },
    { data: leadRows },
    { data: productRows },
    { data: expirationRows },
  ] = await Promise.all([
    supabase.from('invoices').select('invoice_number,customer_name,company_name,balance,salesman,invoice_date').gt('balance', 0).order('balance', { ascending: false }).limit(20),
    supabase.from('leads').select('full_name,company_name,lead_status,lead_source,created_by,lead_date,created_date').order('created_date', { ascending: false, nullsFirst: false }).limit(20),
    supabase.from('products').select('product_name,style,vendor,available_quantity,unit_measure,discontinued').eq('discontinued', false).lte('available_quantity', 5).order('available_quantity', { ascending: true }).limit(20),
    supabase.from('expirations').select('*').order('due_date', { ascending: true }).limit(20),
  ])

  const criticalCollections: InboxItem[] = ((invoiceRows ?? []) as InvoiceRow[]).map(invoice => {
    const balance = Number(invoice.balance ?? 0)
    return {
      type: 'collection',
      priority: invoicePriority(balance),
      title: `Cobranza crítica · ${invoice.invoice_number ?? 'sin folio'}`,
      subject: invoice.company_name || invoice.customer_name || 'Cliente sin nombre',
      owner: invoice.salesman || 'Sin vendedor',
      amount: balance,
      date: invoice.invoice_date,
      approvalRequired: true,
      recommendedAction: 'Preparar seguimiento de cobranza. Require approval / requiere aprobación antes de enviar mensaje o modificar registros.',
    }
  })

  const leadFollowUps: InboxItem[] = ((leadRows ?? []) as LeadRow[]).filter(lead => String(lead.lead_status ?? '').toLowerCase() !== 'lost').slice(0, 8).map(lead => ({
    type: 'lead_followup',
    priority: 'medium',
    title: 'Lead pendiente de seguimiento',
    subject: lead.company_name || lead.full_name || 'Lead sin nombre',
    owner: lead.created_by || 'Sin responsable',
    source: lead.lead_source,
    date: lead.lead_date || lead.created_date,
    approvalRequired: false,
    recommendedAction: 'Confirmar próximo contacto y registrar nota de seguimiento.',
  }))

  const inventoryAlerts: InboxItem[] = ((productRows ?? []) as ProductRow[]).map(product => ({
    type: 'inventory',
    priority: Number(product.available_quantity ?? 0) <= 0 ? 'high' : 'medium',
    title: 'Inventario bajo stock',
    subject: product.product_name || product.style || 'Producto sin nombre',
    owner: product.vendor || 'Proveedor sin asignar',
    quantity: Number(product.available_quantity ?? 0),
    unit: product.unit_measure,
    approvalRequired: true,
    recommendedAction: 'Validar reposición con operaciones/compras antes de comprometer trabajos nuevos.',
  }))

  const expirationAlerts: InboxItem[] = ((expirationRows ?? []) as ExpirationRow[]).map(expiration => ({ expiration, days: daysUntil(expiration.due_date) })).filter(({ days }) => days !== null && days <= 90).map(({ expiration, days }) => ({
    type: 'expiration',
    priority: days !== null && days <= 30 ? 'high' : 'medium',
    title: 'Vencimiento próximo',
    subject: expiration.name || expiration.title || 'Obligación sin nombre',
    owner: expiration.responsible || 'Sin responsable',
    category: expiration.category,
    dueInDays: days,
    date: expiration.due_date,
    amount: Number(expiration.amount ?? 0),
    approvalRequired: true,
    recommendedAction: 'Validar renovación/pago y dejar decisión aprobada por GM.',
  }))

  const pendingReports = [...criticalCollections.slice(0, 6), ...leadFollowUps.slice(0, 5), ...inventoryAlerts.slice(0, 5), ...expirationAlerts.slice(0, 5)]
  const approvalCount = pendingReports.filter(item => item.approvalRequired).length

  return (
    <>
      <Topbar title="Inbox GM" subtitle="Reportes IA pendientes · alertas y aprobaciones para Marco" />

      <div style={{ background: 'linear-gradient(135deg,#0C3556,#1E7FCC)', color: '#fff', borderRadius: 22, padding: 22, boxShadow: 'var(--shadow-lg)', marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr auto', gap: 18 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.10)', borderRadius: 999, padding: '5px 10px', fontSize: 11, fontWeight: 800, marginBottom: 12 }}><Sparkles size={13} /> Centro de control</div>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-.03em' }}>Reportes IA pendientes para revisión</h2>
          <p style={{ margin: '7px 0 0', maxWidth: 760, color: 'rgba(255,255,255,.82)', fontSize: 13.5 }}>Priorizo cobranza crítica, leads sin seguimiento, inventario bajo y vencimientos. Las acciones reales se preparan como recomendación y quedan bloqueadas hasta aprobación explícita.</p>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', width: 70, height: 70, borderRadius: 20, background: 'rgba(255,255,255,.14)' }}><ShieldCheck size={34} /></div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <Card label="Reportes IA pendientes" value={n(pendingReports.length)} sub="mezcla priorizada" icon={Sparkles} color="#1E7FCC" />
        <Card label="Cobranza crítica" value={n(criticalCollections.length)} sub="saldos abiertos" icon={DollarSign} color="#DC2626" />
        <Card label="Aprobación requerida" value={n(approvalCount)} sub="bloqueados hasta OK GM" icon={ShieldCheck} color="#F59E0B" />
        <Card label="Bajo stock" value={n(inventoryAlerts.length)} sub="stock 0–5" icon={Package} color="#7C3AED" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(280px,.8fr)', gap: 16 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <h2 style={{ margin: 0, fontSize: 16, color: 'var(--ink)' }}>Reportes IA pendientes</h2>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>{n(pendingReports.length)} items</span>
          </div>
          {pendingReports.map((item, index) => <InboxRow key={`${item.type}-${item.subject}-${index}`} item={item} />)}
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>Regla de seguridad</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>El Inbox GM solo recomienda. Enviar mensajes, cambiar estados, crear tareas externas o modificar datos require approval / requieren aprobación explícita de Marco o Esteban.</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>Colas conectadas</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              <div><AlertTriangle size={14} color="#DC2626" /> <b>Cobranza:</b> {n(criticalCollections.length)}</div>
              <div><UserRoundCheck size={14} color="#1E7FCC" /> <b>Leads:</b> {n(leadFollowUps.length)}</div>
              <div><Package size={14} color="#7C3AED" /> <b>Inventario:</b> {n(inventoryAlerts.length)}</div>
              <div><Clock size={14} color="#F59E0B" /> <b>Vencimientos:</b> {n(expirationAlerts.length)}</div>
            </div>
          </div>
          <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#166534', fontWeight: 800 }}><CheckCircle2 size={16} /> Próximo paso</div>
            <p style={{ color: '#166534', fontSize: 13, lineHeight: 1.5 }}>Agregar botones de “preparar acción” para que Agente Aromaz genere borradores con dry-run antes de pedir aprobación.</p>
          </div>
        </aside>
      </div>
    </>
  )
}
