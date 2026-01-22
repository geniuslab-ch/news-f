-- Add reminder_sent column to sessions table if it doesn't exist
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- Add index for faster cron queries
CREATE INDEX IF NOT EXISTS idx_sessions_reminder_pending 
ON sessions(status, reminder_sent, session_date) 
WHERE status = 'scheduled' AND reminder_sent = FALSE;

-- Ensure language column exists in profiles (already should exist from schema)
-- This is just a safety check
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'language'
    ) THEN
        ALTER TABLE profiles ADD COLUMN language VARCHAR(2) DEFAULT 'fr' CHECK (language IN ('fr', 'en'));
    END IF;
END $$;

-- Ensure google_meet_link exists (fallback column names)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sessions' AND column_name = 'google_meet_link'
    ) THEN
        ALTER TABLE sessions ADD COLUMN google_meet_link TEXT;
    END IF;
END $$;

COMMENT ON COLUMN sessions.reminder_sent IS 'Whether the 24h WhatsApp reminder has been sent';
COMMENT ON COLUMN profiles.language IS 'Client language preference for notifications (fr/en)';
