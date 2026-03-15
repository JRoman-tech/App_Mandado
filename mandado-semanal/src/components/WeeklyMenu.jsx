const days = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

export default function WeeklyMenu({ recipes, weeklyMenu, onSaveDay, onRemoveDay }) {
  function getRecipeForDay(day) {
    return weeklyMenu.find(item => item.day_of_week === day)
  }

  return (
    <div>
      <h2>Menú semanal</h2>

      {days.map(day => {
        const dayData = getRecipeForDay(day)

        return (
          <div key={day} style={{ marginBottom: 12 }}>
            <label style={{ marginRight: 12 }}>{day}</label>

            <select
              value={dayData?.recipe_id || ''}
              onChange={(e) => onSaveDay(day, e.target.value)}
            >
              <option value="">Selecciona receta</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>

            {dayData && (
              <button
                style={{ marginLeft: 10 }}
                onClick={() => onRemoveDay(dayData.id)}
              >
                Quitar
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}