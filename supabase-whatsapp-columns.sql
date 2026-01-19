-- Add WhatsApp reminder tracking

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

COMMENT ON COLUMN sessions.reminder_sent IS 'Whether WhatsApp reminder was sent for this session';
COMMENT ON COLUMN profiles.phone IS 'Format international avec +: +41791234567';

-- Index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_sessions_reminder_pending 
ON sessions(status, reminder_sent, session_date) 
WHERE status = 'scheduled' AND reminder_sent = false;
