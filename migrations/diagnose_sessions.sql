-- Diagnostic: Vérifier pourquoi aucune session n'est trouvée pour les rappels
-- Exécutez ce SQL dans Supabase SQL Editor

-- 1. Vérifier TOUTES les sessions pour votre email
SELECT 
    s.id,
    s.session_date,
    s.scheduled_time,
    s.status,
    s.reminder_sent,
    s.meeting_link,
    s.google_meet_link,
    s.user_id,
    p.email,
    p.first_name,
    p.phone
FROM sessions s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE p.email = 'noura.scharer@gmail.com'
ORDER BY s.session_date DESC, s.scheduled_time DESC;

-- 2. Vérifier sessions d'AUJOURD'HUI spécifiquement
SELECT 
    s.*,
    p.email,
    p.phone
FROM sessions s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE s.session_date = '2026-02-06'
ORDER BY s.scheduled_time;

-- 3. Vérifier ce que le CRON voit exactement
-- (mêmes critères que le cron job)
SELECT 
    s.*,
    p.first_name,
    p.phone,
    p.language
FROM sessions s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'scheduled'
  AND s.reminder_sent = false
  AND s.session_date >= CURRENT_DATE;

-- 4. Compter les sessions par status
SELECT 
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN reminder_sent THEN 1 END) as reminders_sent,
    COUNT(CASE WHEN NOT reminder_sent THEN 1 END) as pending_reminders
FROM sessions
WHERE session_date >= CURRENT_DATE
GROUP BY status;

-- 5. Vérifier si le profil a un phone
SELECT 
    id,
    email,
    first_name,
    phone,
    language
FROM profiles
WHERE email = 'noura.scharer@gmail.com';

-- 6. Si AUCUNE session n'existe, vérifiez les metadata Cal.com
SELECT 
    id,
    created_at,
    metadata
FROM sessions
WHERE user_id IN (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
ORDER BY created_at DESC
LIMIT 5;

-- ========================================
-- CORRECTIONS POSSIBLES
-- ========================================

-- Si reminder_sent = true, réinitialiser:
-- UPDATE sessions 
-- SET reminder_sent = false
-- WHERE session_date = '2026-02-06' AND user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- Si status n'est pas 'scheduled':
-- UPDATE sessions
-- SET status = 'scheduled'
-- WHERE session_date = '2026-02-06' AND user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- Créer une session test MANUELLEMENT si besoin:
-- INSERT INTO sessions (user_id, session_date, scheduled_time, status, reminder_sent, google_meet_link)
-- VALUES (
--     (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'),
--     '2026-02-06',
--     '08:30:00',
--     'scheduled',
--     false,
--     'https://meet.google.com/xxx-xxxx-xxx'
-- );
