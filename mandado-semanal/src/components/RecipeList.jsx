import { useState } from 'react'

export default function RecipeList({
  recipes,
  ingredients,
  units,
  onEditRecipe,
  onDeleteRecipe,
  onAddIngredient,
  onDeleteRecipeIngredient,
  onAddUnit,
}) {
  async function handleAddIngredient(recipeId, e) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const ingredient_id = Number(formData.get('ingredient_id'))
    const quantity = Number(formData.get('quantity'))
    const unit = formData.get('unit')

    if (!ingredient_id || !quantity || !unit) return

    await onAddIngredient({
      recipe_id: recipeId,
      ingredient_id,
      quantity,
      unit,
    })

    e.currentTarget.reset()
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Recetas</h2>
          <p className="section-subtitle">
            Administra recetas y relaciona ingredientes con sus cantidades.
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>No hay recetas registradas todavía.</p>
        </div>
      ) : (
        <div className="recipe-list">
          {recipes.map(recipe => (
            <article key={recipe.id} className="recipe-card">
              <div className="recipe-card-top">
                <div>
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-description">
                    {recipe.description || 'Sin descripción'}
                  </p>
                  <span className="badge">
                    Porciones: {recipe.servings || 1}
                  </span>
                </div>

                <div className="action-row">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEditRecipe(recipe)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => onDeleteRecipe(recipe.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="recipe-section">
                <h4 className="subsection-title">Ingredientes de la receta</h4>

                {recipe.recipe_ingredients?.length ? (
                  <ul className="ingredient-chip-list">
                    {recipe.recipe_ingredients.map(item => (
                      <li key={item.id} className="ingredient-chip">
                        <span>
                          <strong>{item.ingredients?.name}</strong> · {item.quantity} {item.unit}
                        </span>

                        <button
                          className="chip-delete"
                          onClick={() => onDeleteRecipeIngredient(item.id)}
                        >
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-text">Sin ingredientes agregados.</p>
                )}
              </div>

              <div className="recipe-section">
                <h4 className="subsection-title">Agregar ingrediente</h4>

                <form
                  className="form-grid"
                  onSubmit={(e) => handleAddIngredient(recipe.id, e)}
                >
                  <div className="form-group">
                    <label className="form-label">Ingrediente</label>
                    <select className="form-input" name="ingredient_id" defaultValue="">
                      <option value="">Selecciona ingrediente</option>
                      {ingredients.map(ingredient => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cantidad</label>
                    <input
                      className="form-input"
                      type="number"
                      step="0.01"
                      name="quantity"
                      placeholder="Ej. 2"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unidad</label>
                    <select className="form-input" name="unit" defaultValue="">
                      <option value="">Selecciona unidad</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Agregar ingrediente
                    </button>
                  </div>
                </form>

                <AddUnitInline onAddUnit={onAddUnit} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function AddUnitInline({ onAddUnit }) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!value.trim()) return

    try {
      setSaving(true)
      await onAddUnit(value.trim())
      setValue('')
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="inline-block-box">
      <label className="form-label">Agregar nueva unidad</label>

      <div className="inline-row">
        <input
          className="form-input"
          type="text"
          placeholder="Ej. cucharada"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAdd}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Agregar unidad'}
        </button>
      </div>
    </div>
  )
}