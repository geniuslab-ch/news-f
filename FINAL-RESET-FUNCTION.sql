-- FONCTION AMÉLIORÉE : Reset complet du package
-- Accepte les valeurs exactes au lieu de delta

CREATE OR REPLACE FUNCTION reset_package_sessions(
    p_package_id UUID,
    p_sessions_used INTEGER DEFAULT 0,
    p_sessions_remaining INTEGER DEFAULT 8
)
RETURNS TABLE (
    sessions_used INTEGER,
    sessions_remaining INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Désactiver temporairement les triggers
    SET LOCAL session_replication_role = 'replica';
    
    -- Mettre à jour avec les valeurs exactes
    UPDATE packages
    SET 
        sessions_used = p_sessions_used,
        sessions_remaining = p_sessions_remaining
    WHERE id = p_package_id;
    
    -- Réactiver les triggers
    SET LOCAL session_replication_role = 'origin';
    
    -- Retourner les nouvelles valeurs
    RETURN QUERY 
    SELECT p_sessions_used, p_sessions_remaining;
END;
$$;

-- Test: Reset le package à 0 utilisées, 8 disponibles
SELECT * FROM reset_package_sessions(
    '0e6cbf55-fc31-4aaf-9d08-c362430bbb77'::uuid,
    0,  -- sessions_used
    8   -- sessions_remaining
);

-- Vérifier
SELECT sessions_used, sessions_remaining
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';
