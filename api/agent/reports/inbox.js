const { requireAgentAuth, requireGet, selectRows, sendJson } = require('../../_lib/agent')

function daysUntil(date) {
  if (!date) return null
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const due = new Date(date).getTime()
  if (Number.isNaN(due)) return null
  return Math.ceil((due - today) / 86400000)
}

function invoicePriority(balance) {
  if (balance >= 50000) return 'critical'
  if (balance >= 15000) return 'high'
  return 'medium'
}

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  try {
    const [invoices, leads, products, expirations] = await Promise.all([
      selectRows('invoices', {
        select: 'invoice_number,customer_name,company_name,total_sale,balance,paid_status,salesman,invoice_date',
        order: 'balance.desc',
        limit: 25,
        filters: { balance: 'gt.0' },
      }),
      selectRows('leads', {
        select: 'full_name,company_name,lead_status,lead_source,created_by,lead_date,created_date',
        order: 'created_date.desc.nullslast',
        limit: 25,
      }),
      selectRows('products', {
        select: 'product_name,style,vendor,available_quantity,unit_measure,discontinued',
        order: 'available_quantity.asc',
        limit: 25,
        filters: { discontinued: 'eq.false', available_quantity: 'lte.5' },
      }),
      selectRows('expirations', {
        select: '*',
        order: 'due_date.asc',
        limit: 25,
      }),
    ])

    const criticalCollections = invoices.data.map((invoice) => {
      const balance = Number(invoice.balance || 0)
      return {
        type: 'collection',
        priority: invoicePriority(balance),
        title: `Cobranza crítica · ${invoice.invoice_number || 'sin folio'}`,
        subject: invoice.company_name || invoice.customer_name || 'Cliente sin nombre',
        owner: invoice.salesman || 'Sin vendedor',
        amount: balance,
        date: invoice.invoice_date,
        approvalRequired: true,
        recommendedAction: 'Preparar seguimiento de cobranza para aprobación del GM.',
      }
    })

    const leadFollowUps = leads.data
      .filter((lead) => String(lead.lead_status || '').toLowerCase() !== 'lost')
      .slice(0, 12)
      .map((lead) => ({
        type: 'lead_followup',
        priority: 'medium',
        title: 'Lead pendiente de seguimiento',
        subject: lead.company_name || lead.full_name || 'Lead sin nombre',
        owner: lead.created_by || 'Sin responsable',
        source: lead.lead_source,
        date: lead.lead_date || lead.created_date,
        approvalRequired: false,
        recommendedAction: 'Confirmar próximo contacto y registrar nota en CRM.',
      }))

    const inventoryAlerts = products.data.map((product) => ({
      type: 'inventory',
      priority: Number(product.available_quantity || 0) <= 0 ? 'high' : 'medium',
      title: 'Inventario bajo stock',
      subject: product.product_name || product.style || 'Producto sin nombre',
      owner: product.vendor || 'Proveedor sin asignar',
      quantity: Number(product.available_quantity || 0),
      unit: product.unit_measure,
      approvalRequired: true,
      recommendedAction: 'Revisar reposición/compra antes de confirmar nuevos trabajos.',
    }))

    const expirationAlerts = expirations.data
      .map((expiration) => ({ expiration, days: daysUntil(expiration.due_date) }))
      .filter(({ days }) => days !== null && days <= 90)
      .map(({ expiration, days }) => ({
        type: 'expiration',
        priority: days <= 30 ? 'high' : 'medium',
        title: 'Vencimiento próximo',
        subject: expiration.name || expiration.title || 'Obligación sin nombre',
        owner: expiration.responsible || 'Sin responsable',
        category: expiration.category,
        dueInDays: days,
        date: expiration.due_date,
        amount: Number(expiration.amount || 0),
        approvalRequired: true,
        recommendedAction: 'Validar renovación/pago y marcar decisión aprobada.',
      }))

    const pendingReports = [
      ...criticalCollections.slice(0, 8),
      ...leadFollowUps.slice(0, 6),
      ...inventoryAlerts.slice(0, 6),
      ...expirationAlerts.slice(0, 6),
    ]

    sendJson(res, 200, {
      ok: true,
      report: 'gm_inbox',
      generatedAt: new Date().toISOString(),
      counts: {
        pendingReports: pendingReports.length,
        criticalCollections: criticalCollections.length,
        leadFollowUps: leadFollowUps.length,
        inventoryAlerts: inventoryAlerts.length,
        expirationAlerts: expirationAlerts.length,
        approvalRequired: pendingReports.filter((item) => item.approvalRequired).length,
      },
      sections: { pendingReports, criticalCollections, leadFollowUps, inventoryAlerts, expirationAlerts },
    })
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : 'inbox_query_failed' })
  }
}
