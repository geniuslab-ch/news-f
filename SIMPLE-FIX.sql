-- STEP 1: Supprimer toutes les sessions de test
DELETE FROM sessions
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- STEP 2: Remettre le package à 8 sessions disponibles
UPDATE packages
SET sessions_used = 0, sessions_remaining = 8
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- STEP 3: Vérifier
SELECT 'RESET COMPLET' as status, sessions_used, sessions_remaining
FROM packages
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');
