-- =============================================
-- FITBUDDY - SUPABASE DATABASE SCHEMA
-- =============================================
-- Exécuter ce script dans Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Coller et Run

-- =============================================
-- 1. TABLE: PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- =============================================
-- 2. TABLE: PACKAGES (Forfaits)
-- =============================================
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  package_type TEXT NOT NULL CHECK (package_type IN ('1month', '3months', '6months', '12months')),
  total_sessions INT NOT NULL,
  sessions_used INT DEFAULT 0,
  sessions_remaining INT GENERATED ALWAYS AS (total_sessions - sessions_used) STORED,
  price_chf DECIMAL(10,2) NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches fréquentes
CREATE INDEX IF NOT EXISTS packages_user_id_idx ON public.packages(user_id);
CREATE INDEX IF NOT EXISTS packages_status_idx ON public.packages(status);
CREATE INDEX IF NOT EXISTS packages_stripe_sub_idx ON public.packages(stripe_subscription_id);

-- =============================================
-- 3. TABLE: SESSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages ON DELETE SET NULL,
  coach_name TEXT,
  session_type TEXT NOT NULL CHECK (session_type IN ('discovery', 'coaching')),
  session_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INT DEFAULT 45 CHECK (duration_minutes IN (15, 45, 60)),
  google_meet_link TEXT,
  cal_com_booking_id TEXT UNIQUE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches fréquentes
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_package_id_idx ON public.sessions(package_id);
CREATE INDEX IF NOT EXISTS sessions_date_idx ON public.sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS sessions_status_idx ON public.sessions(status);
CREATE INDEX IF NOT EXISTS sessions_cal_com_idx ON public.sessions(cal_com_booking_id);

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PACKAGES POLICIES
CREATE POLICY "Users can view own packages"
  ON public.packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own packages"
  ON public.packages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- SESSIONS POLICIES
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND 
    status IN ('cancelled', 'rescheduled')
  );

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. FUNCTIONS & TRIGGERS
-- =============================================

-- Function: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Execute handle_new_user after user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_packages ON public.packages;
CREATE TRIGGER set_updated_at_packages
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_sessions ON public.sessions;
CREATE TRIGGER set_updated_at_sessions
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 6. HELPER FUNCTIONS
-- =============================================

-- Function: Get active package for a user
CREATE OR REPLACE FUNCTION public.get_active_package(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  package_type TEXT,
  sessions_remaining INT,
  end_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.package_type, p.sessions_remaining, p.end_date
  FROM public.packages p
  WHERE p.user_id = user_uuid
    AND p.status = 'active'
    AND p.end_date >= CURRENT_DATE
  ORDER BY p.end_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get upcoming sessions for a user
CREATE OR REPLACE FUNCTION public.get_upcoming_sessions(user_uuid UUID, limit_count INT DEFAULT 5)
RETURNS TABLE (
  id UUID,
  session_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INT,
  coach_name TEXT,
  google_meet_link TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.session_date, s.duration_minutes, s.coach_name, s.google_meet_link, s.status
  FROM public.sessions s
  WHERE s.user_id = user_uuid
    AND s.session_date >= NOW()
    AND s.status IN ('scheduled', 'rescheduled')
  ORDER BY s.session_date ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. INITIAL DATA (Optional - pour tests)
-- =============================================

-- Vous pouvez ajouter des données de test ici si besoin

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Tables: profiles, packages, sessions';
  RAISE NOTICE 'RLS policies: Enabled';
  RAISE NOTICE 'Triggers: Auto-profile creation, updated_at';
  RAISE NOTICE 'Ready for use!';
END $$;
