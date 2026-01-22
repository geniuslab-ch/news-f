-- Remove default role from profiles table
-- This ensures new Google OAuth users have NULL role and must choose

ALTER TABLE profiles 
ALTER COLUMN role DROP DEFAULT;

-- Update existing Google OAuth users to have NULL role if you want to force them to choose
-- (Optional - uncomment if you want existing Google users to choose their role)
-- UPDATE profiles 
-- SET role = NULL 
-- WHERE id IN (
--     SELECT id FROM auth.users 
--     WHERE raw_app_meta_data->>'provider' = 'google'
-- ) AND role = 'client';

COMMENT ON COLUMN profiles.role IS 'User role: admin, coach, or client. NULL for new users who must choose.';
