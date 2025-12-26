-- ============================================================================
-- LIFE OS - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Este script crea todas las tablas necesarias para Life OS multiusuario
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query

-- ============================================================================
-- 1. EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. DATOS GLOBALES (Compartidos entre todos los usuarios)
-- ============================================================================

-- Alimentos base
CREATE TABLE IF NOT EXISTS global_foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  serving TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fats DECIMAL NOT NULL,
  fiber DECIMAL DEFAULT 0,
  sugar DECIMAL DEFAULT 0,
  sodium DECIMAL DEFAULT 0,
  barcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejercicios base
CREATE TABLE IF NOT EXISTS global_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías de alimentos
CREATE TABLE IF NOT EXISTS food_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  order_index INTEGER
);

-- ============================================================================
-- 3. DATOS DE USUARIO
-- ============================================================================

-- Perfil de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  goals JSONB DEFAULT '{"calories": 2200, "protein": 180, "carbs": 220, "fats": 70, "water": 8, "sleep": 8, "steps": 10000}'::jsonb,
  mantra TEXT DEFAULT 'Cada día cuenta',
  active_areas TEXT[] DEFAULT ARRAY['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'],
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alimentos personalizados del usuario
CREATE TABLE IF NOT EXISTS user_custom_foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  serving TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fats DECIMAL NOT NULL,
  fiber DECIMAL DEFAULT 0,
  sugar DECIMAL DEFAULT 0,
  sodium DECIMAL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_custom_foods_user_name_unique UNIQUE(user_id, name)
);

-- Ejercicios personalizados del usuario
CREATE TABLE IF NOT EXISTS user_custom_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  instructions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_custom_exercises_user_name_unique UNIQUE(user_id, name)
);

-- Días (registro diario de energía, sueño, etc.)
CREATE TABLE IF NOT EXISTS user_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  sleep_hours DECIMAL,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  water_glasses INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  focus_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_days_user_date_unique UNIQUE(user_id, date)
);

-- Comidas registradas
CREATE TABLE IF NOT EXISTS user_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  meal_type TEXT,
  time TIME,
  food_source TEXT CHECK (food_source IN ('global', 'custom', 'manual')),
  food_id UUID,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_meals_user_date_idx ON user_meals(user_id, date);

-- Entrenamientos
CREATE TABLE IF NOT EXISTS user_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  exercises JSONB,
  is_completed BOOLEAN DEFAULT FALSE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_workouts_user_date_idx ON user_workouts(user_id, date);

-- Hábitos del usuario
CREATE TABLE IF NOT EXISTS user_habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  frequency TEXT DEFAULT 'daily',
  identity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_habits_user_name_unique UNIQUE(user_id, name)
);

-- Logs de hábitos (registro diario)
CREATE TABLE IF NOT EXISTS user_habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES user_habits(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  CONSTRAINT user_habit_logs_unique UNIQUE(user_id, habit_id, date)
);

CREATE INDEX user_habit_logs_user_date_idx ON user_habit_logs(user_id, date);

-- Proyectos de trabajo
CREATE TABLE IF NOT EXISTS user_work_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  description TEXT,
  objective TEXT,
  key_results JSONB,
  deadline DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tareas de trabajo
CREATE TABLE IF NOT EXISTS user_work_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES user_work_projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,
  eisenhower TEXT CHECK (eisenhower IN ('q1', 'q2', 'q3', 'q4')),
  energy TEXT,
  time_estimate INTEGER,
  due_date DATE,
  scheduled_date DATE,
  context TEXT,
  is_deep_work BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'todo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Métricas corporales
CREATE TABLE IF NOT EXISTS user_body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight DECIMAL,
  body_fat_percentage DECIMAL,
  muscle_mass DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_body_metrics_user_date_unique UNIQUE(user_id, date)
);

-- Transacciones financieras
CREATE TABLE IF NOT EXISTS user_finance_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  amount DECIMAL NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relaciones personales
CREATE TABLE IF NOT EXISTS user_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  love_language TEXT,
  contact_frequency TEXT,
  birthday DATE,
  anniversary DATE,
  notes TEXT,
  interests TEXT,
  pending_topics TEXT,
  health_rating INTEGER CHECK (health_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interacciones con relaciones
CREATE TABLE IF NOT EXISTS user_relationship_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship_id UUID REFERENCES user_relationships(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT,
  notes TEXT,
  quality INTEGER CHECK (quality BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal / Consciencia
CREATE TABLE IF NOT EXISTS user_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  gratitude TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas de usuario
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_work_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_work_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_relationship_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para user_custom_foods
CREATE POLICY "Users can view own custom foods" ON user_custom_foods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom foods" ON user_custom_foods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom foods" ON user_custom_foods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom foods" ON user_custom_foods FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_custom_exercises
CREATE POLICY "Users can view own custom exercises" ON user_custom_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom exercises" ON user_custom_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom exercises" ON user_custom_exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom exercises" ON user_custom_exercises FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_days
CREATE POLICY "Users can view own days" ON user_days FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own days" ON user_days FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own days" ON user_days FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own days" ON user_days FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_meals
CREATE POLICY "Users can view own meals" ON user_meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON user_meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON user_meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON user_meals FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_workouts
CREATE POLICY "Users can view own workouts" ON user_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON user_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON user_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON user_workouts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_habits
CREATE POLICY "Users can view own habits" ON user_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON user_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON user_habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON user_habits FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_habit_logs
CREATE POLICY "Users can view own habit logs" ON user_habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON user_habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON user_habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON user_habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_work_projects
CREATE POLICY "Users can view own work projects" ON user_work_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work projects" ON user_work_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work projects" ON user_work_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work projects" ON user_work_projects FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_work_tasks
CREATE POLICY "Users can view own work tasks" ON user_work_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work tasks" ON user_work_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work tasks" ON user_work_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work tasks" ON user_work_tasks FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_body_metrics
CREATE POLICY "Users can view own body metrics" ON user_body_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own body metrics" ON user_body_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own body metrics" ON user_body_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own body metrics" ON user_body_metrics FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_finance_transactions
CREATE POLICY "Users can view own transactions" ON user_finance_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON user_finance_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON user_finance_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON user_finance_transactions FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_relationships
CREATE POLICY "Users can view own relationships" ON user_relationships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own relationships" ON user_relationships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own relationships" ON user_relationships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own relationships" ON user_relationships FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_relationship_interactions
CREATE POLICY "Users can view own interactions" ON user_relationship_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interactions" ON user_relationship_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON user_relationship_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interactions" ON user_relationship_interactions FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_journal_entries
CREATE POLICY "Users can view own journal" ON user_journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON user_journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal" ON user_journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON user_journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Políticas para datos globales (todos pueden leer)
CREATE POLICY "Anyone can view global foods" ON global_foods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view global exercises" ON global_exercises FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view food categories" ON food_categories FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- 5. FUNCIONES Y TRIGGERS
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_days_updated_at BEFORE UPDATE ON user_days FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_foods_updated_at BEFORE UPDATE ON global_foods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_exercises_updated_at BEFORE UPDATE ON global_exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS user_meals_date_idx ON user_meals(date);
CREATE INDEX IF NOT EXISTS user_workouts_date_idx ON user_workouts(date);
CREATE INDEX IF NOT EXISTS user_habit_logs_date_idx ON user_habit_logs(date);
CREATE INDEX IF NOT EXISTS user_days_date_idx ON user_days(date);
CREATE INDEX IF NOT EXISTS global_foods_category_idx ON global_foods(category);
CREATE INDEX IF NOT EXISTS global_exercises_muscle_group_idx ON global_exercises(muscle_group);

-- ============================================================================
-- FIN DEL ESQUEMA
-- ============================================================================
