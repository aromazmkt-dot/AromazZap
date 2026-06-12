const { readLimit, readOffset, requireAgentAuth, requireGet, rpc, selectRows, sendJson } = require('../_lib/agent')

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  const limit = readLimit(req, 100, 1000)
  const offset = readOffset(req)
  try {
    const [{ data, count }, statsRows] = await Promise.all([
      selectRows('invoices', {
        select: 'invoice_id,invoice_number,customer_name,company_name,paid_status,invoice_type_name,salesman,total_sale,total_payment,balance,invoice_date,created_date',
        order: 'invoice_date.desc.nullslast',
        limit,
        offset,
      }),
      rpc('invoice_stats'),
    ])
    const stats = statsRows?.[0] ?? {}
    sendJson(res, 200, {
      ok: true,
      resource: 'invoices',
      count,
      limit,
      offset,
      stats: {
        totalCount: Number(stats.total_count ?? 0),
        totalRevenue: Number(stats.total_revenue ?? 0),
        totalBalance: Number(stats.total_balance ?? 0),
        paidCount: Number(stats.paid_count ?? 0),
        partialCount: Number(stats.partial_count ?? 0),
        partialBalance: Number(stats.partial_balance ?? 0),
      },
      data,
    })
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : 'invoices_query_failed' })
  }
}
