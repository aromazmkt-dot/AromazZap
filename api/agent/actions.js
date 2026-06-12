const {
  readJson,
  requireActionApproval,
  requireAgentAuth,
  requirePost,
  selectRows,
  sendJson,
  updateRows,
} = require('../_lib/agent')

const ACTIONS = {
  'lead.updateStatus': {
    table: 'leads',
    filters: body => ({ id: `eq.${required(body, 'id')}` }),
    values: body => pick(body, ['lead_status', 'stage']),
  },
  'lead.assignOwner': {
    table: 'leads',
    filters: body => ({ id: `eq.${required(body, 'id')}` }),
    values: body => pick(body, ['created_by']),
  },
  'product.updatePricing': {
    table: 'products',
    filters: productFilters,
    values: body => pick(body, ['unit_cost', 'sales_price']),
  },
  'product.updateVisibility': {
    table: 'products',
    filters: productFilters,
    values: body => pick(body, ['visible', 'discontinued']),
  },
  'expiration.updateStatus': {
    table: 'expirations',
    filters: body => ({ id: `eq.${required(body, 'id')}` }),
    values: body => pick(body, ['status', 'notes', 'responsible', 'due_date']),
  },
  'customer.updateStatus': {
    table: 'customers',
    filters: body => ({ customer_id: `eq.${required(body, 'customer_id')}` }),
    values: body => pick(body, ['status', 'is_active']),
  },
}

function required(body, key) {
  if (body[key] === undefined || body[key] === null || body[key] === '') throw new Error(`missing_${key}`)
  return body[key]
}

function productFilters(body) {
  return {
    product_type: `eq.${required(body, 'product_type')}`,
    source_product_id: `eq.${required(body, 'source_product_id')}`,
  }
}

function pick(body, keys) {
  const out = {}
  for (const key of keys) if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key]
  if (Object.keys(out).length === 0) throw new Error('no_allowed_fields')
  return out
}

module.exports = async function handler(req, res) {
  if (!requirePost(req, res) || !requireAgentAuth(req, res)) return

  try {
    const body = await readJson(req)
    const action = required(body, 'action')
    const config = ACTIONS[action]
    if (!config) {
      sendJson(res, 400, { ok: false, error: 'unsupported_action', supportedActions: Object.keys(ACTIONS) })
      return
    }

    const dryRun = body.dryRun !== false
    if (!requireActionApproval(req, res, dryRun)) return

    const filters = config.filters(body)
    const values = config.values(body)
    const before = await selectRows(config.table, { select: '*', filters, limit: 10, count: false })

    if (dryRun) {
      sendJson(res, 200, {
        ok: true,
        dryRun: true,
        action,
        table: config.table,
        filters,
        values,
        matchedRows: before.data.length,
        before: before.data,
      })
      return
    }

    const updated = await updateRows(config.table, filters, values)
    sendJson(res, 200, {
      ok: true,
      dryRun: false,
      action,
      table: config.table,
      filters,
      values,
      updatedRows: updated.length,
      before: before.data,
      after: updated,
      changedAt: new Date().toISOString(),
    })
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : 'action_failed' })
  }
}
