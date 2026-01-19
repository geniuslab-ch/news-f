# 🚀 Guide : Passer de TEST à PRODUCTION Stripe

## ⚠️ AVANT DE COMMENCER

Ce guide te permet de basculer de l'environnement TEST Stripe vers PRODUCTION pour accepter de vrais paiements.

**IMPORTANT** : En production, les cartes bancaires seront réellement débitées !

---

## 📋 ÉTAPE 1 : Créer les Prix en mode Production

### A. Activer le mode Production sur Stripe

1. Va sur https://dashboard.stripe.com
2. **Toggle** en haut à gauche : **TEST mode** → **PRODUCTION**

### B. Créer les 4 produits/prix

**Pour chaque forfait (1, 3, 6, 12 mois)** :

1. **Products** → **+ Add product**
2. **Name** : `Formule X mois` (ex: Formule 3 mois)
3. **Description** : Description du forfait
4. **Pricing** :
   - Model : **Recurring**  
   - Price : **CHF XXX** (200/555/1050/1980)
   - Billing period : **Monthly** / **Every 3 months** / etc.
5. **Save product**
6. **Copie le Price ID** : `price_xxxxx...`

**Résultat** : Tu auras 4 nouveaux Price IDs en mode PRODUCTION.

---

## 📋 ÉTAPE 2 : Récupérer les Clés de Production

### A. API Keys

1. **Developers** → **API keys**
2. **Mode : PRODUCTION** (vérifie le toggle)
3. Copie :
   - **Publishable key** : `pk_live_xxxxx...`
   - **Secret key** : `sk_live_xxxxx...`

### B. Webhook Signing Secret

1. **Developers** → **Webhooks**
2. **+ Add endpoint**
3. **Endpoint URL** : `https://news-f-phi.vercel.app/api/webhooks/stripe`
4. **Events** :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
5. **Add endpoint**
6. **Signing secret** : `whsec_xxxxx...`

---

## 📋 ÉTAPE 3 : Mettre à Jour les Variables d'Environnement

### A. Fichier .env.local

```bash
# Stripe PRODUCTION
STRIPE_SECRET_KEY=sk_live_xxxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx...

# Stripe Price IDs (PRODUCTION Mode)
NEXT_PUBLIC_STRIPE_PRICE_1MONTH=price_xxxxx...
NEXT_PUBLIC_STRIPE_PRICE_3MONTHS=price_xxxxx...
NEXT_PUBLIC_STRIPE_PRICE_6MONTHS=price_xxxxx...
NEXT_PUBLIC_STRIPE_PRICE_12MONTHS=price_xxxxx...

# Stripe Webhook (PRODUCTION)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
```

### B. Variables Vercel

```bash
cd /Users/nourascharer/Desktop/Fitbuddy-Anti/Fitbuddy/fitbuddy-landing

# Supprime les anciennes clés TEST
npx vercel env rm STRIPE_SECRET_KEY production
npx vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
npx vercel env rm NEXT_PUBLIC_STRIPE_PRICE_1MONTH production
npx vercel env rm NEXT_PUBLIC_STRIPE_PRICE_3MONTHS production
npx vercel env rm NEXT_PUBLIC_STRIPE_PRICE_6MONTHS production
npx vercel env rm NEXT_PUBLIC_STRIPE_PRICE_12MONTHS production
npx vercel env rm STRIPE_WEBHOOK_SECRET production

# Ajoute les nouvelles clés PROD
npx vercel env add STRIPE_SECRET_KEY production
# Colle : sk_live_xxxxx...

npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Colle : pk_live_xxxxx...

npx vercel env add NEXT_PUBLIC_STRIPE_PRICE_1MONTH production
# Colle : price_xxxxx... (1 mois PROD)

npx vercel env add NEXT_PUBLIC_STRIPE_PRICE_3MONTHS production
# Colle : price_xxxxx... (3 mois PROD)

npx vercel env add NEXT_PUBLIC_STRIPE_PRICE_6MONTHS production
# Colle : price_xxxxx... (6 mois PROD)

npx vercel env add NEXT_PUBLIC_STRIPE_PRICE_12MONTHS production
# Colle : price_xxxxx... (12 mois PROD)

npx vercel env add STRIPE_WEBHOOK_SECRET production
# Colle : whsec_xxxxx...
```

---

## 📋 ÉTAPE 4 : Redéployer

```bash
npx vercel --prod
```

---

## 🧪 ÉTAPE 5 : TEST PRODUCTION

### A. Test avec carte LIVE (attention : débit réel !)

**Option 1** : Utilise ta propre carte et annule immédiatement

**Option 2** : Attends un vrai client

### B. Vérifier que ça fonctionne

1. Va sur `/checkout`
2. Sélectionne un forfait
3. Paye avec une vraie carte
4. **Vérifie** :
   - ✅ Paiement reçu dans Stripe Dashboard (PROD mode)
   - ✅ Package créé en DB
   - ✅ Client voit son forfait
   - ✅ Webhook triggered

---

## 🔄 Rollback (Retour en TEST)

Si problème, remets les clés TEST :

```bash
# Dans .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# ... etc

# Dans Vercel
npx vercel env add STRIPE_SECRET_KEY production
# Colle la clé TEST

npx vercel --prod
```

---

## ✅ Checklist Passage Production

- [ ] Prix créés en mode PRODUCTION (4 Price IDs)
- [ ] Clés API PROD récupérées (pk_live, sk_live)
- [ ] Webhook PROD configuré
- [ ] .env.local mis à jour
- [ ] Variables Vercel mises à jour
- [ ] Redéploiement effectué
- [ ] Test achat réel validé
- [ ] Package créé automatiquement
- [ ] Client peut accéder au dashboard

**Une fois validé, tu es en PRODUCTION ! 🎉**
