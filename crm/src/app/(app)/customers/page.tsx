import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Building2, Phone, Mail, MapPin } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  residential: 'bg-blue-100 text-blue-700',
  commercial: 'bg-violet-100 text-violet-700',
  hoa: 'bg-amber-100 text-amber-700',
}
const TYPE_LABELS: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  hoa: 'HOA',
}

const MOCK_CUSTOMERS = [
  {
    id: '1', name: 'Peterson Family', type: 'residential', email: 'david@petersonhome.com',
    phone: '+1 201-555-0101', city: 'Short Hills, NJ', totalSpent: 28400, jobs: 3,
    lastJob: '20 Abr 2026', rep: 'Mike T.',
  },
  {
    id: '2', name: 'Chen Residence', type: 'residential', email: 'amy.chen@gmail.com',
    phone: '+1 732-555-0188', city: 'Edison, NJ', totalSpent: 15200, jobs: 1,
    lastJob: '10 Mar 2026', rep: 'Sarah K.',
  },
  {
    id: '3', name: 'Riverstone Plaza HOA', type: 'hoa', email: 'board@riverstoneplaza.org',
    phone: '+1 973-555-0200', city: 'Livingston, NJ', totalSpent: 67800, jobs: 5,
    lastJob: '15 May 2026', rep: 'Maria G.',
  },
  {
    id: '4', name: 'Okafor Contracting LLC', type: 'commercial', email: 'robert@okaforcontracting.com',
    phone: '+1 973-555-0143', city: 'Newark, NJ', totalSpent: 42500, jobs: 4,
    lastJob: '02 May 2026', rep: 'John S.',
  },
  {
    id: '5', name: 'García Family', type: 'residential', email: 'familia.garcia@yahoo.com',
    phone: '+1 201-555-0199', city: 'Union City, NJ', totalSpent: 11800, jobs: 2,
    lastJob: '17 May 2026', rep: 'Maria G.',
  },
  {
    id: '6', name: 'Kowalski & Assoc.', type: 'commercial', email: 'linda@kowalskiassoc.com',
    phone: '+1 732-555-0156', city: 'New Brunswick, NJ', totalSpent: 33600, jobs: 3,
    lastJob: '28 Abr 2026', rep: 'Anya P.',
  },
  {
    id: '7', name: 'Williams Residence', type: 'residential', email: 'marcus.w@gmail.com',
    phone: '+1 973-555-0177', city: 'Montclair, NJ', totalSpent: 9200, jobs: 1,
    lastJob: '12 May 2026', rep: 'Greg D.',
  },
]

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
    </div>
  )
}

export default function CustomersPage() {
  const totalRevenue = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Clientes" subtitle={`${MOCK_CUSTOMERS.length} clientes · Base activa`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Clientes" value={String(MOCK_CUSTOMERS.length)} sub="Base activa" />
          <StatCard label="Revenue Total" value={`$${(totalRevenue / 1000).toFixed(0)}k`} sub="Acumulado" />
          <StatCard label="Residencial" value={String(MOCK_CUSTOMERS.filter(c => c.type === 'residential').length)} sub="clientes" />
          <StatCard label="Comercial / HOA" value={String(MOCK_CUSTOMERS.filter(c => c.type !== 'residential').length)} sub="clientes" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar clientes…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/customers/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nuevo Cliente
          </a>
        </div>

        {/* Type pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <span key={type} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[type]}`}>
              {label}
              <span className="font-mono">{MOCK_CUSTOMERS.filter(c => c.type === type).length}</span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Ciudad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rev. Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Trabajos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Último</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rep.</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-zinc-500" />
                      </div>
                      <span className="font-semibold text-zinc-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[c.type]}`}>
                      {TYPE_LABELS[c.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Mail size={11} /> {c.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                        <Phone size={11} /> {c.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <MapPin size={11} className="text-zinc-400" /> {c.city}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-zinc-900">
                    ${c.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-zinc-700">{c.jobs}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{c.lastJob}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{c.rep}</td>
                  <td className="px-4 py-3">
                    <a href={`/customers/${c.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
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
