import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { readLimit, readOffset, requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const limit = readLimit(request, 100, 1000)
  const offset = readOffset(request)
  const supabase = createAdminClient()
  const { data, count, error } = await supabase
    .from('leads')
    .select('id, full_name, company_name, cell_phone, email, lead_source, lead_status, stage, created_by, lead_date, created_date', { count: 'exact' })
    .order('created_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    resource: 'leads',
    count: count ?? data?.length ?? 0,
    limit,
    offset,
    data: data ?? [],
  })
}
