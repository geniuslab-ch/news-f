-- VÉRIFICATION RAPIDE : Est-ce que le SQL a été exécuté ?
-- Exécute ça pour voir l'état actuel

-- 1. Vérifier si le trigger existe encore
SELECT 
    trigger_name, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%updated_at%';

-- 2. Vérifier l'état du package MAINTENANT
SELECT 
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

-- 3. Compter les sessions récurrentes créées
SELECT COUNT(*) as total_recurring_sessions
FROM sessions
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND session_type = 'coaching_followup';

-- Si trigger existe → SQL PAS EXÉCUTÉ
-- Si sessions_remaining = 8 → Package PAS MIS À JOUR
