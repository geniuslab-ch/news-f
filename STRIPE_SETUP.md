# Stripe Setup Guide - Phase 4

## 🎯 Étapes à suivre

### 1. Créer les 4 produits dans Stripe Dashboard

1. Va sur **https://dashboard.stripe.com/test/products**
2. Pour chaque forfait, clique **+ Add product**

#### Forfait 1 : Formule 1 mois
- **Name** : `Formule 1 mois - Fitbuddy`
- **Description** : `8 sessions de coaching (45 min) - 2 sessions par semaine`
- **Pricing** : One-time payment
- **Price** : `333` CHF
- **Save product** → **Copie le Price ID** (commence par `price_...`)

#### Forfait 2 : Formule 3 mois
- **Name** : `Formule 3 mois - Fitbuddy`
- **Description** : `24 sessions de coaching (45 min) - Programme recommandé`
- **Pricing** : One-time payment
- **Price** : `555` CHF
- **Save product** → **Copie le Price ID**

#### Forfait 3 : Formule 6 mois
- **Name** : `Formule 6 mois - Fitbuddy`
- **Description** : `48 sessions de coaching (45 min) - Meilleure valeur`
- **Pricing** : One-time payment
- **Price** : `888` CHF
- **Save product** → **Copie le Price ID**

#### Forfait 4 : Formule 12 mois
- **Name** : `Formule 12 mois - Fitbuddy`
- **Description** : `98 sessions de coaching (45 min) - Engagement annuel`
- **Pricing** : One-time payment
- **Price** : `1776` CHF
- **Save product** → **Copie le Price ID**

---

### 2. Ajouter les Price IDs dans .env.local

Ouvre `.env.local` et ajoute :

```bash
# Stripe Price IDs (Test Mode)
NEXT_PUBLIC_STRIPE_PRICE_1MONTH=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_3MONTHS=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_6MONTHS=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_12MONTHS=price_xxxxxxxxxxxxx

# Stripe Webhook Secret (à configurer après étape 3)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase Service Role Key (pour webhook)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important** : Tu dois aussi récupérer la **Service Role Key** depuis Supabase :
- https://supabase.com/dashboard → Project Settings → API
- **service_role** key (secret, ne pas exposer au public)

---

### 3. Configurer le Webhook Stripe

#### A. Créer endpoint webhook

1. Va sur **https://dashboard.stripe.com/test/webhooks**
2. **+ Add endpoint**
3. **Endpoint URL** : `https://news-f-phi.vercel.app/api/webhooks/stripe`
4. **Events to send** :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. **Add endpoint**
6. **Copie le Signing secret** (commence par `whsec_...`)
7. Ajoute-le dans `.env.local` : `STRIPE_WEBHOOK_SECRET=whsec_...`

#### B. Tester le webhook

Utilise Stripe CLI :
```bash
# Install Stripe CLI (si pas déjà fait)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### 4. Ajouter Price IDs dans Vercel

Pour que la production fonctionne :

1. Va sur **https://vercel.com/geniuslab-chs-fitbuddy/news/settings/environment-variables**
2. Ajoute les variables :
   - `NEXT_PUBLIC_STRIPE_PRICE_1MONTH`
   - `NEXT_PUBLIC_STRIPE_PRICE_3MONTHS`
   - `NEXT_PUBLIC_STRIPE_PRICE_6MONTHS`
   - `NEXT_PUBLIC_STRIPE_PRICE_12MONTHS`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Redeploy** le projet

---

### 5. Modifier table packages (si besoin)

Ajoute colonne `stripe_payment_intent` :

```sql
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;
```

---

## 🧪 Test du flow complet

### Test en local

1. **Démarre le serveur** : `npm run dev`
2. **Va sur** : http://localhost:3000/dashboard/checkout
3. **Clique** "Acheter maintenant" (forfait 3 mois)
4. **Utilise carte test** : `4242 4242 4242 4242`
   - Expiration : `12/34`
   - CVC : `123`
5. **Complète le paiement**
6. **Vérifie** :
   - Redirect success page ✅
   - Webhook déclenché (console logs)
   - Package créé en DB ✅
   - Dashboard affiche forfait ✅

### Cartes test Stripe

- **Success** : `4242 4242 4242 4242`
- **Decline** : `4000 0000 0000 0002`
- **Insufficient** : `4000 0000 0000 9995`
- **Auth required** : `4000 0025 0000 3155`

---

## 🚀 Migration vers LIVE Mode

Quand prêt pour production :

1. **Créer produits en Live Mode** (mêmes prix)
2. **Copier nouveaux Price IDs** (LIVE)
3. **Update env vars** :
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
4. **Créer webhook LIVE** → nouveau signing secret
5. **Redeploy**

---

## ⚠️ Checklist avant test

- [ ] 4 produits Stripe créés
- [ ] Price IDs dans `.env.local`
- [ ] Service Role Key Supabase dans `.env.local`
- [ ] Webhook configuré
- [ ] Webhook secret dans `.env.local`
- [ ] Colonne `stripe_payment_intent` ajoutée
- [ ] Variables Vercel configurées
- [ ] Projet redéployé

---

**Prêt à tester !** 🎉
