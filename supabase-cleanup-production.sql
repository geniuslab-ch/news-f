-- ⚠️ ATTENTION : Ce script supprime TOUTES les données de test
-- À exécuter UNIQUEMENT avant la mise en production
-- Sauvegarde recommandée avant exécution

-- ============================================
-- NETTOYAGE COMPLET DE LA BASE DE DONNÉES
-- ============================================

BEGIN;

-- 1. Supprimer toutes les sessions
DELETE FROM sessions;

-- 2. Supprimer tous les packages
DELETE FROM packages;

-- 3. Supprimer tous les profils (sauf admin si tu veux garder)
-- Option A : Supprimer TOUS les profils
DELETE FROM profiles;

-- Option B : Garder un profil admin spécifique (décommente et remplace l'email)
-- DELETE FROM profiles WHERE email != 'ton-email-admin@example.com';

-- 4. Supprimer les utilisateurs Supabase Auth
-- ⚠️ IMPORTANT : Ceci doit être fait via le dashboard Supabase
-- Authentication → Users → Sélectionner tous → Delete
-- Ou via API Supabase (nécessite service role key)

-- 5. Reset des sequences (auto-increment) - Optionnel
-- ALTER SEQUENCE sessions_id_seq RESTART WITH 1;
-- ALTER SEQUENCE packages_id_seq RESTART WITH 1;

COMMIT;

-- ============================================
-- VÉRIFICATION POST-NETTOYAGE
-- ============================================

-- Compter les enregistrements restants
SELECT 'sessions' as table_name, COUNT(*) as count FROM sessions
UNION ALL
SELECT 'packages', COUNT(*) FROM packages
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- Résultat attendu : 0 partout (sauf profiles si admin gardé)
