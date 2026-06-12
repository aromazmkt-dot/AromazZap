import { NextRequest, NextResponse } from 'next/server'

export type AgentAuthFailure = NextResponse<{ ok: false; error: string; requiredHeader?: string }>

export function requireAgentAuth(request: NextRequest): AgentAuthFailure | null {
  const expected = process.env.AROMAZ_AGENT_API_KEY

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'agent_api_key_not_configured' },
      { status: 503 }
    )
  }

  const authorization = request.headers.get('authorization')
  if (authorization !== `Bearer ${expected}`) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401 }
    )
  }

  return null
}

export function requireActionApproval(request: NextRequest, dryRun: boolean): AgentAuthFailure | null {
  if (dryRun) return null
  if (request.headers.get('x-aromaz-action-approval') === 'APPROVED') return null
  return NextResponse.json(
    {
      ok: false,
      error: 'explicit_action_approval_required',
      requiredHeader: 'X-Aromaz-Action-Approval: APPROVED',
    },
    { status: 409 }
  )
}

export function readLimit(request: NextRequest, fallback = 100, max = 500) {
  const raw = request.nextUrl.searchParams.get('limit')
  const parsed = raw ? Number(raw) : fallback
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(Math.floor(parsed), max)
}

export function readOffset(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('offset')
  const parsed = raw ? Number(raw) : 0
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.floor(parsed)
}
