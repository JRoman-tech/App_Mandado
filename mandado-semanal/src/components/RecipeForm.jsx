import { useEffect, useState } from 'react'

const initialState = {
  name: '',
  description: '',
  servings: 1,
}

export default function RecipeForm({ onSave, editingItem, onCancel }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || '',
        description: editingItem.description || '',
        servings: editingItem.servings || 1,
      })
    } else {
      setForm(initialState)
    }
  }, [editingItem])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'servings' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    await onSave(form)
    setForm(initialState)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>{editingItem ? 'Editar receta' : 'Nueva receta'}</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre de la receta"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="number"
        name="servings"
        min="1"
        value={form.servings}
        onChange={handleChange}
      />

      <button type="submit">
        {editingItem ? 'Actualizar' : 'Guardar'}
      </button>

      {editingItem && (
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  )
}
