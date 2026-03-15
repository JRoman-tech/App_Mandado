import { supabase } from '../lib/supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUnits() {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createUnit(name) {
  const { data, error } = await supabase
    .from('units')
    .insert([{ name }])
    .select()
    .single()

  if (error) throw error
  return data
}