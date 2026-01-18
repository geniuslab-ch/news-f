-- VÉRIFICATION ET CORRECTION DU SCHÉMA
-- Exécute ce script d'abord pour vérifier la structure de la table

-- 1. Voir la structure actuelle de la table packages
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'packages'
ORDER BY ordinal_position;

-- 2. Si la colonne price_chf n'existe pas, l'ajouter
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'packages' 
    AND column_name = 'price_chf'
  ) THEN
    ALTER TABLE packages ADD COLUMN price_chf DECIMAL(10,2);
    RAISE NOTICE 'Column price_chf added successfully!';
  ELSE
    RAISE NOTICE 'Column price_chf already exists!';
  END IF;
END $$;

-- 3. Vérifier à nouveau la structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'packages'
ORDER BY ordinal_position;
