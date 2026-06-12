import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const env = {
    agentApiKey: Boolean(process.env.AROMAZ_AGENT_API_KEY),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return NextResponse.json({
      ok: false,
      status: 'degraded',
      env,
      error: 'supabase_not_configured',
    }, { status: 503 })
  }

  const supabase = createAdminClient()
  const startedAt = Date.now()
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({
      ok: false,
      status: 'degraded',
      env,
      database: { ok: false, error: error.message },
    }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    status: 'ok',
    service: 'aromaz-agent-api',
    env,
    database: {
      ok: true,
      sampleTable: 'leads',
      sampleCount: count ?? 0,
      latencyMs: Date.now() - startedAt,
    },
    checkedAt: new Date().toISOString(),
  })
}
