import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import ProductEditForm from './ProductEditForm'
import { ArrowLeft, Package, AlertTriangle } from 'lucide-react'
import { n } from '@/lib/fmt'

export const revalidate = 60

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Carpet':                 { bg: 'var(--green-50)',  color: 'var(--green-700)' },
  'Installation Materials': { bg: '#EEF1F6',          color: '#5B6776' },
  'Remnant':                { bg: 'var(--amber-50)',  color: 'var(--amber-700)' },
  'Ceramic Tile':           { bg: 'var(--brand-50)',  color: 'var(--brand-700)' },
  'Vinyl/Resilient':        { bg: '#EDE9FE',           color: '#5B21B6' },
  'Resilient':              { bg: '#EDE9FE',           color: '#5B21B6' },
  'Laminate':               { bg: '#ECFEFF',           color: '#0E7490' },
  'Grout':                  { bg: '#F5F3FF',           color: '#6D28D9' },
  'Accessories':            { bg: '#EEF1F6',           color: '#475569' },
}

function catStyle(cat: string | null) {
  return CATEGORY_COLORS[cat ?? ''] ?? { bg: '#EEF1F6', color: '#5B6776' }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}) {
  const { type, id } = await params
  const productType = decodeURIComponent(type)
  const sourceProductId = Number(id)

  if (isNaN(sourceProductId)) notFound()

  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('product_type', productType)
    .eq('source_product_id', sourceProductId)
    .single()

  if (!product) notFound()

  const qty = Number(product.available_quantity ?? product.quantity ?? 0)
  const isOut = !!product.is_stock && qty === 0
  const isLow = !!product.is_stock && qty > 0 && qty < 50
  const s = catStyle(product.category)
  const margin = product.unit_cost && product.sales_price && Number(product.sales_price) > 0
    ? ((Number(product.sales_price) - Number(product.unit_cost)) / Number(product.sales_price) * 100)
    : null

  return (
    <>
      <Topbar
        title={product.product_name || 'Producto'}
        subtitle={product.sku || product.category || 'Detalle de producto'}
      />

      {/* Back */}
      <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', fontWeight: 500, textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Volver a Productos
      </a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>

        {/* Main — edit form */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Package size={22} style={{ color: s.color }} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{product.product_name || '—'}</h2>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{product.product_type} · ID {product.source_product_id}</div>
            </div>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', padding: '3px 11px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: s.bg, color: s.color }}>
              {product.category || 'Sin categoría'}
            </span>
          </div>

          <ProductEditForm product={product} productType={productType} sourceProductId={sourceProductId} />
        </div>

        {/* Sidebar — stock & stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Stock card */}
          <div style={{
            background: isOut ? 'var(--red-50)' : isLow ? 'var(--amber-50)' : 'var(--card)',
            border: `1px solid ${isOut ? 'var(--red-50)' : isLow ? 'var(--amber-50)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: isOut ? 'var(--red-700)' : isLow ? 'var(--amber-700)' : 'var(--muted)', marginBottom: 8 }}>
              Inventario
            </div>
            {product.is_stock ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {(isOut || isLow) && <AlertTriangle size={18} style={{ color: isOut ? 'var(--red-700)' : 'var(--amber-700)', flexShrink: 0 }} />}
                  <span style={{ fontSize: 32, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.02em', color: isOut ? 'var(--red-700)' : isLow ? 'var(--amber-700)' : 'var(--ink)' }}>
                    {n(qty)}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{product.unit_measure}</span>
                </div>
                <div style={{ fontSize: 12, color: isOut ? 'var(--red-700)' : isLow ? 'var(--amber-700)' : 'var(--muted)', marginTop: 6 }}>
                  {isOut ? 'Sin stock — requiere reposición' : isLow ? 'Stock bajo — revisar pronto' : 'Stock OK'}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Producto sin seguimiento de stock</div>
            )}
          </div>

          {/* Pricing card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)', marginBottom: 14 }}>Precios</div>
            {[
              { label: 'Costo', value: product.unit_cost ? `$${Number(product.unit_cost).toFixed(2)}` : '—' },
              { label: 'Precio de venta', value: product.sales_price ? `$${Number(product.sales_price).toFixed(2)}` : '—', bold: true },
              { label: 'Margen', value: margin !== null ? `${margin.toFixed(1)}%` : '—', color: margin !== null ? (margin >= 40 ? 'var(--green-700)' : margin >= 20 ? 'var(--amber-700)' : 'var(--red-700)') : 'var(--faint)' },
            ].map(({ label, value, bold, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontSize: 13.5, fontWeight: bold ? 700 : 600, fontVariantNumeric: 'tabular-nums', color: color ?? 'var(--ink)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Info card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)', marginBottom: 14 }}>Información</div>
            {[
              { label: 'SKU', value: product.sku || '—' },
              { label: 'Proveedor', value: product.vendor || '—' },
              { label: 'Unidad', value: product.unit_measure || '—' },
              { label: 'Estilo', value: product.style || '—' },
              { label: 'Color', value: product.color || '—' },
              { label: 'Tipo', value: product.product_type || '—' },
              { label: 'Discontinuado', value: product.discontinued ? 'Sí' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)', textAlign: 'right', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
