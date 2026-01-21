-- Script SQL pour configurer le rôle Admin
-- Exécuter dans Supabase SQL Editor

-- 1. S'assurer que le rôle admin est autorisé dans profiles
-- (Le check contraint devrait déjà permettre 'admin', sinon ajuster)

-- 2. Mettre à jour contact@fitbuddy.ch en admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'contact@fitbuddy.ch';

-- Si le compte n'existe pas encore, créez-le d'abord dans Auth puis :
-- INSERT INTO profiles (id, email, role, first_name, last_name)
-- VALUES ('UUID_DU_USER_AUTH', 'contact@fitbuddy.ch', 'admin', 'Admin', 'Fitbuddy');

-- 3. Vérifier que les RLS policies permettent à l'admin de tout voir
-- Drop existing policies if they exist, then recreate

-- Pour profiles : admin peut voir tous les profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Pour sessions : admin peut voir toutes les sessions
DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
CREATE POLICY "Admins can view all sessions"
ON sessions FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Pour packages : admin peut voir tous les packages
DROP POLICY IF EXISTS "Admins can view all packages" ON packages;
CREATE POLICY "Admins can view all packages"
ON packages FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Pour whatsapp : admin peut voir toutes les conversations
DROP POLICY IF EXISTS "Admins can view all conversations" ON whatsapp_conversations;
CREATE POLICY "Admins can view all conversations"
ON whatsapp_conversations FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can view all messages" ON whatsapp_messages;
CREATE POLICY "Admins can view all messages"
ON whatsapp_messages FOR SELECT
TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM whatsapp_conversations
    )
    AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Vérification
SELECT id, email, role, first_name, last_name
FROM profiles
WHERE email = 'contact@fitbuddy.ch';
