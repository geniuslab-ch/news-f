-- Activer utilisateur noura.scharer@gmail.com
-- Programme: Déclic Durable
-- Forfait: 1 mois (8 sessions)

-- 1. Vérifier que l'utilisateur existe
SELECT id, email, first_name, last_name 
FROM profiles 
WHERE email = 'noura.scharer@gmail.com';

-- 2. Créer le package actif (VERSION MINIMALE - colonnes essentielles uniquement)
INSERT INTO packages (
    user_id,
    package_type,
    sessions_remaining,
    sessions_used,
    status,
    start_date,
    end_date
)
SELECT 
    id,                                    -- user_id
    '1month',                              -- package_type
    8,                                     -- sessions_remaining
    0,                                     -- sessions_used
    'active',                              -- status
    CURRENT_DATE,                          -- start_date
    CURRENT_DATE + INTERVAL '30 days'     -- end_date
FROM profiles 
WHERE email = 'noura.scharer@gmail.com';

-- 3. Vérifier le package créé
SELECT 
    p.email,
    pkg.package_type,
    pkg.sessions_remaining,
    pkg.sessions_used,
    pkg.status,
    pkg.start_date,
    pkg.end_date
FROM packages pkg
JOIN profiles p ON pkg.user_id = p.id
WHERE p.email = 'noura.scharer@gmail.com'
ORDER BY pkg.created_at DESC
LIMIT 1;
