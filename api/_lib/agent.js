function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

function requireAgentAuth(req, res) {
  const expected = process.env.AROMAZ_AGENT_API_KEY
  if (!expected) {
    sendJson(res, 503, { ok: false, error: 'agent_api_key_not_configured' })
    return false
  }
  if (req.headers.authorization !== `Bearer ${expected}`) {
    sendJson(res, 401, { ok: false, error: 'unauthorized' })
    return false
  }
  return true
}

function requireGet(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET')
    sendJson(res, 405, { ok: false, error: 'method_not_allowed' })
    return false
  }
  return true
}

function envStatus() {
  return {
    agentApiKey: Boolean(process.env.AROMAZ_AGENT_API_KEY),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

function supabaseHeaders(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    'content-type': 'application/json',
    ...extra,
  }
}

function supabaseUrl(path, params = {}) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const url = new URL(`/rest/v1/${path}`, base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }
  return url
}

function readLimit(req, fallback = 100, max = 500) {
  const value = Number(new URL(req.url, 'http://localhost').searchParams.get('limit') || fallback)
  return Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), max) : fallback
}

function readOffset(req) {
  const value = Number(new URL(req.url, 'http://localhost').searchParams.get('offset') || 0)
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0
}

function parseCount(contentRange, fallback) {
  const match = String(contentRange || '').match(/\/(\d+)$/)
  return match ? Number(match[1]) : fallback
}

async function selectRows(table, { select = '*', order, limit = 100, offset = 0, count = true } = {}) {
  const params = { select, limit, offset }
  if (order) params.order = order
  const response = await fetch(supabaseUrl(table, params), {
    headers: supabaseHeaders(count ? { prefer: 'count=exact' } : {}),
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(body?.message || body?.error || response.statusText)
  return {
    data: Array.isArray(body) ? body : [],
    count: parseCount(response.headers.get('content-range'), Array.isArray(body) ? body.length : 0),
  }
}

async function countRows(table) {
  const response = await fetch(supabaseUrl(table, { select: 'id', limit: 1 }), {
    headers: supabaseHeaders({ prefer: 'count=exact' }),
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(body?.message || body?.error || response.statusText)
  return parseCount(response.headers.get('content-range'), 0)
}

async function rpc(name, payload = {}) {
  const response = await fetch(supabaseUrl(`rpc/${name}`), {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify(payload),
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(body?.message || body?.error || response.statusText)
  return body
}

module.exports = {
  countRows,
  envStatus,
  readLimit,
  readOffset,
  requireAgentAuth,
  requireGet,
  rpc,
  selectRows,
  sendJson,
}
