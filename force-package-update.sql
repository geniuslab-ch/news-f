-- FIX CRITIQUE : Mise à jour directe du package
-- Version sans ALTER TABLE (évite le trigger updated_at)

-- Mise à jour directe
UPDATE packages
SET 
    sessions_used = 4,
    sessions_remaining = 4
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- Vérifier le résultat
SELECT 
    package_type,
    sessions_used,
    sessions_remaining,
    status,
    start_date,
    end_date
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- Résultat attendu: sessions_used=4, sessions_remaining=4
