-- DIAGNOSTIC FINAL - Trouver le vrai problème

-- 1. Vérifier si le profil existe SANS filtre email
SELECT 
    id,
    email,
    first_name,
    phone,
    language,
    role
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 2. Trouver votre user_id depuis la session
SELECT 
    id,
    user_id,
    session_date,
    scheduled_time,
    status,
    reminder_sent,
    google_meet_link,
    meeting_link
FROM sessions
WHERE session_date = '2026-02-06'
  AND scheduled_time = '07:30:00';

-- 3. Récupérer le profil avec ce user_id (remplacez USER_ID_ICI)
-- PREMIÈRE ÉTAPE: Exécutez query 2, notez le user_id, puis remplacez ci-dessous
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    language
FROM profiles
WHERE id = 'REMPLACER_PAR_USER_ID_DE_QUERY_2';

-- 4. Test du cron - exactement ce qu'il voit
SELECT 
    s.id as session_id,
    s.session_date,
    s.scheduled_time,
    s.status,
    s.reminder_sent,
    s.google_meet_link,
    s.user_id,
    p.id as profile_id,
    p.first_name,
    p.phone,
    p.language
FROM sessions s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'scheduled'
  AND s.reminder_sent = false
  AND s.session_date >= CURRENT_DATE;

-- 5. Vérifier RLS sur profiles
SHOW search_path;
SELECT current_user;
