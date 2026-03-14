/*
  # Schema para Planeador Semanal de Mercado

  1. Nuevas Tablas
    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `day_of_week` (text) - día de la semana
      - `recipe_name` (text) - nombre del platillo
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `extra_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `item_name` (text) - nombre del producto extra
      - `quantity` (numeric, default 1)
      - `unit` (text, default 'pz')
      - `created_at` (timestamptz)
    
    - `grocery_checklist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `item_name` (text)
      - `is_checked` (boolean, default false)
      - `category` (text)
      - `created_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Las políticas permiten que los usuarios solo accedan a sus propios datos
*/

-- Tabla de planes de comida
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week text NOT NULL,
  recipe_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_of_week)
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal plans"
  ON meal_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON meal_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON meal_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tabla de items extras
CREATE TABLE IF NOT EXISTS extra_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity numeric DEFAULT 1,
  unit text DEFAULT 'pz',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE extra_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own extra items"
  ON extra_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own extra items"
  ON extra_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own extra items"
  ON extra_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own extra items"
  ON extra_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tabla de checklist del mercado
CREATE TABLE IF NOT EXISTS grocery_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  is_checked boolean DEFAULT false,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grocery_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own grocery checklist"
  ON grocery_checklist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own grocery checklist"
  ON grocery_checklist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own grocery checklist"
  ON grocery_checklist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own grocery checklist"
  ON grocery_checklist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS extra_items_user_id_idx ON extra_items(user_id);
CREATE INDEX IF NOT EXISTS grocery_checklist_user_id_idx ON grocery_checklist(user_id);