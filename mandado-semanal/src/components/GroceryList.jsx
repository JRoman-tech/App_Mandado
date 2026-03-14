import { useState } from 'react';
import PropTypes from 'prop-types';

export default function GroceryList({ groceryList }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleChecked = (category, index) => {
    const key = `${category}-${index}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalItems = Object.values(groceryList).reduce(
    (acc, items) => acc + items.length,
    0
  );

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>🛒 Lista del mercado</h2>
          <p className="card-subtitle">
            {totalItems} productos en total {checkedCount > 0 && `• ${checkedCount} marcados`}
          </p>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={() => setCheckedItems({})}
            className="btn btn-sm btn-secondary"
          >
            Desmarcar todos
          </button>
        )}
      </div>

      {totalItems === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <p>No hay productos todavía</p>
          <p className="empty-subtitle">Selecciona platillos en el menú semanal</p>
        </div>
      ) : (
        <div className="grocery-categories">
          {Object.entries(groceryList).map(([category, items]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <ul className="grocery-items">
                {items.map((item, index) => {
                  const key = `${category}-${index}`;
                  const isChecked = checkedItems[key];

                  return (
                    <li key={index} className="grocery-item">
                      <label className="grocery-item-label">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleChecked(category, index)}
                          className="checkbox"
                        />
                        <span className={isChecked ? "checked" : ""}>
                          <strong>{item.item}</strong>
                          <span className="quantity">
                            {item.qty} {item.unit}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

GroceryList.propTypes = {
  groceryList: PropTypes.object.isRequired,
};
