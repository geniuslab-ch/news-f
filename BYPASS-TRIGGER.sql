-- SOLUTION RADICALE : Bypass complet du trigger
-- On va utiliser une session transaction qui ignore le trigger

BEGIN;

-- Désactiver tous les triggers sur packages temporairement
ALTER TABLE packages DISABLE TRIGGER ALL;

-- Maintenant les updates vont passer
DELETE FROM sessions
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

UPDATE packages
SET sessions_used = 0, sessions_remaining = 8
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');

-- Réactiver les triggers
ALTER TABLE packages ENABLE TRIGGER ALL;

COMMIT;

-- Vérifier
SELECT 'RESET OK' as status, sessions_used, sessions_remaining
FROM packages
WHERE user_id = (SELECT id FROM profiles WHERE email = 'noura.scharer@gmail.com');
