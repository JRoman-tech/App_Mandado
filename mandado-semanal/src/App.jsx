import { useMemo, useState } from "react";
import { recipes } from "./data/recipes";
import WeeklyMenu from "./components/WeeklyMenu";
import ExtraItems from "./components/ExtraItems";
import GroceryList from "./components/GroceryList";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const INITIAL_MEAL_PLAN = {
  Lunes: "",
  Martes: "",
  Miércoles: "",
  Jueves: "",
  Viernes: "",
  Sábado: "",
  Domingo: ""
};

function App() {
  const [mealPlan, setMealPlan] = useState(INITIAL_MEAL_PLAN);
  const [extraItems, setExtraItems] = useState([]);

  const handleMealChange = (day, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: value
    }));
  };

  const handleClearAll = () => {
    setMealPlan(INITIAL_MEAL_PLAN);
    setExtraItems([]);
  };

  const handleAddExtraItem = (itemName) => {
    setExtraItems((prev) => [
      ...prev,
      { item: itemName, qty: 1, unit: "pz", category: "Extras" }
    ]);
  };

  const handleRemoveExtraItem = (index) => {
    setExtraItems((prev) => prev.filter((_, i) => i !== index));
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

  const selectedRecipesCount = Object.values(mealPlan).filter(Boolean).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Planeador Semanal de Mercado</h1>
        <p>Organiza tu menú semanal y genera tu lista de compras automáticamente</p>
        <div className="stats">
          <span className="stat-badge">{selectedRecipesCount} platillos seleccionados</span>
          <span className="stat-badge">
            {Object.values(groceryList).reduce((acc, items) => acc + items.length, 0)} productos en la lista
          </span>
        </div>
      </header>

      <main className="container">
        <div className="main-grid">
          <div className="left-column">
            <WeeklyMenu
              mealPlan={mealPlan}
              recipes={recipes}
              onMealChange={handleMealChange}
              onClearAll={handleClearAll}
            />

            <ExtraItems
              extraItems={extraItems}
              onAddItem={handleAddExtraItem}
              onRemoveItem={handleRemoveExtraItem}
            />
          </div>

          <div className="right-column">
            <RecipeCard recipes={recipes} />
          </div>
        </div>

        <GroceryList groceryList={groceryList} />
      </main>
    </div>
  );
}

export default App;
