import Topbar from '@/components/layout/Topbar'
import { Plus, Search, Filter, Package, AlertTriangle } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

const CATEGORY_COLORS: Record<string, string> = {
  'Carpet':                 'bg-emerald-100 text-emerald-700',
  'Installation Materials': 'bg-zinc-100 text-zinc-600',
  'Remnant':                'bg-amber-100 text-amber-700',
  'Ceramic Tile':           'bg-blue-100 text-blue-700',
  'Vinyl/Resilient':        'bg-violet-100 text-violet-700',
  'Resilient':              'bg-violet-100 text-violet-600',
  'Laminate':               'bg-cyan-100 text-cyan-700',
  'Tile':                   'bg-blue-100 text-blue-600',
  'Vinyl':                  'bg-violet-100 text-violet-600',
  'Grout':                  'bg-stone-100 text-stone-600',
}

function catColor(cat: string | null) {
  return CATEGORY_COLORS[cat ?? ''] ?? 'bg-zinc-100 text-zinc-500'
}

function margin(cost: number | null, price: number | null) {
  if (!cost || !price || price === 0) return null
  return ((price - cost) / price * 100)
}

export default async function ProductsPage() {
  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from('products')
    .select('product_type, source_product_id, product_name, sku, category, vendor, unit_cost, sales_price, quantity, available_quantity, unit_measure, is_stock, discontinued, visible')
    .eq('visible', true)
    .order('category')
    .limit(400)

  const rows = products ?? []
  const active = rows.filter(p => !p.discontinued)
  const outOfStock = rows.filter(p => !p.discontinued && Number(p.available_quantity ?? p.quantity ?? 0) === 0 && p.is_stock)
  const lowStock = rows.filter(p => {
    const qty = Number(p.available_quantity ?? p.quantity ?? 0)
    return !p.discontinued && p.is_stock && qty > 0 && qty < 50
  })

  // Category counts
  const catCounts: Record<string, number> = {}
  for (const p of active) {
    const k = p.category || 'Sin categoría'
    catCounts[k] = (catCounts[k] ?? 0) + 1
  }
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Productos" subtitle={`${active.length} activos · Catálogo real`} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">SKUs Activos</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">{active.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">en catálogo</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Categorías</div>
            <div className="text-2xl font-bold font-mono text-zinc-900">{Object.keys(catCounts).length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">tipos de producto</div>
          </div>
          <div className={`border rounded-xl p-4 ${lowStock.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-zinc-200'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${lowStock.length > 0 ? 'text-amber-600' : 'text-zinc-500'}`}>Stock Bajo</div>
            <div className={`text-2xl font-bold font-mono ${lowStock.length > 0 ? 'text-amber-600' : 'text-zinc-900'}`}>{lowStock.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">requieren reorden</div>
          </div>
          <div className={`border rounded-xl p-4 ${outOfStock.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${outOfStock.length > 0 ? 'text-red-500' : 'text-zinc-500'}`}>Agotados</div>
            <div className={`text-2xl font-bold font-mono ${outOfStock.length > 0 ? 'text-red-600' : 'text-zinc-900'}`}>{outOfStock.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">sin stock</div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {topCats.map(([cat, count]) => (
            <span key={cat} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${catColor(cat)}`}>
              {cat} <span className="font-mono">{count}</span>
            </span>
          ))}
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
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Proveedor</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Costo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Margen</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const qty = Number(p.available_quantity ?? p.quantity ?? 0)
                const mgn = margin(Number(p.unit_cost), Number(p.sales_price))
                const isOut = p.is_stock && qty === 0
                const isLow = p.is_stock && qty > 0 && qty < 50
                const discontinued = p.discontinued
                return (
                  <tr key={`${p.product_type}-${p.source_product_id}`} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-zinc-500" />
                        </div>
                        <span className={`font-semibold ${discontinued ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                          {p.product_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.sku || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${catColor(p.category)}`}>
                        {p.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{p.vendor || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-zinc-600">
                      {p.unit_cost ? `$${Number(p.unit_cost).toFixed(2)}` : '—'}
                      {p.unit_measure && <span className="text-xs text-zinc-400">/{p.unit_measure}</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-zinc-900">
                      {p.sales_price ? `$${Number(p.sales_price).toFixed(2)}` : '—'}
                      {p.unit_measure && <span className="text-xs font-normal text-zinc-400">/{p.unit_measure}</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {mgn !== null ? (
                        <span className={`text-sm font-semibold font-mono ${mgn >= 40 ? 'text-emerald-600' : mgn >= 20 ? 'text-amber-600' : 'text-red-500'}`}>
                          {mgn.toFixed(0)}%
                        </span>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {p.is_stock ? (
                        <div className="flex items-center gap-1.5">
                          {(isLow || isOut) && (
                            <AlertTriangle size={13} className={isOut ? 'text-red-500' : 'text-amber-500'} />
                          )}
                          <span className={`font-mono text-sm ${isOut ? 'text-red-500 font-semibold' : isLow ? 'text-amber-600' : 'text-zinc-700'}`}>
                            {qty.toLocaleString()} {p.unit_measure}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">No aplica</span>
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
