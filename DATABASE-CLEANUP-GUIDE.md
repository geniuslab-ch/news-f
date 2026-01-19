# Nettoyage Base de Données Production

## ⚠️ ATTENTION

Ce script **supprime TOUTES les données** de test. À utiliser **uniquement** avant la mise en production finale.

---

## 📋 Étapes de Nettoyage

### 1. Sauvegarder (Optionnel mais recommandé)

Dans Supabase Dashboard :
1. **Database** → **Backups**
2. **Create backup** (si disponible)

### 2. Exécuter le Script SQL

1. **Supabase Dashboard** → **SQL Editor**
2. Copie le contenu de `supabase-cleanup-production.sql`
3. **Run**

Le script supprime :
- ✅ Toutes les sessions
- ✅ Tous les packages
- ✅ Tous les profils (avec option de garder un admin)

### 3. Supprimer les Utilisateurs Auth

**Important** : Le SQL ne peut pas supprimer les users de `auth.users`

**Méthode 1 : Dashboard (Plus simple)**
1. **Authentication** → **Users**
2. Sélectionne tous les utilisateurs
3. **Delete**

**Méthode 2 : SQL avec Service Role**
```sql
-- ⚠️ Nécessite SUPABASE_SERVICE_ROLE_KEY
SELECT auth.delete_user(id) FROM auth.users;
```

### 4. Vérification

Exécute :
```sql
SELECT 'sessions' as table_name, COUNT(*) as count FROM sessions
UNION ALL
SELECT 'packages', COUNT(*) FROM packages
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;
```

**Résultat attendu** : `count = 0` partout

---

## 🔄 Après le Nettoyage

### 1er Vrai Utilisateur

Quand un client s'inscrit :
1. ✅ Email de confirmation envoyé (nouveau template)
2. ✅ Profil créé dans `profiles`
3. ✅ Peut acheter un forfait
4. ✅ Package créé automatiquement (webhook Stripe)
5. ✅ Peut réserver des sessions

---

## ✅ Checklist Mise en Production

- [ ] Backup créé (si disponible)
- [ ] SQL cleanup exécuté
- [ ] Utilisateurs Auth supprimés
- [ ] Vérification : 0 enregistrements
- [ ] Stripe en mode PRODUCTION (clés live)
- [ ] Webhook Stripe configuré (production)
- [ ] Cal.com webhook configuré
- [ ] Email template Supabase configuré
- [ ] Twilio/WhatsApp configuré
- [ ] DNS configuré (fitbuddy.ch)
- [ ] Test complet : signup → achat → réservation

---

**Base de données propre et prête pour la production ! 🚀**
