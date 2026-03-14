import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Soup, CalendarDays, Plus, Trash2 } from 'lucide-react';

const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const recipeCatalog = [
  {
    name: 'Tacos de bistec',
    ingredients: [
      { item: 'Bistec', qty: 1, unit: 'kg', category: 'Carnes' },
      { item: 'Tortillas', qty: 2, unit: 'paquetes', category: 'Abarrotes' },
      { item: 'Cebolla', qty: 2, unit: 'pzas', category: 'Verduras' },
      { item: 'Cilantro', qty: 1, unit: 'manojo', category: 'Verduras' },
      { item: 'Limón', qty: 6, unit: 'pzas', category: 'Frutas y verduras' },
    ],
  },
  {
    name: 'Espagueti rojo',
    ingredients: [
      { item: 'Espagueti', qty: 2, unit: 'paquetes', category: 'Abarrotes' },
      { item: 'Salsa de tomate', qty: 2, unit: 'latas', category: 'Abarrotes' },
      { item: 'Queso rallado', qty: 1, unit: 'bolsa', category: 'Lácteos' },
      { item: 'Crema', qty: 1, unit: 'envase', category: 'Lácteos' },
      { item: 'Ajo', qty: 1, unit: 'cabeza', category: 'Verduras' },
    ],
  },
  {
    name: 'Pollo con arroz',
    ingredients: [
      { item: 'Pollo', qty: 1, unit: 'kg', category: 'Carnes' },
      { item: 'Arroz', qty: 1, unit: 'kg', category: 'Abarrotes' },
      { item: 'Zanahoria', qty: 4, unit: 'pzas', category: 'Verduras' },
      { item: 'Chícharos', qty: 1, unit: 'bolsa', category: 'Congelados' },
      { item: 'Consomé de pollo', qty: 1, unit: 'caja', category: 'Abarrotes' },
    ],
  },
  {
    name: 'Enchiladas verdes',
    ingredients: [
      { item: 'Tortillas', qty: 2, unit: 'paquetes', category: 'Abarrotes' },
      { item: 'Pollo deshebrado', qty: 700, unit: 'g', category: 'Carnes' },
      { item: 'Salsa verde', qty: 1, unit: 'frasco', category: 'Abarrotes' },
      { item: 'Queso fresco', qty: 1, unit: 'pieza', category: 'Lácteos' },
      { item: 'Crema', qty: 1, unit: 'envase', category: 'Lácteos' },
      { item: 'Lechuga', qty: 1, unit: 'pieza', category: 'Verduras' },
    ],
  },
  {
    name: 'Hamburguesas',
    ingredients: [
      { item: 'Carne molida', qty: 1, unit: 'kg', category: 'Carnes' },
      { item: 'Pan para hamburguesa', qty: 2, unit: 'paquetes', category: 'Panadería' },
      { item: 'Queso amarillo', qty: 1, unit: 'paquete', category: 'Lácteos' },
      { item: 'Lechuga', qty: 1, unit: 'pieza', category: 'Verduras' },
      { item: 'Tomate', qty: 4, unit: 'pzas', category: 'Verduras' },
      { item: 'Catsup', qty: 1, unit: 'botella', category: 'Abarrotes' },
    ],
  },
  {
    name: 'Sopa de verduras',
    ingredients: [
      { item: 'Papa', qty: 4, unit: 'pzas', category: 'Verduras' },
      { item: 'Zanahoria', qty: 4, unit: 'pzas', category: 'Verduras' },
      { item: 'Calabacita', qty: 3, unit: 'pzas', category: 'Verduras' },
      { item: 'Apio', qty: 1, unit: 'manojo', category: 'Verduras' },
      { item: 'Consomé de pollo', qty: 1, unit: 'caja', category: 'Abarrotes' },
    ],
  },
];

const emptyPlan = DAYS.reduce((acc, day) => {
  acc[day] = '';
  return acc;
}, {});

const normalize = (text) => text.trim().toLowerCase();

export default function MercadoSemanalApp() {
  const [mealPlan, setMealPlan] = useState({ ...emptyPlan });
  const [extraItem, setExtraItem] = useState('');
  const [manualItems, setManualItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const selectedRecipes = useMemo(() => {
    return Object.values(mealPlan).filter(Boolean);
  }, [mealPlan]);

  const groceryList = useMemo(() => {
    const map = new Map();

    selectedRecipes.forEach((recipeName) => {
      const recipe = recipeCatalog.find((r) => r.name === recipeName);
      if (!recipe) return;

      recipe.ingredients.forEach((ingredient) => {
        const key = `${normalize(ingredient.item)}__${ingredient.unit}`;
        if (!map.has(key)) {
          map.set(key, { ...ingredient });
        } else {
          map.get(key).qty += ingredient.qty;
        }
      });
    });

    manualItems.forEach((item) => {
      const key = `${normalize(item.item)}__${item.unit}`;
      if (!map.has(key)) {
        map.set(key, { ...item, category: 'Extras' });
      } else {
        map.get(key).qty += item.qty;
      }
    });

    const grouped = {};
    Array.from(map.values())
      .sort((a, b) => a.category.localeCompare(b.category) || a.item.localeCompare(b.item))
      .forEach((entry) => {
        if (!grouped[entry.category]) grouped[entry.category] = [];
        grouped[entry.category].push(entry);
      });

    return grouped;
  }, [selectedRecipes, manualItems]);

  const totalItems = useMemo(() => {
    return Object.values(groceryList).reduce((acc, items) => acc + items.length, 0);
  }, [groceryList]);

  const addManualItem = () => {
    const clean = extraItem.trim();
    if (!clean) return;

    setManualItems((prev) => [
      ...prev,
      { item: clean, qty: 1, unit: 'pz', category: 'Extras' },
    ]);
    setExtraItem('');
  };

  const toggleChecked = (key) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAll = () => {
    setMealPlan({ ...emptyPlan });
    setManualItems([]);
    setCheckedItems({});
    setExtraItem('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Planeador semanal para el mercado
              </h1>
              <p className="mt-2 text-slate-600">
                Elige qué vas a cocinar en la semana y la lista del súper se acomoda sola.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full px-4 py-2 text-sm">{selectedRecipes.length} platillos seleccionados</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">{totalItems} productos en la lista</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <CalendarDays className="h-5 w-5" />
                Menú de la semana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="grid gap-2 rounded-2xl bg-slate-50 p-4 md:grid-cols-[120px_1fr] md:items-center">
                  <div className="font-semibold text-slate-700">{day}</div>
                  <select
                    value={mealPlan[day]}
                    onChange={(e) => setMealPlan((prev) => ({ ...prev, [day]: e.target.value }))}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-700 outline-none focus:border-slate-400"
                  >
                    <option value="">Selecciona un platillo</option>
                    {recipeCatalog.map((recipe) => (
                      <option key={recipe.name} value={recipe.name}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={clearAll} variant="outline" className="rounded-2xl">
                  <Trash2 className="mr-2 h-4 w-4" /> Limpiar semana
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Soup className="h-5 w-5" />
                  Platillos disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {recipeCatalog.map((recipe) => (
                    <div key={recipe.name} className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-semibold text-slate-800">{recipe.name}</div>
                      <div className="mt-2 text-sm text-slate-600">
                        {recipe.ingredients.slice(0, 3).map((i) => i.item).join(', ')}
                        {recipe.ingredients.length > 3 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Plus className="h-5 w-5" />
                  Agregar extra a la lista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Ej. Servilletas, jabón, refresco..."
                    value={extraItem}
                    onChange={(e) => setExtraItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                    className="rounded-2xl"
                  />
                  <Button onClick={addManualItem} className="rounded-2xl">
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <ShoppingCart className="h-5 w-5" />
              Lista organizada para el mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalItems === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
                Aún no has elegido platillos. Selecciona tu menú semanal para generar la lista automáticamente.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(groceryList).map(([category, items]) => (
                  <div key={category} className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="mb-3 text-lg font-bold text-slate-800">{category}</h3>
                    <div className="space-y-3">
                      {items.map((item) => {
                        const itemKey = `${category}-${item.item}-${item.unit}`;
                        const isChecked = !!checkedItems[itemKey];
                        return (
                          <label
                            key={itemKey}
                            className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 shadow-sm"
                          >
                            <Checkbox checked={isChecked} onCheckedChange={() => toggleChecked(itemKey)} />
                            <div className={isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}>
                              <div className="font-medium">{item.item}</div>
                              <div className="text-sm">
                                {item.qty} {item.unit}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
