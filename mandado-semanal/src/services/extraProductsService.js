import { supabase } from '../lib/supabase'

export async function getExtraProducts(weekStart) {
  const { data, error } = await supabase
    .from('extra_products')
    .select(`
      *,
      categories (
        id,
        name
      ),
      units (
        id,
        name
      )
    `)
    .eq('week_start', weekStart)
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

export async function createExtraProduct(payload) {
  const { data, error } = await supabase
    .from('extra_products')
    .insert([payload])
    .select(`
      *,
      categories (
        id,
        name
      ),
      units (
        id,
        name
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateExtraProduct(id, payload) {
  const { data, error } = await supabase
    .from('extra_products')
    .update(payload)
    .eq('id', id)
    .select(`
      *,
      categories (
        id,
        name
      ),
      units (
        id,
        name
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteExtraProduct(id) {
  const { error } = await supabase
    .from('extra_products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleExtraProductPurchased(id, purchased) {
  const { data, error } = await supabase
    .from('extra_products')
    .update({ purchased })
    .eq('id', id)
    .select(`
      *,
      categories (
        id,
        name
      ),
      units (
        id,
        name
      )
    `)
    .single()

  if (error) throw error
  return data
}