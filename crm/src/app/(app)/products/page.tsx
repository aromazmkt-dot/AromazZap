import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Package, AlertTriangle } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  hardwood: 'bg-amber-100 text-amber-700',
  laminate: 'bg-blue-100 text-blue-700',
  vinyl: 'bg-violet-100 text-violet-700',
  tile: 'bg-zinc-100 text-zinc-600',
  carpet: 'bg-emerald-100 text-emerald-700',
  accessories: 'bg-orange-100 text-orange-700',
}
const CATEGORY_LABELS: Record<string, string> = {
  hardwood: 'Hardwood',
  laminate: 'Laminado',
  vinyl: 'Vinyl / LVP',
  tile: 'Baldosa',
  carpet: 'Alfombra',
  accessories: 'Accesorios',
}

const MOCK_PRODUCTS = [
  { id: '1', sku: 'HW-OAK-NAT-5', name: 'Oak Natural 5" Engineered', category: 'hardwood', unitCost: 4.20, unitPrice: 7.80, unit: 'ft²', stock: 2840, lowStockThreshold: 500, active: true },
  { id: '2', sku: 'HW-WAL-SMK-4', name: 'Walnut Smoked 4" Solid', category: 'hardwood', unitCost: 7.10, unitPrice: 13.50, unit: 'ft²', stock: 920, lowStockThreshold: 300, active: true },
  { id: '3', sku: 'LM-GRY-7', name: 'Premium Grey 7mm Laminate', category: 'laminate', unitCost: 1.40, unitPrice: 3.20, unit: 'ft²', stock: 5600, lowStockThreshold: 1000, active: true },
  { id: '4', sku: 'LVP-HER-HEX', name: 'Herringbone LVP 6mm', category: 'vinyl', unitCost: 2.30, unitPrice: 4.90, unit: 'ft²', stock: 3100, lowStockThreshold: 800, active: true },
  { id: '5', sku: 'LVP-WT-COR', name: 'Waterproof Core LVP 8mm', category: 'vinyl', unitCost: 2.80, unitPrice: 5.60, unit: 'ft²', stock: 180, lowStockThreshold: 500, active: true },
  { id: '6', sku: 'TL-MRB-12', name: 'Marble Look Porcelain 12×24', category: 'tile', unitCost: 3.10, unitPrice: 6.20, unit: 'ft²', stock: 740, lowStockThreshold: 200, active: true },
  { id: '7', sku: 'CP-BER-PLU', name: 'Berber Plush Residential', category: 'carpet', unitCost: 1.20, unitPrice: 2.80, unit: 'yd²', stock: 1200, lowStockThreshold: 300, active: true },
  { id: '8', sku: 'ACC-UND-STD', name: 'Standard Underlayment Roll', category: 'accessories', unitCost: 0.18, unitPrice: 0.45, unit: 'ft²', stock: 12000, lowStockThreshold: 2000, active: true },
  { id: '9', sku: 'ACC-MOL-TRS', name: 'T-Molding Transition Strip', category: 'accessories', unitCost: 6.50, unitPrice: 14.00, unit: 'pcs', stock: 85, lowStockThreshold: 50, active: true },
  { id: '10', sku: 'HW-MAP-CLR-5', name: 'Maple Clear 5" Solid', category: 'hardwood', unitCost: 5.80, unitPrice: 10.90, unit: 'ft²', stock: 0, lowStockThreshold: 300, active: false },
]

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-xl p-4 ${highlight ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-red-500' : 'text-zinc-500'}`}>{label}</div>
      <div className={`text-2xl font-bold font-mono ${highlight ? 'text-red-600' : 'text-zinc-900'}`}>{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
    </div>
  )
}

export default function ProductsPage() {
  const lowStock = MOCK_PRODUCTS.filter(p => p.active && p.stock <= p.lowStockThreshold)
  const outOfStock = MOCK_PRODUCTS.filter(p => p.active && p.stock === 0)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Productos" subtitle={`${MOCK_PRODUCTS.filter(p => p.active).length} activos · Catálogo`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="SKUs Activos" value={String(MOCK_PRODUCTS.filter(p => p.active).length)} sub="en catálogo" />
          <StatCard label="Categorías" value={String(Object.keys(CATEGORY_LABELS).length)} sub="tipos de producto" />
          <StatCard label="Stock Bajo" value={String(lowStock.length)} sub="requieren reorden" highlight={lowStock.length > 0} />
          <StatCard label="Agotados" value={String(outOfStock.length)} sub="sin stock" highlight={outOfStock.length > 0} />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500">
            <Search size={14} />
            <span>Buscar por nombre, SKU…</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <a href="/products/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={15} /> Nuevo Producto
          </a>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <span key={cat} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[cat]}`}>
              {label}
              <span className="font-mono">{MOCK_PRODUCTS.filter(p => p.category === cat && p.active).length}</span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Costo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Margen</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((p) => {
                const margin = ((p.unitPrice - p.unitCost) / p.unitPrice * 100).toFixed(0)
                const isLow = p.active && p.stock > 0 && p.stock <= p.lowStockThreshold
                const isOut = p.stock === 0
                return (
                  <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-zinc-500" />
                        </div>
                        <span className={`font-semibold ${p.active ? 'text-zinc-900' : 'text-zinc-400'}`}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[p.category]}`}>
                        {CATEGORY_LABELS[p.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-zinc-600">
                      ${p.unitCost.toFixed(2)}<span className="text-xs text-zinc-400">/{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-zinc-900">
                      ${p.unitPrice.toFixed(2)}<span className="text-xs font-normal text-zinc-400">/{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-semibold font-mono ${Number(margin) >= 40 ? 'text-emerald-600' : Number(margin) >= 25 ? 'text-amber-600' : 'text-red-500'}`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(isLow || isOut) && (
                          <AlertTriangle size={13} className={isOut ? 'text-red-500' : 'text-amber-500'} />
                        )}
                        <span className={`font-mono text-sm ${isOut ? 'text-red-500 font-semibold' : isLow ? 'text-amber-600' : 'text-zinc-700'}`}>
                          {p.stock.toLocaleString()} {p.unit}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.active ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Activo</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500">Inactivo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/products/${p.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver →</a>
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
