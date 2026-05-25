'use client'

import Topbar from '@/components/layout/Topbar'
import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Peterson Family' },
  { id: '2', name: 'Chen Residence' },
  { id: '3', name: 'Riverstone Plaza HOA' },
  { id: '4', name: 'Okafor Contracting LLC' },
  { id: '5', name: 'García Family' },
  { id: '6', name: 'Kowalski & Assoc.' },
]

const MOCK_PRODUCTS = [
  { id: '1', sku: 'HW-OAK-NAT-5', name: 'Oak Natural 5" Engineered', unit: 'ft²', price: 7.80 },
  { id: '2', sku: 'HW-WAL-SMK-4', name: 'Walnut Smoked 4" Solid', unit: 'ft²', price: 13.50 },
  { id: '3', sku: 'LM-GRY-7', name: 'Premium Grey 7mm Laminate', unit: 'ft²', price: 3.20 },
  { id: '4', sku: 'LVP-HER-HEX', name: 'Herringbone LVP 6mm', unit: 'ft²', price: 4.90 },
  { id: '5', sku: 'LVP-WT-COR', name: 'Waterproof Core LVP 8mm', unit: 'ft²', price: 5.60 },
  { id: '6', sku: 'TL-MRB-12', name: 'Marble Look Porcelain 12×24', unit: 'ft²', price: 6.20 },
  { id: '7', sku: 'CP-BER-PLU', name: 'Berber Plush Residential', unit: 'yd²', price: 2.80 },
  { id: '8', sku: 'ACC-UND-STD', name: 'Standard Underlayment Roll', unit: 'ft²', price: 0.45 },
  { id: '9', sku: 'ACC-MOL-TRS', name: 'T-Molding Transition Strip', unit: 'pcs', price: 14.00 },
  { id: 'labor', sku: 'SVC-INST', name: 'Instalación (mano de obra)', unit: 'ft²', price: 3.50 },
]

interface LineItem {
  id: string
  productId: string
  description: string
  qty: number
  unit: string
  unitPrice: number
  discount: number
}

function newLine(): LineItem {
  return { id: crypto.randomUUID(), productId: '', description: '', qty: 1, unit: 'ft²', unitPrice: 0, discount: 0 }
}

function lineTotal(l: LineItem) {
  return l.qty * l.unitPrice * (1 - l.discount / 100)
}

export default function NewQuotePage() {
  const [customer, setCustomer] = useState('')
  const [validDays, setValidDays] = useState('14')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<LineItem[]>([newLine()])

  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0)
  const tax = subtotal * 0.0 // NJ sales tax depends on category; leaving at 0 for user to configure
  const total = subtotal + tax

  function addLine() {
    setLines(prev => [...prev, newLine()])
  }

  function removeLine(id: string) {
    setLines(prev => prev.filter(l => l.id !== id))
  }

  function updateLine(id: string, patch: Partial<LineItem>) {
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }

  function selectProduct(id: string, productId: string) {
    const p = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!p) return
    updateLine(id, { productId, description: p.name, unit: p.unit, unitPrice: p.price })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Topbar title="Nueva Cotización" subtitle="Completa los campos y agrega líneas de producto" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Header fields */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-700 mb-4">Información General</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Customer */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Cliente *</label>
                <div className="relative">
                  <select
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="">Seleccionar cliente…</option>
                    {MOCK_CUSTOMERS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Valid days */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Validez</label>
                <div className="relative">
                  <select
                    value={validDays}
                    onChange={e => setValidDays(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="7">7 días</option>
                    <option value="14">14 días</option>
                    <option value="21">21 días</option>
                    <option value="30">30 días</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700">Líneas de Cotización</h2>
              <span className="text-xs text-zinc-400">{lines.length} {lines.length === 1 ? 'línea' : 'líneas'}</span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_100px_90px_80px_36px] gap-3 px-4 py-2.5 bg-zinc-50 border-b border-zinc-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Producto / Descripción</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Cantidad</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Unidad</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Precio unit.</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Dcto %</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Total</span>
              <span />
            </div>

            {/* Lines */}
            <div className="divide-y divide-zinc-100">
              {lines.map((line) => (
                <div key={line.id} className="grid grid-cols-[2fr_1fr_1fr_100px_90px_80px_36px] gap-3 px-4 py-3 items-center">
                  {/* Product / description */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <select
                        value={line.productId}
                        onChange={e => selectProduct(line.id, e.target.value)}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-7"
                      >
                        <option value="">Seleccionar producto…</option>
                        {MOCK_PRODUCTS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                    <input
                      type="text"
                      placeholder="Descripción adicional…"
                      value={line.description}
                      onChange={e => updateLine(line.id, { description: e.target.value })}
                      className="w-full bg-transparent border-0 px-0 py-0 text-xs text-zinc-500 placeholder:text-zinc-300 focus:outline-none focus:ring-0"
                    />
                  </div>

                  {/* Qty */}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={line.qty}
                    onChange={e => updateLine(line.id, { qty: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Unit */}
                  <input
                    type="text"
                    value={line.unit}
                    onChange={e => updateLine(line.id, { unit: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Unit price */}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unitPrice}
                    onChange={e => updateLine(line.id, { unitPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Discount */}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={line.discount}
                    onChange={e => updateLine(line.id, { discount: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Line total */}
                  <div className="text-sm font-semibold font-mono text-zinc-900 text-right">
                    ${lineTotal(line).toFixed(2)}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeLine(line.id)}
                    disabled={lines.length === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add line */}
            <div className="px-4 py-3 border-t border-zinc-100">
              <button
                onClick={addLine}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Plus size={15} /> Agregar línea
              </button>
            </div>
          </div>

          {/* Notes + Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Notes */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Notas para el cliente</label>
              <textarea
                rows={4}
                placeholder="Condiciones, términos de pago, observaciones…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Totals */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Resumen</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-mono font-semibold text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Impuesto (0%)</span>
                  <span className="font-mono text-zinc-500">$0.00</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-zinc-200 mt-3">
                  <span className="font-semibold text-zinc-900">Total</span>
                  <span className="font-mono text-xl font-bold text-zinc-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-2">
                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Guardar y Enviar
                </button>
                <button className="w-full px-4 py-2.5 border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
                  Guardar Borrador
                </button>
                <a href="/quotes" className="w-full px-4 py-2.5 text-center text-zinc-500 text-sm hover:text-zinc-700 transition-colors">
                  Cancelar
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
