# Migration Guide: Stripe Subscription IDs

## Problème

Les packages existants n'ont pas de `stripe_subscription_id`, donc le bouton "Gérer mon abonnement" ne s'affiche pas pour eux.

## Solution en 3 étapes

### Étape 1: Ajouter la colonne dans Supabase ✅

Allez dans **Supabase** > **SQL Editor** et exécutez ce SQL:

```sql
-- Ajouter la colonne si elle n'existe pas
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_packages_stripe_subscription_id 
ON packages(stripe_subscription_id);
```

### Étape 2: Vérifier les packages existants

Toujours dans SQL Editor:

```sql
-- Voir combien de packages n'ont pas de subscription_id
SELECT 
    COUNT(*) as total_packages,
    COUNT(stripe_subscription_id) as with_subscription_id,
    COUNT(*) - COUNT(stripe_subscription_id) as missing_subscription_id
FROM packages
WHERE status = 'active';
```

### Étape 3: Migrer les données (OPTIONNEL)

**Option A: Script automatique** (recommandé)

```bash
# Installer les dépendances si nécessaire
cd /Users/nourascharer/Desktop/Fitbuddy-Anti/news-f
npm install stripe @supabase/supabase-js

# Exécuter la migration
node scripts/migrate-subscription-ids.js
```

Le script va:
1. ✅ Récupérer tous les packages sans `stripe_subscription_id`
2. ✅ Pour chaque package, trouver le customer Stripe via l'email
3. ✅ Récupérer la subscription active du customer
4. ✅ Mettre à jour le package avec le subscription ID

**Option B: Mise à jour manuelle SQL**

Si vous connaissez le `subscription_id` d'un package spécifique:

```sql
UPDATE packages 
SET stripe_subscription_id = 'sub_XXXXXXXXXX' 
WHERE id = 'PACKAGE_UUID';
```

## Résultat

Une fois la colonne ajoutée et (optionnellement) les données migrées:

✅ Le bouton "⚙️ Gérer mon abonnement" apparaîtra sur le dashboard
✅ Les clients pourront accéder au portail Stripe
✅ Annulation, changement de carte, factures accessibles

## Pour les NOUVEAUX packages

Pas besoin de migration ! Le webhook corrigé ajoute automatiquement le `stripe_subscription_id` lors de la création.

## Fichiers créés

| Fichier | Description |
|---------|-------------|
| [migrations/add_stripe_subscription_id.sql](file:///Users/nourascharer/Desktop/Fitbuddy-Anti/news-f/migrations/add_stripe_subscription_id.sql) | SQL pour ajouter la colonne |
| [scripts/migrate-subscription-ids.js](file:///Users/nourascharer/Desktop/Fitbuddy-Anti/news-f/scripts/migrate-subscription-ids.js) | Script Node.js de migration |

## Notes importantes

> [!WARNING]
> Le script de migration suppose qu'il n'y a qu'une subscription active par customer. Si un customer a plusieurs subscriptions, il prendra la première.

> [!TIP]
> Vous pouvez tester la migration d'abord sur un seul package en modifiant le script pour ajouter une clause `LIMIT 1` dans la requête Supabase.
