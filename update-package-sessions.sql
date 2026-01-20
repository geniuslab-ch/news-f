-- Mettre à jour manuellement les sessions du package
-- Pour simuler une réservation et décrémenter les sessions

-- 1. Voir l'état actuel du package
SELECT 
    id,
    package_type,
    sessions_used,
    sessions_remaining,
    status
FROM packages
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND status = 'active';

-- 2. Décrémenter sessions_remaining et incrémenter sessions_used
-- (Simule une réservation - SANS updated_at car la colonne n'existe pas)
UPDATE packages
SET 
    sessions_used = sessions_used + 1,
    sessions_remaining = GREATEST(0, sessions_remaining - 1)
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND status = 'active';

-- 3. Vérifier le résultat
SELECT 
    package_type,
    sessions_used,
    sessions_remaining,
    status,
    start_date,
    end_date
FROM packages
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com'
)
AND status = 'active';
