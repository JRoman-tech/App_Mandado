import { supabase } from '../lib/supabase'

export async function getShoppingList(weekStart) {
  const { data, error } = await supabase
    .from('shopping_list')
    .select(`
      *,
      ingredients (
        id,
        name
      )
    `)
    .eq('week_start', weekStart)
    .order('category', { ascending: true })

  if (error) throw error
  return data
}

export async function clearShoppingList(weekStart) {
  const { error } = await supabase
    .from('shopping_list')
    .delete()
    .eq('week_start', weekStart)

  if (error) throw error
}

export async function createShoppingItems(items) {
  if (!items.length) return []

  const { data, error } = await supabase
    .from('shopping_list')
    .insert(items)
    .select()

  if (error) throw error
  return data
}

export async function togglePurchased(id, purchased) {
  const { data, error } = await supabase
    .from('shopping_list')
    .update({ purchased })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}