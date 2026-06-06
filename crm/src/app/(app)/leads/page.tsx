import Topbar from '@/components/layout/Topbar'
import { Plus, Filter, Search } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

const SOURCE_COLORS: Record<string, string> = {
  'Google Search': 'bg-blue-100 text-blue-700',
  'Flags & Banners': 'bg-orange-100 text-orange-700',
  'Repeat': 'bg-emerald-100 text-emerald-700',
  'Walk-in': 'bg-violet-100 text-violet-700',
  'Website': 'bg-cyan-100 text-cyan-700',
  'ZapAssist AI': 'bg-pink-100 text-pink-700',
  'Referral': 'bg-amber-100 text-amber-700',
}

function sourceColor(src: string) {
  return SOURCE_COLORS[src] ?? 'bg-zinc-100 text-zinc-600'
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function LeadsPage() {
  const supabase = createAdminClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('id, full_name, company_name, cell_phone, email, lead_source, lead_status, created_by, lead_date, created_date')
    .order('created_date', { ascending: false })
    .limit(200)

  const rows = leads ?? []

  // Aggregate by source
  const sourceCounts: Record<string, number> = {}
  for (const l of rows) {
    const src = l.lead_source || 'Sin fuente'
    sourceCounts[src] = (sourceCounts[src] ?? 0) + 1
  }
  const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Leads" subtitle={`${rows.length} registros · Datos reales`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Source pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {topSources.map(([src, count]) => (
            <span key={src} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sourceColor(src)}`}>
              {src} <span className="font-mono">{count}</span>
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar leads…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/leads/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nuevo Lead
          </a>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fuente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Creado por</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fecha</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900">{lead.full_name || lead.company_name || '—'}</div>
                    {lead.email && <div className="text-xs text-zinc-400 mt-0.5">{lead.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{lead.cell_phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${sourceColor(lead.lead_source || '')}`}>
                      {lead.lead_source || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                      {lead.lead_status || 'Qualified'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 text-xs">{lead.created_by || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{formatDate(lead.lead_date || lead.created_date)}</td>
                  <td className="px-4 py-3">
                    <a href={`/leads/${lead.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
