-- APRÈS RESET : Créer 4 sessions manuellement pour tester
-- Exécute ça APRÈS reset-package-clean.sql

-- Créer 4 sessions de test
INSERT INTO sessions (
    user_id,
    package_id,
    session_type,
    session_date,
    scheduled_time,
    duration_minutes,
    status
)
SELECT 
    (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'),
    packages.id,
    'coaching_followup',
    CURRENT_DATE + (n || ' days')::interval,
    '10:00:00',
    45,
    'scheduled'
FROM packages,
     generate_series(1, 4) as n
WHERE packages.user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND packages.status = 'active'
LIMIT 4;

-- Mettre à jour le package MANUELLEMENT
UPDATE packages
SET 
    sessions_used = 4,
    sessions_remaining = 4
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND status = 'active';

-- Vérifier
SELECT 
    package_type,
    sessions_used,
    sessions_remaining,
    (SELECT COUNT(*) FROM sessions WHERE package_id = packages.id) as sessions_count
FROM packages
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND status = 'active';
