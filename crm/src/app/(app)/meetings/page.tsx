import Topbar from '@/components/layout/Topbar'
import { Plus, CheckCircle2, Clock, AlertCircle, Users, ChevronRight } from 'lucide-react'

const MOCK_MEETINGS = [
  {
    id: '1',
    title: 'Reunión Directorio — Mayo 2026',
    type: 'Directorio',
    date: '20 May 2026',
    participants: ['Marco B.', 'Sarah K.', 'Maria G.'],
    topics: ['Resultados Q1', 'Presupuesto Q2', 'Expansión Ubicación #3'],
    tasks: [
      { id: 't1', text: 'Preparar análisis de costos para nueva ubicación', assignee: 'Anya P.', due: '30 May 2026', status: 'in_progress' },
      { id: 't2', text: 'Reunión con broker inmobiliario en Edison', assignee: 'Marco B.', due: '27 May 2026', status: 'pending' },
      { id: 't3', text: 'Enviar propuesta de expansión a inversionistas', assignee: 'Marco B.', due: '01 Jun 2026', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'Reunión de Ventas — Semana 20',
    type: 'Equipo',
    date: '13 May 2026',
    participants: ['Mike T.', 'Sarah K.', 'John S.', 'Maria G.', 'Greg D.'],
    topics: ['Battle Plan semana 21', 'Follow-up pendientes', 'Nuevos scripts de cierre'],
    tasks: [
      { id: 't4', text: 'Actualizar CRM con todos los leads de mayo', assignee: 'Sarah K.', due: '17 May 2026', status: 'done' },
      { id: 't5', text: 'Role play de objeciones — script nuevo', assignee: 'John S.', due: '20 May 2026', status: 'done' },
      { id: 't6', text: 'Llamar a los 8 leads sin respuesta de semana 19', assignee: 'Mike T.', due: '16 May 2026', status: 'done' },
    ],
  },
  {
    id: '3',
    title: 'Reunión de Instaladores — Q2',
    type: 'Operaciones',
    date: '06 May 2026',
    participants: ['Greg D.', 'Crew A', 'Crew B', 'Crew C'],
    topics: ['Errores frecuentes en LVP', 'Protocolo de aclimatación', 'Seguridad en obra'],
    tasks: [
      { id: 't7', text: 'Revisar checklist pre-instalación con todos los crews', assignee: 'Greg D.', due: '13 May 2026', status: 'done' },
      { id: 't8', text: 'Actualizar video de protocolo de aclimatación', assignee: 'Greg D.', due: '20 May 2026', status: 'in_progress' },
      { id: 't9', text: 'Aplicar nuevo protocolo en 3 instalaciones y reportar', assignee: 'Crew A', due: '27 May 2026', status: 'pending' },
    ],
  },
]

const TASK_STATUS: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  done: { label: 'Completado', icon: CheckCircle2, color: 'text-emerald-500' },
  in_progress: { label: 'En progreso', icon: Clock, color: 'text-blue-500' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-500' },
}

const allTasks = MOCK_MEETINGS.flatMap(m => m.tasks)
const pendingTasks = allTasks.filter(t => t.status !== 'done')

export default function MeetingsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Acuerdos y Actas" subtitle={`${MOCK_MEETINGS.length} reuniones · ${pendingTasks.length} tareas activas`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Reuniones', value: String(MOCK_MEETINGS.length), sub: 'registradas' },
            { label: 'Tareas totales', value: String(allTasks.length), sub: 'generadas' },
            { label: 'Pendientes', value: String(allTasks.filter(t => t.status === 'pending').length), sub: 'sin iniciar' },
            { label: 'En progreso', value: String(allTasks.filter(t => t.status === 'in_progress').length), sub: 'en curso' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
              <div className="text-2xl font-bold font-mono text-zinc-900">{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-zinc-700">Reuniones registradas</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nueva Reunión
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_MEETINGS.map((meeting) => (
            <div key={meeting.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              {/* Meeting header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600">
                      {meeting.type}
                    </span>
                    <span className="text-xs text-zinc-400">{meeting.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">{meeting.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Users size={12} className="text-zinc-400" />
                    <span className="text-xs text-zinc-500">{meeting.participants.join(', ')}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium flex-shrink-0">
                  Ver acta <ChevronRight size={13} />
                </button>
              </div>

              {/* Topics */}
              <div className="px-5 py-3 bg-zinc-50/50 border-b border-zinc-100">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Temas tratados</div>
                <div className="flex flex-wrap gap-2">
                  {meeting.topics.map((t, i) => (
                    <span key={i} className="text-xs bg-white border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="px-5 py-3">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Tareas dictaminadas ({meeting.tasks.length})
                </div>
                <div className="space-y-2">
                  {meeting.tasks.map((task) => {
                    const meta = TASK_STATUS[task.status]
                    const Icon = meta.icon
                    return (
                      <div key={task.id} className="flex items-center gap-3">
                        <Icon size={15} className={`flex-shrink-0 ${meta.color}`} />
                        <span className={`flex-1 text-sm ${task.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>
                          {task.text}
                        </span>
                        <span className="text-xs text-zinc-500 flex-shrink-0">{task.assignee}</span>
                        <span className="text-xs text-zinc-400 flex-shrink-0 font-mono">{task.due}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
