import PropTypes from 'prop-types';

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];

export default function WeeklyMenu({ mealPlan, recipes, onMealChange, onClearAll }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>🗓️ Menú semanal</h2>
        <p className="card-subtitle">Selecciona qué cocinarás cada día</p>
      </div>

      <div className="days-grid">
        {DAYS.map((day) => (
          <div key={day} className="day-row">
            <label className="day-label">{day}</label>
            <select
              value={mealPlan[day] || ""}
              onChange={(e) => onMealChange(day, e.target.value)}
              className="select-input"
            >
              <option value="">Selecciona un platillo</option>
              {recipes.map((recipe) => (
                <option key={recipe.name} value={recipe.name}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="card-actions">
        <button onClick={onClearAll} className="btn btn-secondary">
          🗑️ Limpiar todo
        </button>
      </div>
    </section>
  );
}

WeeklyMenu.propTypes = {
  mealPlan: PropTypes.object.isRequired,
  recipes: PropTypes.array.isRequired,
  onMealChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};
