const { readLimit, readOffset, requireAgentAuth, requireGet, selectRows, sendJson } = require('../_lib/agent')

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  const limit = readLimit(req)
  const offset = readOffset(req)
  try {
    const { data, count } = await selectRows('products', {
      select: 'product_type,source_product_id,product_name,style,color,sku,category,vendor,unit_cost,sales_price,quantity,available_quantity,unit_measure,is_stock,discontinued,visible,description',
      order: 'category.asc,product_name.asc',
      limit,
      offset,
    })
    sendJson(res, 200, { ok: true, resource: 'products', count, limit, offset, data })
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : 'products_query_failed' })
  }
}
