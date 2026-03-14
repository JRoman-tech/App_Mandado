import { useMemo, useState } from "react";
import { recipes } from "./data/recipes";
import "./index.css";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];

function App() {
  const [mealPlan, setMealPlan] = useState({
    Lunes: "",
    Martes: "",
    Miércoles: "",
    Jueves: "",
    Viernes: "",
    Sábado: "",
    Domingo: ""
  });

  const [extraItem, setExtraItem] = useState("");
  const [extraItems, setExtraItems] = useState([]);

  const handleMealChange = (day, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: value
    }));
  };

  const addExtraItem = () => {
    if (!extraItem.trim()) return;

    setExtraItems((prev) => [
      ...prev,
      { item: extraItem, qty: 1, unit: "pz", category: "Extras" }
    ]);
    setExtraItem("");
  };

  const groceryList = useMemo(() => {
    const map = new Map();

    Object.values(mealPlan).forEach((recipeName) => {
      if (!recipeName) return;

      const recipe = recipes.find((r) => r.name === recipeName);
      if (!recipe) return;

      recipe.ingredients.forEach((ingredient) => {
        const key = `${ingredient.item}-${ingredient.unit}`;
        if (map.has(key)) {
          map.get(key).qty += ingredient.qty;
        } else {
          map.set(key, { ...ingredient });
        }
      });
    });

    extraItems.forEach((item) => {
      const key = `${item.item}-${item.unit}`;
      if (map.has(key)) {
        map.get(key).qty += item.qty;
      } else {
        map.set(key, { ...item });
      }
    });

    const grouped = {};

    Array.from(map.values()).forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [mealPlan, extraItems]);

  return (
    <div className="app">
      <header className="header">
        <h1>Planeador semanal de mercado</h1>
        <p>Selecciona lo que cocinarás y genera tu lista automáticamente</p>
      </header>

      <main className="container">
        <section className="card">
          <h2>Menú semanal</h2>
          <div className="days-grid">
            {days.map((day) => (
              <div key={day} className="day-row">
                <label>{day}</label>
                <select
                  value={mealPlan[day]}
                  onChange={(e) => handleMealChange(day, e.target.value)}
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
        </section>

        <section className="card">
          <h2>Agregar extras</h2>
          <div className="extra-row">
            <input
              type="text"
              placeholder="Ej. jabón, servilletas, refresco"
              value={extraItem}
              onChange={(e) => setExtraItem(e.target.value)}
            />
            <button onClick={addExtraItem}>Agregar</button>
          </div>
        </section>

        <section className="card">
          <h2>Lista del mercado</h2>
          {Object.keys(groceryList).length === 0 ? (
            <p>No hay productos todavía.</p>
          ) : (
            Object.entries(groceryList).map(([category, items]) => (
              <div key={category} className="category-block">
                <h3>{category}</h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      {item.item} - {item.qty} {item.unit}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
