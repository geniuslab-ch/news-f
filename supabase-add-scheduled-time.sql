-- Fix: Add scheduled_time column to store exact booking time

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS scheduled_time TIME;

COMMENT ON COLUMN sessions.scheduled_time IS 'Exact time of the scheduled session (from Cal.com booking)';

-- Backfill existing sessions with default time (optional)
-- UPDATE sessions SET scheduled_time = '10:00:00' WHERE scheduled_time IS NULL AND status = 'scheduled';
