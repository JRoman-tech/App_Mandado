export default function ExtraProductList({ items, onDelete, onToggle }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Extras de la semana</h3>

      {items.length === 0 ? (
        <p>No hay productos extra.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} style={{ marginBottom: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={(e) => onToggle(item.id, e.target.checked)}
                />
                {' '}
                <strong>{item.name}</strong> - {item.quantity} {item.units?.name} ({item.categories?.name || 'Sin categoría'})
              </label>

              <button
                style={{ marginLeft: 8 }}
                onClick={() => onDelete(item.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}