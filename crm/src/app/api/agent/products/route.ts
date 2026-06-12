import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { readLimit, readOffset, requireAgentAuth } from '@/lib/agent/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = requireAgentAuth(request)
  if (auth) return auth

  const limit = readLimit(request)
  const offset = readOffset(request)
  const supabase = createAdminClient()
  const { data, count, error } = await supabase
    .from('products')
    .select('product_type, source_product_id, product_name, style, color, sku, category, vendor, unit_cost, sales_price, quantity, available_quantity, unit_measure, is_stock, discontinued, visible, description', { count: 'exact' })
    .order('category')
    .order('product_name')
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    resource: 'products',
    count: count ?? data?.length ?? 0,
    limit,
    offset,
    data: data ?? [],
  })
}
