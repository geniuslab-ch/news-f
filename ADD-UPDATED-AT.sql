-- VRAIE SOLUTION : Ajouter les colonnes updated_at que le trigger cherche
-- Plus simple que de bypasser le trigger !

-- 1. Ajouter updated_at à packages
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Ajouter updated_at à profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Mettre à jour les valeurs existantes
UPDATE packages SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE profiles SET updated_at = created_at WHERE updated_at IS NULL;

-- 4. Vérifier que le trigger fonctionne maintenant
SELECT 
    'Test trigger sur packages' as test,
    sessions_used, 
    sessions_remaining,
    updated_at
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- 5. Test : Mettre à jour le package (devrait fonctionner maintenant)
UPDATE packages
SET sessions_used = 0, sessions_remaining = 8
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';

-- 6. Vérifier que updated_at a été modifié automatiquement par le trigger
SELECT 
    'Après update - trigger OK ?' as test,
    sessions_used,
    sessions_remaining,
    updated_at
FROM packages
WHERE id = '0e6cbf55-fc31-4aaf-9d08-c362430bbb77';
