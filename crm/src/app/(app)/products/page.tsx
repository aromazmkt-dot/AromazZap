import { createAdminClient } from '@/lib/supabase/admin'
import ProductsClient from './ProductsClient'

export const revalidate = 120

export default async function ProductsPage() {
  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from('products')
    .select('product_type, source_product_id, product_name, style, color, sku, category, vendor, unit_cost, sales_price, quantity, available_quantity, unit_measure, is_stock, discontinued, visible, description')
    .order('category')
    .order('product_name')
    .range(0, 499)

  return <ProductsClient products={products ?? []} />
}
