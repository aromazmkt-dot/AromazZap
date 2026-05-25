import Topbar from '@/components/layout/Topbar'
import { Search, Mail, Phone, MapPin } from 'lucide-react'

const DEPARTMENTS = ['Todos', 'Ventas', 'Marketing', 'Operaciones', 'Finanzas', 'Customer Service', 'Gerencia']

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-blue-100 text-blue-700',
  sales: 'bg-violet-100 text-violet-700',
  operations: 'bg-amber-100 text-amber-700',
  finance: 'bg-emerald-100 text-emerald-700',
  cs: 'bg-pink-100 text-pink-700',
  marketing: 'bg-cyan-100 text-cyan-700',
}

const MOCK_TEAM = [
  { id: '1', name: 'Marco Baeza', role: 'admin', title: 'General Manager', dept: 'Gerencia', email: 'marco@aromazhome.com', phone: '+1 201-555-0100', location: 'Short Hills, NJ', since: 'Jan 2020', avatar: 'MB' },
  { id: '2', name: 'Mike Thompson', role: 'sales', title: 'Sales Rep — Senior', dept: 'Ventas', email: 'mike@aromazhome.com', phone: '+1 201-555-0101', location: 'Short Hills, NJ', since: 'Mar 2021', avatar: 'MT' },
  { id: '3', name: 'Sarah Kim', role: 'sales', title: 'Sales Rep', dept: 'Ventas', email: 'sarah@aromazhome.com', phone: '+1 732-555-0102', location: 'Edison, NJ', since: 'Jun 2022', avatar: 'SK' },
  { id: '4', name: 'John Sandoval', role: 'sales', title: 'Sales Rep', dept: 'Ventas', email: 'john@aromazhome.com', phone: '+1 973-555-0103', location: 'Newark, NJ', since: 'Aug 2022', avatar: 'JS' },
  { id: '5', name: 'Maria García', role: 'sales', title: 'Sales Rep — Senior', dept: 'Ventas', email: 'maria@aromazhome.com', phone: '+1 201-555-0104', location: 'Union City, NJ', since: 'Jan 2021', avatar: 'MG' },
  { id: '6', name: 'Anya Petrov', role: 'finance', title: 'Finance & Admin', dept: 'Finanzas', email: 'anya@aromazhome.com', phone: '+1 732-555-0105', location: 'Short Hills, NJ', since: 'Feb 2022', avatar: 'AP' },
  { id: '7', name: 'Greg Diaz', role: 'operations', title: 'Operations Manager', dept: 'Operaciones', email: 'greg@aromazhome.com', phone: '+1 973-555-0106', location: 'Newark, NJ', since: 'May 2020', avatar: 'GD' },
  { id: '8', name: 'Lisa Park', role: 'marketing', title: 'Marketing Coordinator', dept: 'Marketing', email: 'lisa@aromazhome.com', phone: '+1 201-555-0107', location: 'Short Hills, NJ', since: 'Sep 2023', avatar: 'LP' },
  { id: '9', name: 'Carlos Rivera', role: 'cs', title: 'Customer Service Rep', dept: 'Customer Service', email: 'carlos@aromazhome.com', phone: '+1 732-555-0108', location: 'Edison, NJ', since: 'Nov 2022', avatar: 'CR' },
  { id: '10', name: 'Diana Osei', role: 'cs', title: 'Customer Service Rep', dept: 'Customer Service', email: 'diana@aromazhome.com', phone: '+1 973-555-0109', location: 'Montclair, NJ', since: 'Apr 2023', avatar: 'DO' },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin', sales: 'Ventas', operations: 'Operaciones',
  finance: 'Finanzas', cs: 'Customer Service', marketing: 'Marketing',
}

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-amber-500',
  'bg-pink-600', 'bg-cyan-600', 'bg-rose-600', 'bg-indigo-600',
]

export default function DirectoryPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Directorio Interno" subtitle={`${MOCK_TEAM.length} personas · Equipo Aromaz`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar por nombre, cargo, departamento…</span>
          </div>
          <select className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_TEAM.map((person, i) => (
            <div key={person.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md hover:border-zinc-300 transition-all">
              {/* Avatar + name */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {person.avatar}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 text-sm leading-tight">{person.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 leading-snug">{person.title}</div>
                  <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ROLE_COLORS[person.role]}`}>
                    {ROLE_LABELS[person.role]}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Mail size={11} className="flex-shrink-0 text-zinc-400" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Phone size={11} className="flex-shrink-0 text-zinc-400" />
                  <span className="font-mono">{person.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin size={11} className="flex-shrink-0 text-zinc-400" />
                  <span>{person.location}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">Desde {person.since}</span>
                <button className="text-xs text-blue-600 hover:underline font-medium">Ver perfil →</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
