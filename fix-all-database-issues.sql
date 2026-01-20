-- SOLUTION ULTIME : Supprimer la fonction qui cause le problème
-- Le trigger appelle handle_updated_at() qui n'existe plus ou est cassé

-- 1. Supprimer la fonction handle_updated_at complètement
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;

-- 2. Mettre à jour le package
UPDATE packages
SET 
    sessions_used = 4,
    sessions_remaining = 4
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- 3. Mettre à jour le profil coach
UPDATE profiles
SET 
    phone = '+41786372553',
    first_name = 'Mirado'
WHERE email = 'noura.scharer@gmail.com';

-- 4. Vérifications
SELECT 'PACKAGE UPDATE:' as message, package_type, sessions_used, sessions_remaining
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77'

UNION ALL

SELECT 'COACH UPDATE:' as message, email, phone, first_name
FROM profiles
WHERE phone = '+41786372553';
