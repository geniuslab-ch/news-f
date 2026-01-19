-- Fix RLS UPDATE policy for sessions table
-- This allows users to update (cancel) their own sessions

-- Drop existing UPDATE policy if any
DROP POLICY IF EXISTS "Enable update for users to own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;

-- Create new UPDATE policy that allows users to cancel their sessions
CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'sessions' AND cmd = 'UPDATE';

-- Test the policy with a sample update (don't run this, just for reference)
/*
UPDATE sessions 
SET status = 'cancelled'
WHERE id = 'YOUR_SESSION_ID'
AND user_id = auth.uid();
*/

DO $$
BEGIN
  RAISE NOTICE 'RLS UPDATE policy created for sessions table';
  RAISE NOTICE 'Users can now cancel their own sessions';
END $$;
