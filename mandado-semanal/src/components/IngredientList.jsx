export default function IngredientList({ items, onEdit, onDelete }) {
  return (
    <div>
      <h2>Ingredientes</h2>

      {items.length === 0 ? (
        <p>No hay ingredientes.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} style={{ marginBottom: 10 }}>
              <strong>{item.name}</strong> - {item.category}{' '}
              <button onClick={() => onEdit(item)}>Editar</button>{' '}
              <button onClick={() => onDelete(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
