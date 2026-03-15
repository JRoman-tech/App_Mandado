import { useEffect, useState } from 'react'
import IngredientForm from '../components/IngredientForm'
import IngredientList from '../components/IngredientList'
import RecipeForm from '../components/RecipeForm'
import RecipeList from '../components/RecipeList'

import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../services/ingredientsService'

import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addIngredientToRecipe,
  deleteRecipeIngredient,
} from '../services/recipesService'

import {
  getCategories,
  createCategory,
  getUnits,
  createUnit,
} from '../services/catalogService'

export default function AdminPage() {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])

  const [ingredientEditing, setIngredientEditing] = useState(null)
  const [recipeEditing, setRecipeEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      setErrorMsg('')

      const [ingredientsData, recipesData, categoriesData, unitsData] = await Promise.all([
        getIngredients(),
        getRecipes(),
        getCategories(),
        getUnits(),
      ])

      setIngredients(ingredientsData)
      setRecipes(recipesData)
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
  }, [])

  async function handleSaveIngredient(form) {
    try {
      if (ingredientEditing) {
        const updated = await updateIngredient(ingredientEditing.id, form)
        setIngredients(prev =>
          prev.map(item => (item.id === updated.id ? updated : item))
        )
        setIngredientEditing(null)
      } else {
        const created = await createIngredient(form)
        setIngredients(prev => [created, ...prev])
      }
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleDeleteIngredient(id) {
    try {
      await deleteIngredient(id)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleSaveRecipe(form) {
    try {
      if (recipeEditing) {
        await updateRecipe(recipeEditing.id, form)
        setRecipeEditing(null)
      } else {
        await createRecipe(form)
      }
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleDeleteRecipe(id) {
    try {
      await deleteRecipe(id)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleAddIngredientToRecipe(payload) {
    try {
      await addIngredientToRecipe(payload)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleDeleteRecipeIngredient(id) {
    try {
      await deleteRecipeIngredient(id)
      await loadData()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleAddCategory(name) {
    try {
      const created = await createCategory(name)
      setCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      return created
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  async function handleAddUnit(name) {
    try {
      const created = await createUnit(name)
      setUnits(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      return created
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Cargando...</p>

 return (
  <div className="page-shell">
    <div className="hero-box">
      <h1>Administración</h1>
      <p>Aquí puedes crear y editar recetas, ingredientes, categorías y unidades.</p>
    </div>

    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

    <IngredientForm
      onSave={handleSaveIngredient}
      editingItem={ingredientEditing}
      onCancel={() => setIngredientEditing(null)}
      categories={categories}
      onAddCategory={handleAddCategory}
    />

    <IngredientList
      items={ingredients}
      onEdit={setIngredientEditing}
      onDelete={handleDeleteIngredient}
    />

    <RecipeForm
      onSave={handleSaveRecipe}
      editingItem={recipeEditing}
      onCancel={() => setRecipeEditing(null)}
    />

    <RecipeList
      recipes={recipes}
      ingredients={ingredients}
      units={units}
      onEditRecipe={setRecipeEditing}
      onDeleteRecipe={handleDeleteRecipe}
      onAddIngredient={handleAddIngredientToRecipe}
      onDeleteRecipeIngredient={handleDeleteRecipeIngredient}
      onAddUnit={handleAddUnit}
    />
  </div>
)
}