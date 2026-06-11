'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateProduct(
  productType: string,
  sourceProductId: number,
  formData: FormData,
) {
  const supabase = createAdminClient()

  const patch: Record<string, unknown> = {
    product_name: formData.get('product_name') || null,
    sku: formData.get('sku') || null,
    category: formData.get('category') || null,
    vendor: formData.get('vendor') || null,
    unit_cost: formData.get('unit_cost') ? Number(formData.get('unit_cost')) : null,
    sales_price: formData.get('sales_price') ? Number(formData.get('sales_price')) : null,
    unit_measure: formData.get('unit_measure') || null,
    description: formData.get('description') || null,
    style: formData.get('style') || null,
    color: formData.get('color') || null,
  }

  const { error } = await supabase
    .from('products')
    .update(patch)
    .eq('product_type', productType)
    .eq('source_product_id', sourceProductId)

  if (error) throw new Error(error.message)

  revalidatePath('/products')
  revalidatePath(`/products/${encodeURIComponent(productType)}/${sourceProductId}`)
}
