'use client'

import { useState, useTransition } from 'react'
import { updateProduct } from './actions'
import { Check, Pencil } from 'lucide-react'

type Product = {
  product_name: string | null
  sku: string | null
  category: string | null
  vendor: string | null
  unit_cost: number | null
  sales_price: number | null
  unit_measure: string | null
  description: string | null
  style: string | null
  color: string | null
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10.5, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '.6px',
  color: 'var(--muted)', marginBottom: 5,
}
const inputStyle: React.CSSProperties = {
  width: '100%', height: 40, padding: '0 12px',
  border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
  fontSize: 13.5, background: 'var(--canvas-2)', outline: 'none',
  fontFamily: 'inherit', color: 'var(--ink)',
}
const groupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' }

const CATEGORIES = [
  'Carpet', 'Ceramic Tile', 'Grout', 'Installation Materials',
  'Laminate', 'Remnant', 'Resilient', 'Vinyl/Resilient', 'Trim', 'Accessories',
]

export default function ProductEditForm({
  product,
  productType,
  sourceProductId,
}: {
  product: Product
  productType: string
  sourceProductId: number
}) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await updateProduct(productType, sourceProductId, formData)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al guardar')
      }
    })
  }

  return (
    <form action={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ ...groupStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Nombre del Producto</label>
          <input name="product_name" defaultValue={product.product_name ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>SKU</label>
          <input name="sku" defaultValue={product.sku ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Categoría</label>
          <select name="category" defaultValue={product.category ?? ''} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Sin categoría</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Proveedor</label>
          <input name="vendor" defaultValue={product.vendor ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Unidad de medida</label>
          <input name="unit_measure" defaultValue={product.unit_measure ?? ''} style={inputStyle} placeholder="ft², yd², pcs…" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Costo unitario ($)</label>
          <input name="unit_cost" type="number" step="0.01" min="0" defaultValue={product.unit_cost ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Precio de venta ($)</label>
          <input name="sales_price" type="number" step="0.01" min="0" defaultValue={product.sales_price ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Estilo</label>
          <input name="style" defaultValue={product.style ?? ''} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Color</label>
          <input name="color" defaultValue={product.color ?? ''} style={inputStyle} />
        </div>

        <div style={{ ...groupStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Descripción</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ''}
            rows={3}
            style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }}
            placeholder="Descripción del producto…"
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: 'var(--red-50)', border: '1px solid var(--red-50)', borderRadius: 'var(--radius-sm)', color: 'var(--red-700)', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            height: 40, padding: '0 20px',
            background: saved ? 'var(--green-700)' : 'var(--brand)',
            color: '#fff', border: 0,
            borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600,
            cursor: isPending ? 'wait' : 'pointer',
            boxShadow: '0 6px 16px -6px rgba(30,127,204,.5)',
            transition: 'background .2s',
            fontFamily: 'inherit',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {saved ? <><Check size={15} /> Guardado</> : isPending ? 'Guardando…' : <><Pencil size={14} /> Guardar cambios</>}
        </button>
        <a href="/products" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, textDecoration: 'none' }}>Cancelar</a>
      </div>
    </form>
  )
}
