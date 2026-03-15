export default function ShoppingList({ items, onToggle }) {
  if (!items.length) {
    return (
      <div>
        <h2>Lista del súper</h2>
        <p>No hay productos en la lista.</p>
      </div>
    )
  }

  const grouped = items.reduce((acc, item) => {
    const category = item.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  return (
    <div>
      <h2>Lista del súper</h2>

      {Object.entries(grouped).map(([category, products]) => (
        <div key={category} style={{ marginBottom: 20 }}>
          <h3>{category}</h3>

          <ul>
            {products.map(item => (
              <li key={item.id} style={{ marginBottom: 10 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.purchased}
                    onChange={(e) => onToggle(item.id, e.target.checked)}
                  />
                  {' '}
                  <strong>{item.ingredients?.name}</strong> - {item.quantity} {item.unit}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}