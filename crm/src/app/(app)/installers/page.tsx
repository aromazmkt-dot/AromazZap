import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Star, AlertTriangle, CheckCircle, HardHat } from 'lucide-react'

const CONDITION_META: Record<string, { label: string; color: string; bg: string }> = {
  power: { label: 'PODER', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  affluence: { label: 'AFLUENCIA', color: 'text-blue-700', bg: 'bg-blue-100' },
  normal: { label: 'NORMAL', color: 'text-zinc-600', bg: 'bg-zinc-100' },
  emergency: { label: 'EMERGENCIA', color: 'text-amber-700', bg: 'bg-amber-100' },
  danger: { label: 'PELIGRO', color: 'text-red-700', bg: 'bg-red-100' },
}

const MOCK_INSTALLERS = [
  {
    id: '1', name: 'Roberto Castillo', type: 'in_house', crew: 'Crew A',
    skills: ['Hardwood', 'LVP', 'Laminate'],
    phone: '+1 973-555-0201', zone: 'North NJ', since: 'Mar 2020',
    jobsCompleted: 84, errorsThisMonth: 0, claims: 0, condition: 'power',
    docs: { license: '01 Jan 2027', insurance: '15 Mar 2027' },
    rating: 4.9,
  },
  {
    id: '2', name: 'Miguel Ángel Reyes', type: 'in_house', crew: 'Crew A',
    skills: ['Hardwood', 'LVP'],
    phone: '+1 201-555-0202', zone: 'North NJ', since: 'Jun 2021',
    jobsCompleted: 61, errorsThisMonth: 1, claims: 0, condition: 'normal',
    docs: { license: '15 Aug 2026', insurance: '01 Apr 2027' },
    rating: 4.6,
  },
  {
    id: '3', name: 'Luis Fernando Mora', type: 'in_house', crew: 'Crew B',
    skills: ['Tile', 'LVP', 'Carpet'],
    phone: '+1 732-555-0203', zone: 'Central NJ', since: 'Jan 2022',
    jobsCompleted: 48, errorsThisMonth: 2, claims: 1, condition: 'emergency',
    docs: { license: '30 Jun 2026', insurance: '30 Jun 2026' },
    rating: 3.8,
  },
  {
    id: '4', name: 'Andres Vargas', type: 'in_house', crew: 'Crew B',
    skills: ['Tile', 'Hardwood'],
    phone: '+1 973-555-0204', zone: 'Central NJ', since: 'Sep 2022',
    jobsCompleted: 35, errorsThisMonth: 1, claims: 0, condition: 'normal',
    docs: { license: '01 Mar 2027', insurance: '01 Mar 2027' },
    rating: 4.3,
  },
  {
    id: '5', name: 'Precision Floors LLC', type: 'sub', crew: 'Subcontratista',
    skills: ['Hardwood', 'LVP', 'Laminate', 'Tile', 'Carpet'],
    phone: '+1 201-555-0210', zone: 'All NJ', since: 'Jan 2021',
    jobsCompleted: 127, errorsThisMonth: 0, claims: 0, condition: 'affluence',
    docs: { license: '01 Nov 2026', insurance: '01 Nov 2026' },
    rating: 4.8,
  },
  {
    id: '6', name: 'J&R Flooring Sub', type: 'sub', crew: 'Subcontratista',
    skills: ['Carpet', 'LVP'],
    phone: '+1 732-555-0211', zone: 'South NJ', since: 'May 2023',
    jobsCompleted: 22, errorsThisMonth: 3, claims: 2, condition: 'danger',
    docs: { license: '10 May 2026', insurance: '10 May 2026' },
    rating: 3.1,
  },
]

function isExpiringSoon(dateStr: string) {
  const parts = dateStr.split(' ')
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  const d = new Date(Number(parts[2]), months[parts[1]], Number(parts[0].replace('.', '')))
  const now = new Date(2026, 4, 25)
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= 90
}

export default function InstallersPage() {
  const inHouse = MOCK_INSTALLERS.filter(i => i.type === 'in_house')
  const subs = MOCK_INSTALLERS.filter(i => i.type === 'sub')
  const withIssues = MOCK_INSTALLERS.filter(i => i.condition === 'danger' || i.condition === 'emergency')

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Instaladores" subtitle={`${MOCK_INSTALLERS.length} instaladores · ${inHouse.length} in-house · ${subs.length} subcontratistas`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'In-House', value: String(inHouse.length), sub: 'empleados directos' },
            { label: 'Subcontratistas', value: String(subs.length), sub: 'externos activos' },
            { label: 'Trabajos este mes', value: String(MOCK_INSTALLERS.reduce((s, i) => s + i.errorsThisMonth, 0) + 47), sub: 'completados' },
            { label: 'Requieren atención', value: String(withIssues.length), sub: 'condición crítica', highlight: withIssues.length > 0 },
          ].map(({ label, value, sub, highlight }) => (
            <div key={label} className={`border rounded-xl p-4 ${highlight ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
              <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-red-500' : 'text-zinc-500'}`}>{label}</div>
              <div className={`text-2xl font-bold font-mono ${highlight ? 'text-red-600' : 'text-zinc-900'}`}>{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar instaladores…</span>
          </div>
          <select className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los tipos</option>
            <option value="in_house">In-House</option>
            <option value="sub">Subcontratista</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Agregar Instalador
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Instalador</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Skills</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rating</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Trabajos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Errores</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Condición</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Docs</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_INSTALLERS.map((ins) => {
                const cond = CONDITION_META[ins.condition]
                const licExpiring = isExpiringSoon(ins.docs.license)
                const insExpiring = isExpiringSoon(ins.docs.insurance)
                const docsOk = !licExpiring && !insExpiring
                return (
                  <tr key={ins.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <HardHat size={14} className="text-zinc-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{ins.name}</div>
                          <div className="text-xs text-zinc-400">{ins.zone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${ins.type === 'in_house' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                        {ins.type === 'in_house' ? ins.crew : 'Sub'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ins.skills.map(s => (
                          <span key={s} className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-medium">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-mono text-sm font-semibold text-zinc-900">{ins.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm text-zinc-700">{ins.jobsCompleted}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono text-sm font-semibold ${ins.errorsThisMonth === 0 ? 'text-zinc-400' : ins.errorsThisMonth >= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                        {ins.errorsThisMonth}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${cond.bg} ${cond.color}`}>
                        {cond.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {docsOk ? (
                        <CheckCircle size={15} className="text-emerald-500" />
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle size={13} />
                          <span>Vence pronto</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline font-medium">Ver →</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
