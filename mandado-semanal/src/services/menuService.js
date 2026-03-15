import { supabase } from '../lib/supabase'

export async function getWeeklyMenu(weekStart) {
  const { data, error } = await supabase
    .from('weekly_menu')
    .select(`
      *,
      recipes (
        id,
        name,
        description,
        servings
      )
    `)
    .eq('week_start', weekStart)
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

export async function saveDayMenu(payload) {
  const { day_of_week, week_start, recipe_id } = payload

  const { data: existing, error: findError } = await supabase
    .from('weekly_menu')
    .select('*')
    .eq('week_start', week_start)
    .eq('day_of_week', day_of_week)
    .maybeSingle()

  if (findError) throw findError

  if (existing) {
    const { data, error } = await supabase
      .from('weekly_menu')
      .update({ recipe_id })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('weekly_menu')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDayMenu(id) {
  const { error } = await supabase
    .from('weekly_menu')
    .delete()
    .eq('id', id)

  if (error) throw error
}