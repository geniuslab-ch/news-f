-- Phase 5: Add Cal.com integration columns

-- Add calcom_booking_id to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS calcom_booking_id TEXT UNIQUE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_sessions_calcom_booking_id 
ON sessions(calcom_booking_id) WHERE calcom_booking_id IS NOT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_status 
ON sessions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_sessions_package_id 
ON sessions(package_id);

-- Add meeting_link if not exists
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS meeting_link TEXT;

COMMENT ON COLUMN sessions.calcom_booking_id IS 'Cal.com booking UID for webhook sync';
COMMENT ON COLUMN sessions.meeting_link IS 'Video call link (Google Meet, Zoom, etc)';
