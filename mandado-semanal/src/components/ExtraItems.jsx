import { useState } from 'react';
import PropTypes from 'prop-types';

export default function ExtraItems({ extraItems, onAddItem, onRemoveItem }) {
  const [itemInput, setItemInput] = useState("");

  const handleAdd = () => {
    if (itemInput.trim()) {
      onAddItem(itemInput.trim());
      setItemInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <h2>➕ Agregar extras</h2>
        <p className="card-subtitle">Productos adicionales que no están en las recetas</p>
      </div>

      <div className="extra-input-container">
        <input
          type="text"
          placeholder="Ej. jabón, servilletas, refresco..."
          value={itemInput}
          onChange={(e) => setItemInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-input"
        />
        <button onClick={handleAdd} className="btn btn-primary">
          Agregar
        </button>
      </div>

      {extraItems.length > 0 && (
        <div className="extra-items-list">
          <h3 className="list-title">Items extras agregados:</h3>
          <div className="extra-items-grid">
            {extraItems.map((item, index) => (
              <div key={index} className="extra-item-tag">
                <span>{item.item}</span>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="remove-btn"
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

ExtraItems.propTypes = {
  extraItems: PropTypes.array.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};
