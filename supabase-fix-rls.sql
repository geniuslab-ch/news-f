-- FIX RLS POLICIES - Corriger les erreurs 406
-- Exécute ce SQL dans Supabase SQL Editor

-- 1. Activer RLS sur toutes les tables (si pas déjà fait)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own packages" ON public.packages;
DROP POLICY IF EXISTS "Users can update own packages" ON public.packages;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.sessions;

-- 3. PROFILES - Nouvelles policies
CREATE POLICY "Enable read access for users to own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for users to own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. PACKAGES - Nouvelles policies  
CREATE POLICY "Enable read access for users to own packages"
  ON public.packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users to own packages"
  ON public.packages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users to own packages"
  ON public.packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. SESSIONS - Nouvelles policies
CREATE POLICY "Enable read access for users to own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users to own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users to own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully!';
  RAISE NOTICE 'Error 406 should now be fixed.';
END $$;
