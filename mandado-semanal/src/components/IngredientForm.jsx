import { useEffect, useState } from 'react'

const initialState = {
  name: '',
  category: '',
}

export default function IngredientForm({
  onSave,
  editingItem,
  onCancel,
  categories = [],
  onAddCategory,
}) {
  const [form, setForm] = useState(initialState)
  const [newCategory, setNewCategory] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || '',
        category: editingItem.category || '',
      })
    } else {
      setForm(initialState)
    }
  }, [editingItem])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.category.trim()) return

    await onSave({
      name: form.name.trim(),
      category: form.category.trim(),
    })

    setForm(initialState)
  }

  async function handleAddNewCategory() {
    if (!newCategory.trim() || !onAddCategory) return

    try {
      setSavingCategory(true)
      const created = await onAddCategory(newCategory.trim())

      if (created?.name) {
        setForm(prev => ({ ...prev, category: created.name }))
      }

      setNewCategory('')
    } catch (error) {
      console.error(error)
    } finally {
      setSavingCategory(false)
    }
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {editingItem ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          </h2>
          <p className="section-subtitle">
            Guarda ingredientes y clasifícalos por categoría.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label">Nombre del ingrediente</label>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Ej. Tomate"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            className="form-input"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-full">
          <label className="form-label">Agregar nueva categoría</label>
          <div className="inline-row">
            <input
              className="form-input"
              type="text"
              placeholder="Ej. Congelados"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddNewCategory}
              disabled={savingCategory}
            >
              {savingCategory ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Actualizar ingrediente' : 'Guardar ingrediente'}
          </button>

          {editingItem && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}