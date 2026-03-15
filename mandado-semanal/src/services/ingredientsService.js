import { supabase } from '../lib/supabase'

export async function getIngredients() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

export async function createIngredient(payload) {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateIngredient(id, payload) {
  const { data, error } = await supabase
    .from('ingredients')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteIngredient(id) {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id)

  if (error) throw error
}
