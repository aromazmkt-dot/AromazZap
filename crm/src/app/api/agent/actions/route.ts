import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActionApproval, requireAgentAuth } from '@/lib/agent/auth'

type ActionBody = Record<string, unknown> & { action?: string; dryRun?: boolean }
type ActionConfig = {
  table: string
  filters: (body: ActionBody) => Record<string, string | number | boolean>
  values: (body: ActionBody) => Record<string, unknown>
}

export const dynamic = 'force-dynamic'

const ACTIONS: Record<string, ActionConfig> = {
  'lead.updateStatus': {
    table: 'leads',
    filters: body => ({ id: required(body, 'id') }),
    values: body => pick(body, ['lead_status', 'stage']),
  },
  'lead.assignOwner': {
    table: 'leads',
    filters: body => ({ id: required(body, 'id') }),
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
    filters: body => ({ id: required(body, 'id') }),
    values: body => pick(body, ['status', 'notes', 'responsible', 'due_date']),
  },
  'customer.updateStatus': {
    table: 'customers',
    filters: body => ({ customer_id: required(body, 'customer_id') }),
    values: body => pick(body, ['status', 'is_active']),
  },
}

function required(body: ActionBody, key: string) {
  const value = body[key]
  if (value === undefined || value === null || value === '') throw new Error(`missing_${key}`)
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  throw new Error(`invalid_${key}`)
}

function productFilters(body: ActionBody) {
  return {
    product_type: required(body, 'product_type'),
    source_product_id: required(body, 'source_product_id'),
  }
}

function pick(body: ActionBody, keys: string[]) {
  const out: Record<string, unknown> = {}
  for (const key of keys) if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key]
  if (Object.keys(out).length === 0) throw new Error('no_allowed_fields')
  return out
}

function applyFilters<T>(query: T, filters: Record<string, string | number | boolean>): T {
  let current: unknown = query
  for (const [key, value] of Object.entries(filters)) {
    current = (current as { eq: (column: string, value: string | number | boolean) => unknown }).eq(key, value)
  }
  return current as T
}

export async function POST(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  try {
    const body = await request.json() as ActionBody
    const action = required(body, 'action')
    const config = ACTIONS[String(action)]
    if (!config) {
      return NextResponse.json({ ok: false, error: 'unsupported_action', supportedActions: Object.keys(ACTIONS) }, { status: 400 })
    }

    const dryRun = body.dryRun !== false
    const approval = requireActionApproval(request, dryRun)
    if (approval) return approval

    const filters = config.filters(body)
    const values = config.values(body)
    const supabase = createAdminClient()
    const beforeQuery = applyFilters(supabase.from(config.table).select('*'), filters).limit(10)
    const { data: before, error: beforeError } = await beforeQuery
    if (beforeError) throw new Error(beforeError.message)

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        action,
        table: config.table,
        filters,
        values,
        matchedRows: before?.length ?? 0,
        before: before ?? [],
      })
    }

    const updateQuery = applyFilters(supabase.from(config.table).update(values).select('*'), filters)
    const { data: after, error: updateError } = await updateQuery
    if (updateError) throw new Error(updateError.message)

    return NextResponse.json({
      ok: true,
      dryRun: false,
      action,
      table: config.table,
      filters,
      values,
      updatedRows: after?.length ?? 0,
      before: before ?? [],
      after: after ?? [],
      changedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'action_failed' }, { status: 400 })
  }
}
