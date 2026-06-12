const { readLimit, readOffset, requireAgentAuth, requireGet, selectRows, sendJson } = require('../_lib/agent')

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  const limit = readLimit(req, 100, 1000)
  const offset = readOffset(req)
  try {
    const { data, count } = await selectRows('leads', {
      select: 'id,full_name,company_name,cell_phone,email,lead_source,lead_status,stage,created_by,lead_date,created_date',
      order: 'created_date.desc',
      limit,
      offset,
    })
    sendJson(res, 200, { ok: true, resource: 'leads', count, limit, offset, data })
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : 'leads_query_failed' })
  }
}
