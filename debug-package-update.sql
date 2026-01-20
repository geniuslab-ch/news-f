-- Debug : Vérifier l'état réel du package après création de sessions récurrentes
-- Pour comprendre pourquoi le décompte ne fonctionne pas

-- 1. Voir toutes les sessions de l'utilisateur
SELECT 
    id,
    session_type,
    session_date,
    scheduled_time,
    status,
    created_at
FROM sessions
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
ORDER BY created_at DESC;

-- 2. Voir l'état actuel du package
SELECT 
    id,
    package_type,
    sessions_used,
    sessions_remaining,
    status,
    created_at
FROM packages
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND status = 'active';

-- 3. Compter les sessions par type
SELECT 
    session_type,
    COUNT(*) as count
FROM sessions
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
GROUP BY session_type;

-- 4. Vérifier si les 4 sessions récurrentes existent vraiment
SELECT COUNT(*) as recurring_sessions_count
FROM sessions
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND session_type = 'coaching_followup'
AND status = 'scheduled';

-- Résultats attendus :
-- Si API fonctionne : sessions_remaining = 4, sessions_used = 4, 4 sessions coaching_followup
-- Si API échoue : sessions_remaining = 8, sessions_used = 0, mais 4 sessions quand même créées
