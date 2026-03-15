import { useEffect, useState } from 'react'
import WeeklyMenu from '../components/WeeklyMenu'
import ShoppingList from '../components/ShoppingList'
import ExtraProductForm from '../components/ExtraProductForm'
import ExtraProductList from '../components/ExtraProductList'

import { getRecipes } from '../services/recipesService'
import { getWeeklyMenu, saveDayMenu, deleteDayMenu } from '../services/menuService'
import {
  getShoppingList,
  clearShoppingList,
  createShoppingItems,
  togglePurchased,
} from '../services/shoppingListService'
import {
  getExtraProducts,
  createExtraProduct,
  deleteExtraProduct,
  toggleExtraProductPurchased,
} from '../services/extraProductsService'
import {
  getCategories,
  createCategory,
  getUnits,
  createUnit,
} from '../services/catalogService'

function getMonday(date = new Date()) {
  const current = new Date(date)
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(current.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [weeklyMenu, setWeeklyMenu] = useState([])
  const [shoppingList, setShoppingList] = useState([])
  const [extraProducts, setExtraProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])

  const [weekStart, setWeekStart] = useState(getMonday())
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      setErrorMsg('')

      const [
        recipesData,
        weeklyMenuData,
        shoppingListData,
        extraProductsData,
        categoriesData,
        unitsData,
      ] = await Promise.all([
        getRecipes(),
        getWeeklyMenu(weekStart),
        getShoppingList(weekStart),
        getExtraProducts(weekStart),
        getCategories(),
        getUnits(),
      ])

      setRecipes(recipesData)
      setWeeklyMenu(weeklyMenuData)
      setShoppingList(shoppingListData)
      setExtraProducts(extraProductsData)
      setCategories(categoriesData)
      setUnits(unitsData)
    } catch (error) {
      console.error(error)
      setErrorMsg(error.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [weekStart])

  async function handleSaveDay(day, recipeId) {
    try {
      if (!recipeId) return

      await saveDayMenu({
        day_of_week: day,
        week_start: weekStart,
        recipe_id: Number(recipeId),
      })

      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleRemoveDay(id) {
    try {
      await deleteDayMenu(id)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleGenerateShoppingList() {
    try {
      await clearShoppingList(weekStart)

      const selectedRecipeIds = weeklyMenu.map(item => item.recipe_id)

      const selectedRecipes = recipes.filter(recipe =>
        selectedRecipeIds.includes(recipe.id)
      )

      const grouped = {}

      for (const recipe of selectedRecipes) {
        for (const item of recipe.recipe_ingredients || []) {
          const ingredientId = item.ingredient_id
          const category = item.ingredients?.category || 'General'
          const unit = item.unit || 'pieza'
          const quantity = Number(item.quantity || 0)
          const key = `${ingredientId}-${unit}`

          if (!grouped[key]) {
            grouped[key] = {
              week_start: weekStart,
              ingredient_id: ingredientId,
              quantity,
              unit,
              category,
              purchased: false,
            }
          } else {
            grouped[key].quantity += quantity
          }
        }
      }

      const finalItems = Object.values(grouped)

      if (!finalItems.length) {
        alert('No hay ingredientes en las recetas seleccionadas.')
        return
      }

      await createShoppingItems(finalItems)
      await loadData()
      alert('Lista del súper generada correctamente.')
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleClearShoppingList() {
    try {
      await clearShoppingList(weekStart)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleTogglePurchased(id, purchased) {
    try {
      const updated = await togglePurchased(id, purchased)
      setShoppingList(prev =>
        prev.map(item => (item.id === updated.id ? { ...item, ...updated } : item))
      )
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleSaveExtraProduct(payload) {
    try {
      await createExtraProduct(payload)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleDeleteExtraProduct(id) {
    try {
      await deleteExtraProduct(id)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleToggleExtraProduct(id, purchased) {
    try {
      const updated = await toggleExtraProductPurchased(id, purchased)
      setExtraProducts(prev =>
        prev.map(item => (item.id === updated.id ? updated : item))
      )
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleAddCategory(name) {
    try {
      const created = await createCategory(name)
      setCategories(prev =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      )
      return created
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleAddUnit(name) {
    try {
      const created = await createUnit(name)
      setUnits(prev =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      )
      return created
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="hero-box">
        <h1>Mandado semanal</h1>
        <p>Organiza tus recetas, planea tu semana y genera tu lista del súper.</p>
      </div>

      <section className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Planeación de la semana</h2>
            <p className="section-subtitle">
              Selecciona la semana que quieres organizar.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Semana inicial</label>
            <input
              className="form-input"
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
            />
          </div>
        </div>

        {errorMsg && (
          <p style={{ color: 'red', marginTop: 12 }}>{errorMsg}</p>
        )}
      </section>

      <WeeklyMenu
        recipes={recipes}
        weeklyMenu={weeklyMenu}
        onSaveDay={handleSaveDay}
        onRemoveDay={handleRemoveDay}
      />

      <section className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Acciones rápidas</h2>
            <p className="section-subtitle">
              Genera o limpia tu lista según el menú seleccionado.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleGenerateShoppingList}>
            Generar lista del súper
          </button>
          <button className="btn btn-ghost" onClick={handleClearShoppingList}>
            Limpiar lista
          </button>
        </div>
      </section>

      <ShoppingList
        items={shoppingList}
        onToggle={handleTogglePurchased}
      />

      <ExtraProductForm
        weekStart={weekStart}
        categories={categories}
        units={units}
        onSave={handleSaveExtraProduct}
        onAddCategory={handleAddCategory}
        onAddUnit={handleAddUnit}
      />

      <ExtraProductList
        items={extraProducts}
        onDelete={handleDeleteExtraProduct}
        onToggle={handleToggleExtraProduct}
      />
    </div>
  )
}