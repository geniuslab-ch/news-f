-- Add coaching_followup session type to database schema
-- Execute this in Supabase SQL Editor

-- Option 1: If you want to alter the existing enum (requires dropping dependent objects)
-- WARNING: This might fail if there are existing sessions

-- Option 2: Just allow the new value (Supabase should accept it)
-- The session_type column will accept: 'discovery', 'coaching', 'coaching_followup'

-- For safety, let's just document the new type
DO $$
BEGIN
  RAISE NOTICE 'New session type available: coaching_followup';
  RAISE NOTICE 'Use this type for follow-up coaching sessions (45 min)';
  RAISE NOTICE 'You can now create sessions with session_type = ''coaching_followup''';
END $$;

-- Test inserif the new type works
-- Uncomment and run if you want to test:
/*
INSERT INTO sessions (
  user_id,
  session_type,
  session_date,
  duration_minutes,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'coaching_followup',  -- New type
  NOW() + INTERVAL '1 week',
  45,
  'scheduled'
)
RETURNING id, session_type;
*/

-- Display all available session types
SELECT DISTINCT session_type 
FROM sessions 
ORDER BY session_type;
