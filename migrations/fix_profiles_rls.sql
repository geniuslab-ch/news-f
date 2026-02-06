-- Fix Infinite Recursion in Profiles RLS Policies
-- This script removes problematic policies and creates simple, non-recursive ones

-- STEP 1: Disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- STEP 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create SIMPLE policies without recursion

-- Allow users to SELECT their own profile
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Allow users to UPDATE their own profile
CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to INSERT their own profile (for new signups)
CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- STEP 5: Grant necessary permissions
GRANT SELECT, UPDATE, INSERT ON profiles TO authenticated;

-- STEP 6: Verify the policies
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN pg_get_expr(qual, 'profiles'::regclass)
        ELSE 'no condition'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN pg_get_expr(with_check, 'profiles'::regclass)
        ELSE 'no condition'
    END as with_check_clause
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
