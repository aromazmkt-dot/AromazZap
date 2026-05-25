import Topbar from '@/components/layout/Topbar'
import { Plus, Filter, Search } from 'lucide-react'

const STAGE_COLORS: Record<string, string> = {
  new: 'bg-zinc-100 text-zinc-600',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-violet-100 text-violet-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-600',
}
const STAGE_LABELS: Record<string, string> = {
  new: 'Nuevo', contacted: 'Contactado', qualified: 'Calificado', won: 'Ganado', lost: 'Perdido',
}
const PRIORITY_COLORS: Record<string, string> = {
  high: 'text-red-600', medium: 'text-amber-600', low: 'text-zinc-400',
}

const MOCK_LEADS = [
  { id: '1', name: 'Peterson Family', phone: '+1 201-555-0101', source: 'Google Ads', stage: 'qualified', priority: 'high', assignedTo: 'Mike T.', created: '20 May 2026' },
  { id: '2', name: 'Chen Residence', phone: '+1 732-555-0188', source: 'Referido', stage: 'contacted', priority: 'high', assignedTo: 'Sarah K.', created: '19 May 2026' },
  { id: '3', name: 'Robert Okafor', phone: '+1 973-555-0143', source: 'Instagram', stage: 'new', priority: 'medium', assignedTo: 'John S.', created: '19 May 2026' },
  { id: '4', name: 'The García Family', phone: '+1 201-555-0199', source: 'Google Ads', stage: 'won', priority: 'medium', assignedTo: 'Maria G.', created: '17 May 2026' },
  { id: '5', name: 'Linda Kowalski', phone: '+1 732-555-0156', source: 'Walk-in', stage: 'contacted', priority: 'low', assignedTo: 'Anya P.', created: '17 May 2026' },
  { id: '6', name: 'Marcus Williams', phone: '+1 973-555-0177', source: 'Facebook Ads', stage: 'new', priority: 'medium', assignedTo: 'Greg D.', created: '16 May 2026' },
]

export default function LeadsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Leads" subtitle={`${MOCK_LEADS.length} activos · Semana 21`} />

      <main className="flex-1 overflow-y-auto p-6">
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

        {/* Stage summary pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(STAGE_LABELS).map(([stage, label]) => (
            <span key={stage} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-transparent ${STAGE_COLORS[stage]}`}>
              {label}
              <span className="font-mono">{MOCK_LEADS.filter(l => l.stage === stage).length}</span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fuente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Etapa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Prioridad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Asignado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Creado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADS.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-900">{lead.name}</td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{lead.phone}</td>
                  <td className="px-4 py-3 text-zinc-600">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STAGE_COLORS[lead.stage]}`}>
                      {STAGE_LABELS[lead.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${PRIORITY_COLORS[lead.priority]}`}>
                      {lead.priority === 'high' ? 'Alta' : lead.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{lead.assignedTo}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{lead.created}</td>
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
