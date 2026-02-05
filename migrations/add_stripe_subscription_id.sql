-- ========================================
-- SQL pour ajouter stripe_subscription_id
-- ========================================

-- 1. Ajouter la colonne si elle n'existe pas
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- 2. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_packages_stripe_subscription_id 
ON packages(stripe_subscription_id);

-- 3. Vérifier les packages existants
SELECT 
    id,
    user_id,
    package_type,
    status,
    stripe_payment_intent,
    stripe_subscription_id,
    created_at
FROM packages
WHERE status = 'active'
ORDER BY created_at DESC;

-- 4. Pour voir combien de packages n'ont pas de subscription_id
SELECT 
    COUNT(*) as total_packages,
    COUNT(stripe_subscription_id) as with_subscription_id,
    COUNT(*) - COUNT(stripe_subscription_id) as missing_subscription_id
FROM packages
WHERE status = 'active';
