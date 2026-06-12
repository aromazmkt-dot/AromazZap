const { countRows, requireAgentAuth, requireGet, rpc, selectRows, sendJson } = require('../../_lib/agent')

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  try {
    const [
      statsRows,
      monthlyRevenue,
      leadsBySource,
      leadsTotal,
      customersTotal,
      productsTotal,
      expirationsTotal,
      recentInvoices,
    ] = await Promise.all([
      rpc('invoice_stats'),
      rpc('monthly_revenue', { months_back: 12 }),
      rpc('leads_by_source'),
      countRows('leads'),
      countRows('customers'),
      countRows('products'),
      countRows('expirations'),
      selectRows('invoices', {
        select: 'invoice_number,customer_name,total_sale,balance,paid_status,salesman,invoice_date',
        order: 'invoice_date.desc.nullslast',
        limit: 10,
        count: false,
      }),
    ])

    const stats = statsRows?.[0] ?? {}
    sendJson(res, 200, {
      ok: true,
      report: 'dashboard',
      generatedAt: new Date().toISOString(),
      kpis: {
        invoices: {
          totalCount: Number(stats.total_count ?? 0),
          totalRevenue: Number(stats.total_revenue ?? 0),
          totalBalance: Number(stats.total_balance ?? 0),
          paidCount: Number(stats.paid_count ?? 0),
          partialCount: Number(stats.partial_count ?? 0),
          partialBalance: Number(stats.partial_balance ?? 0),
        },
        leads: { totalCount: leadsTotal },
        customers: { totalCount: customersTotal },
        products: { totalCount: productsTotal },
        expirations: { totalCount: expirationsTotal },
      },
      charts: { monthlyRevenue, leadsBySource },
      recentInvoices: recentInvoices.data,
    })
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : 'dashboard_query_failed' })
  }
}
