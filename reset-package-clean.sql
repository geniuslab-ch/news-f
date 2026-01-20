-- SOLUTION ULTIME SIMPLIFIÉE
-- Fix le package MAINTENANT sans trigger issues

-- 1. État actuel du package
SELECT 
    'AVANT UPDATE' as status,
    package_type,
    sessions_used,
    sessions_remaining
FROM packages
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND status = 'active';

-- 2. RESET complet : Supprimer toutes les sessions de test
DELETE FROM sessions
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND session_type = 'coaching_followup';

-- 3. Mettre le package à ZÉRO sessions utilisées
UPDATE packages
SET 
    sessions_used = 0,
    sessions_remaining = 8
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND status = 'active';

-- 4. Vérification finale
SELECT 
    'APRÈS RESET' as status,
    package_type,
    sessions_used,
    sessions_remaining
FROM packages
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com')
AND status = 'active';

-- 5. Compter les sessions restantes
SELECT COUNT(*) as sessions_restantes
FROM sessions
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- RÉSULTAT ATTENDU: sessions_used=0, sessions_remaining=8, 0 sessions
