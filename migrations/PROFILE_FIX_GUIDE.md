# Guide de Correction - Problème de Sauvegarde du Profil

## Problème
Les modifications du profil (nom, prénom, téléphone) ne sont pas sauvegardées dans la page des paramètres.

## Cause Probable
Les politiques RLS (Row Level Security) sur la table `profiles` empêchent les utilisateurs de mettre à jour leurs propres données.

## Solution

### Étape 1: Exécuter le SQL dans Supabase

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `migrations/fix_profiles_rls.sql`
5. Cliquer sur **Run**

### Étape 2: Vérifier les Logs

Après le déploiement du code mis à jour:
1. Ouvrir la console du navigateur (F12)
2. Aller dans la page Settings
3. Modifier vos informations
4. Cliquer sur "Sauvegarder"
5. Vérifier les logs dans la console:
   - `💾 Saving profile for user:` - Début de la sauvegarde
   - `📝 Data to save:` - Données à sauvegarder
   - `✅ Update successful:` - Mise à jour réussie
   - `🔍 Verification:` - Vérification des données

### Logs d'Erreur Possibles

Si vous voyez `❌ Update error:` dans les logs, notez le message d'erreur exact et partagez-le.

**Erreurs courantes**:
- `new row violates row-level security policy` → Les RLS policies ne sont pas correctes
- `permission denied` → Problèmes de permissions
- `column does not exist` → Problème de schéma de base de données

## Vérification Manuelle

Vous pouvez vérifier manuellement dans Supabase:

```sql
-- Voir votre profil
SELECT * FROM profiles WHERE id = auth.uid();

-- Tester manuellement la mise à jour
UPDATE profiles 
SET first_name = 'Test', last_name = 'User', phone = '+41 79 123 45 67'
WHERE id = auth.uid();
```

Si la mise à jour manuelle fonctionne, le problème vient du code frontend.
Si elle échoue, le problème vient des RLS policies.

## Support

Si le problème persiste après avoir exécuté le script SQL, vérifiez:
1. Les logs de la console navigateur
2. Les erreurs dans Supabase Logs
3. Les RLS policies dans Supabase → Authentication → Policies
