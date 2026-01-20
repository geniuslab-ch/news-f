-- FIX: Reset le package à 0 utilisées, 8 disponibles
SELECT update_package_sessions(
    '0e6cbf55-fc31-4aaf-9d08-c362430bbb77'::uuid,
    -4  -- Va corriger: -4 utilisées → 0 utilisées
);

-- Ensuite reset sessions_remaining manuellement
UPDATE packages
SET sessions_remaining = 8
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- Vérifier
SELECT sessions_used, sessions_remaining
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';
