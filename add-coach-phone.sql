-- Ajouter le numéro WhatsApp du coach Mirado
-- Version corrigée (sans column 'role' qui n'existe pas)

UPDATE profiles
SET 
    phone = '+33786372553',  -- France: +33 + numéro sans le 0
    first_name = 'Mirado'
WHERE email = 'noura.scharer@gmail.com';  -- ⬅️ REMPLACE si Mirado a un email différent

-- Vérification:
SELECT 
    email,
    first_name,
    last_name,
    phone
FROM profiles
WHERE phone = '+33786372553';
