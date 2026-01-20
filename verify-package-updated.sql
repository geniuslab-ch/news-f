-- Vérifier SI le package a vraiment été mis à jour
-- Exécute ça MAINTENANT pour confirmer

SELECT 
    package_type,
    sessions_used,
    sessions_remaining,
    status,
    created_at
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- Si sessions_remaining = 4 → L'API FONCTIONNE ✅
-- Si sessions_remaining = 8 → Politique RLS bloque l'update ❌
