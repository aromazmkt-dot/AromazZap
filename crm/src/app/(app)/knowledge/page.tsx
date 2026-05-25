import Topbar from '@/components/layout/Topbar'
import { Search, Plus, BookOpen, FileText, ScrollText, Mic2, Briefcase, AlertCircle, ChevronRight } from 'lucide-react'

const DOC_TYPES = [
  { key: 'sop', label: 'SOPs', icon: ScrollText, color: 'bg-blue-100 text-blue-700', desc: 'Procesos estándar' },
  { key: 'manual', label: 'Manuales', icon: BookOpen, color: 'bg-violet-100 text-violet-700', desc: 'Guías completas' },
  { key: 'script', label: 'Scripts', icon: Mic2, color: 'bg-emerald-100 text-emerald-700', desc: 'Guiones de venta' },
  { key: 'policy', label: 'Políticas', icon: Briefcase, color: 'bg-amber-100 text-amber-700', desc: 'Reglamentos internos' },
  { key: 'memo', label: 'Memos', icon: FileText, color: 'bg-zinc-100 text-zinc-600', desc: 'Comunicaciones formales' },
  { key: 'order', label: 'Órdenes', icon: AlertCircle, color: 'bg-orange-100 text-orange-700', desc: 'Permanentes y transitorias' },
]

const DEPARTMENTS = ['Ventas', 'Marketing', 'Finanzas', 'Operaciones', 'Customer Service', 'RRHH', 'General']

const MOCK_DOCS = [
  { id: '1', type: 'sop', title: 'Proceso de Medición en Campo', dept: 'Ventas', version: '2.1', updatedBy: 'Marco B.', updatedAt: '15 May 2026', reads: 12, status: 'active' },
  { id: '2', type: 'manual', title: 'Manual de Ventas — Contacto y Handle', dept: 'Ventas', version: '3.0', updatedBy: 'Marco B.', updatedAt: '10 May 2026', reads: 8, status: 'active' },
  { id: '3', type: 'script', title: 'Script de Follow-Up (7 días)', dept: 'Ventas', version: '1.4', updatedBy: 'Sarah K.', updatedAt: '08 May 2026', reads: 15, status: 'active' },
  { id: '4', type: 'script', title: 'Manejo de Objeciones — Precio', dept: 'Ventas', version: '2.0', updatedBy: 'Marco B.', updatedAt: '05 May 2026', reads: 11, status: 'active' },
  { id: '5', type: 'sop', title: 'Protocolo Pre-Instalación', dept: 'Operaciones', version: '1.8', updatedBy: 'Greg D.', updatedAt: '01 May 2026', reads: 6, status: 'active' },
  { id: '6', type: 'policy', title: 'Política de Garantías — Aromaz', dept: 'Customer Service', version: '1.2', updatedBy: 'Marco B.', updatedAt: '28 Abr 2026', reads: 9, status: 'active' },
  { id: '7', type: 'memo', title: 'Memo: Nueva estructura de comisiones Q2 2026', dept: 'General', version: '1.0', updatedBy: 'Marco B.', updatedAt: '20 Abr 2026', reads: 18, status: 'active' },
  { id: '8', type: 'sop', title: 'Cierre de Caja y Cuadre Diario', dept: 'Finanzas', version: '1.1', updatedBy: 'Anya P.', updatedAt: '15 Abr 2026', reads: 5, status: 'active' },
  { id: '9', type: 'order', title: 'Orden Permanente: Uso de uniformes en campo', dept: 'General', version: '1.0', updatedBy: 'Marco B.', updatedAt: '01 Mar 2026', reads: 22, status: 'active' },
  { id: '10', type: 'manual', title: 'Manual de Instalación — LVP / Vinyl', dept: 'Operaciones', version: '2.3', updatedBy: 'Greg D.', updatedAt: '15 Feb 2026', reads: 14, status: 'active' },
]

const TYPE_META: Record<string, { label: string; color: string }> = {
  sop: { label: 'SOP', color: 'bg-blue-100 text-blue-700' },
  manual: { label: 'Manual', color: 'bg-violet-100 text-violet-700' },
  script: { label: 'Script', color: 'bg-emerald-100 text-emerald-700' },
  policy: { label: 'Política', color: 'bg-amber-100 text-amber-700' },
  memo: { label: 'Memo', color: 'bg-zinc-100 text-zinc-600' },
  order: { label: 'Orden', color: 'bg-orange-100 text-orange-700' },
}

export default function KnowledgePage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Base de Conocimiento" subtitle={`${MOCK_DOCS.length} documentos · Repositorio institucional`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Type cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {DOC_TYPES.map(({ key, label, icon: Icon, color, desc }) => (
            <button key={key} className="bg-white border border-zinc-200 rounded-xl p-4 text-left hover:shadow-md hover:border-zinc-300 transition-all group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{MOCK_DOCS.filter(d => d.type === key).length} docs · {desc}</div>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar documentos, SOPs, scripts…</span>
          </div>
          <select className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los dptos.</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nuevo Documento
          </button>
        </div>

        {/* Document list */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Documento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Departamento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Versión</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Actualizado por</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Fecha</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Lecturas</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_DOCS.map((doc) => (
                <tr key={doc.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-zinc-900">{doc.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_META[doc.type].color}`}>
                      {TYPE_META[doc.type].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{doc.dept}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">v{doc.version}</td>
                  <td className="px-4 py-3 text-zinc-600">{doc.updatedBy}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{doc.updatedAt}</td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-zinc-600">{doc.reads}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                      Ver <ChevronRight size={13} />
                    </button>
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
