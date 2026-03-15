import { supabase } from '../lib/supabase'

export async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        id,
        quantity,
        unit,
        ingredient_id,
        ingredients (
          id,
          name,
          category
        )
      )
    `)
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

export async function createRecipe(payload) {
  const { data, error } = await supabase
    .from('recipes')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRecipe(id, payload) {
  const { data, error } = await supabase
    .from('recipes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRecipe(id) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function addIngredientToRecipe(payload) {
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .insert([payload])
    .select(`
      *,
      ingredients (
        id,
        name,
        category
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateRecipeIngredient(id, payload) {
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .update(payload)
    .eq('id', id)
    .select(`
      *,
      ingredients (
        id,
        name,
        category
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteRecipeIngredient(id) {
  const { error } = await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('id', id)

  if (error) throw error
}
