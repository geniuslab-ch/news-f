-- ULTIMATE FIX - Infinite Recursion in Profiles
-- Execute this ENTIRE script in one go in Supabase SQL Editor

-- ========================================
-- STEP 1: DISABLE RLS COMPLETELY
-- ========================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: DROP EVERY POSSIBLE POLICY
-- ========================================
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
END $$;

-- ========================================
-- STEP 3: RE-ENABLE RLS
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: CREATE MINIMAL POLICIES
-- ========================================

-- Allow authenticated users to SELECT their own row
CREATE POLICY "allow_select_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to UPDATE their own row
CREATE POLICY "allow_update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to INSERT their own row
CREATE POLICY "allow_insert_own_profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ========================================
-- STEP 5: GRANT PERMISSIONS
-- ========================================
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ========================================
-- STEP 6: VERIFY SETUP
-- ========================================
SELECT 
    'Policies on profiles:' as info,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'profiles';

SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test query (should work for authenticated users)
-- SELECT * FROM profiles WHERE id = auth.uid();
