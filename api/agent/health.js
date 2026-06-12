const { envStatus, requireAgentAuth, requireGet, selectRows, sendJson } = require('../_lib/agent')

module.exports = async function handler(req, res) {
  if (!requireGet(req, res) || !requireAgentAuth(req, res)) return

  const env = envStatus()
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    sendJson(res, 503, { ok: false, status: 'degraded', env, error: 'supabase_not_configured' })
    return
  }

  const startedAt = Date.now()
  try {
    const { count } = await selectRows('leads', { select: 'id', limit: 1 })
    sendJson(res, 200, {
      ok: true,
      status: 'ok',
      service: 'aromaz-agent-api',
      env,
      database: {
        ok: true,
        sampleTable: 'leads',
        sampleCount: count,
        latencyMs: Date.now() - startedAt,
      },
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      status: 'degraded',
      env,
      database: { ok: false, error: error instanceof Error ? error.message : 'database_error' },
    })
  }
}
