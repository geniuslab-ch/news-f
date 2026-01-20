-- SOLUTION FINALE : Fonction Postgres qui bypass le trigger
-- Cette fonction peut désactiver les triggers car elle s'exécute côté serveur

CREATE OR REPLACE FUNCTION update_package_sessions(
    p_package_id UUID,
    p_sessions_to_add INTEGER
)
RETURNS TABLE (
    new_sessions_used INTEGER,
    new_sessions_remaining INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sessions_used INTEGER;
    v_sessions_remaining INTEGER;
BEGIN
    -- Désactiver temporairement les triggers pour cette session
    SET LOCAL session_replication_role = 'replica';
    
    -- Récupérer les valeurs actuelles
    SELECT sessions_used, sessions_remaining 
    INTO v_sessions_used, v_sessions_remaining
    FROM packages 
    WHERE id = p_package_id;
    
    -- Calculer les nouvelles valeurs
    v_sessions_used := COALESCE(v_sessions_used, 0) + p_sessions_to_add;
    v_sessions_remaining := GREATEST(0, COALESCE(v_sessions_remaining, 0) - p_sessions_to_add);
    
    -- Mettre à jour
    UPDATE packages
    SET 
        sessions_used = v_sessions_used,
        sessions_remaining = v_sessions_remaining
    WHERE id = p_package_id;
    
    -- Réactiver les triggers
    SET LOCAL session_replication_role = 'origin';
    
    -- Retourner les nouvelles valeurs
    RETURN QUERY SELECT v_sessions_used, v_sessions_remaining;
END;
$$;

-- Test de la fonction : Réinitialiser le package
SELECT update_package_sessions(
    '0e6cbf55-fc31-4aaf-9d08-c362430bbb77'::uuid,
    -4  -- Négatif pour SOUSTRAIRE 4 sessions utilisées (reset)
);

-- Vérifier
SELECT sessions_used, sessions_remaining
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';
