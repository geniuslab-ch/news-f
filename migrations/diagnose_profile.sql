-- DIAGNOSTIC: Check Profile Existence and RLS
-- Execute this to diagnose the profile save issue

-- 1. Check if your profile row exists
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    role,
    created_at
FROM profiles 
WHERE id = auth.uid();

-- 2. Check total count of profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- 3. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. List all RLS policies
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 5. Try to manually create your profile if missing
INSERT INTO profiles (id, email, role, created_at)
VALUES (
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    'client',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 6. Verify again
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    role
FROM profiles 
WHERE id = auth.uid();
