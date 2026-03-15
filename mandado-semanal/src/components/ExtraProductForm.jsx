import { useState } from 'react'

export default function ExtraProductForm({
  weekStart,
  categories,
  units,
  onSave,
  onAddCategory,
  onAddUnit,
}) {
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    quantity: 1,
    unit_id: '',
  })

  const [newCategory, setNewCategory] = useState('')
  const [newUnit, setNewUnit] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.category_id || !form.unit_id) return

    await onSave({
      week_start: weekStart,
      name: form.name,
      category_id: Number(form.category_id),
      quantity: Number(form.quantity),
      unit_id: Number(form.unit_id),
      purchased: false,
    })

    setForm({
      name: '',
      category_id: '',
      quantity: 1,
      unit_id: '',
    })
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return
    const created = await onAddCategory(newCategory.trim())
    setForm(prev => ({ ...prev, category_id: String(created.id) }))
    setNewCategory('')
  }

  async function handleAddUnit() {
    if (!newUnit.trim()) return
    const created = await onAddUnit(newUnit.trim())
    setForm(prev => ({ ...prev, unit_id: String(created.id) }))
    setNewUnit('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <h2>Productos extra</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre del producto"
        value={form.name}
        onChange={handleChange}
      />

      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
      >
        <option value="">Selecciona categoría</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
      />

      <select
        name="unit_id"
        value={form.unit_id}
        onChange={handleChange}
      >
        <option value="">Selecciona unidad</option>
        {units.map(unit => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          Agregar categoría
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Nueva unidad"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
        />
        <button type="button" onClick={handleAddUnit}>
          Agregar unidad
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit">Guardar producto extra</button>
      </div>
    </form>
  )
}