# 🎯 Configuration Webhook Stripe - Guide Complet

## Étape 1 : Créer le Webhook dans Stripe

### 1.1 Aller sur Stripe Webhooks

https://dashboard.stripe.com/test/webhooks

### 1.2 Créer l'endpoint

1. Clique **+ Add endpoint**
2. **Endpoint URL** : `https://news-f-phi.vercel.app/api/webhooks/stripe`
3. **Description** : `Fitbuddy - Auto-create packages after payment`

### 1.3 Sélectionner les events

**Clique "Select events"** et cherche :

✅ `checkout.session.completed`  
✅ `payment_intent.payment_failed` (optionnel)

**Important** : `checkout.session.completed` est **ESSENTIEL** !

### 1.4 Créer et copier le secret

1. Clique **Add endpoint**
2. **Copie le Signing secret** (commence par `whsec_...`)
3. **Garde-le** pour l'étape 2

---

## Étape 2 : Configurer Vercel

### 2.1 Nettoyer les Price IDs (IMPORTANT)

Va sur https://vercel.com/geniuslab-chs-fitbuddy/news/settings/environment-variables

**Pour CHAQUE variable**, édite et vérifie qu'il **n'y a PAS de retour à la ligne** :

```
NEXT_PUBLIC_STRIPE_PRICE_1MONTH
Valeur actuelle: price_1Sr9EIQu4KGTWLMSlfjCLAWL\n  ❌ MAUVAIS
Nouvelle valeur: price_1Sr9EIQu4KGTWLMSlfjCLAWL    ✅ BON
```

Répète pour les 4 Price IDs.

### 2.2 Ajouter le Webhook Secret

**Ajoute nouvelle variable** :

- **Name** : `STRIPE_WEBHOOK_SECRET`
- **Value** : `whsec_xxxxxxxxxxxxx` (ton secret de l'étape 1.4)
- **Environments** : Production, Preview, Development

### 2.3 Redeploy

Clique **Redeploy** pour appliquer les changements.

---

## Étape 3 : Tester le Flow Complet

### 3.1 Faire un achat test

1. Va sur https://news-f-phi.vercel.app/dashboard/checkout
2. Clique **"Acheter maintenant"** (forfait 3 mois - 555 CHF)
3. **Carte test** : `4242 4242 4242 4242`
   - Expiration : `12/34`
   - CVC : `123`
   - Code postal : `12345`
4. **Complete Payment**

### 3.2 Vérifier la redirection

Tu devrais être redirigé vers :  
`https://news-f-phi.vercel.app/dashboard/checkout/success?session_id=cs_xxx`

### 3.3 Vérifier le webhook dans Stripe

1. Va sur https://dashboard.stripe.com/test/webhooks
2. Clique sur ton webhook
3. Onglet **"Events"**
4. Tu devrais voir l'event `checkout.session.completed` avec statut **✅ Succeeded**

### 3.4 Vérifier le package dans Supabase

1. Va sur https://supabase.com → SQL Editor
2. Exécute :

```sql
SELECT 
  id,
  user_id,
  package_type,
  total_sessions,
  sessions_used,
  start_date,
  end_date,
  status,
  stripe_payment_intent,
  created_at
FROM packages 
ORDER BY created_at DESC 
LIMIT 5;
```

3. **Tu devrais voir** un nouveau package avec :
   - `package_type` = `3months`
   - `total_sessions` = `24`
   - `status` = `active`
   - `stripe_payment_intent` = `pi_xxx`

### 3.5 Vérifier le dashboard

1. Va sur https://news-f-phi.vercel.app/dashboard
2. **Le PackageCard** devrait afficher :
   - ✅ Formule 3 mois
   - ✅ 24 sessions (0 utilisées)
   - ✅ Dates de début/fin

---

## 🐛 Troubleshooting

### Webhook ne se déclenche pas

**Check** :
1. Event `checkout.session.completed` sélectionné dans Stripe ?
2. URL webhook correcte : `https://news-f-phi.vercel.app/api/webhooks/stripe` ?
3. Webhook secret ajouté dans Vercel ?

**Debug** :
- Logs Stripe : https://dashboard.stripe.com/test/webhooks → ton webhook → Events
- Logs Vercel : https://vercel.com/geniuslab-chs-fitbuddy/news/logs

### Package pas créé en DB

**Check logs webhook** dans Vercel :
```
✅ Checkout session completed: cs_xxx
📦 Creating package: {...}
✅ Package created successfully
```

Si erreur :
- Vérifier `SUPABASE_SERVICE_ROLE_KEY` correct
- Vérifier RLS policies Supabase

### Price ID error : "No such price"

**Cause** : Retour à la ligne `\n` dans les env vars

**Solution** : Édite chaque Price ID dans Vercel, supprime les espaces/retours à la ligne

---

## ✅ Checklist finale

- [ ] Webhook créé dans Stripe
- [ ] Signing secret copié
- [ ] Price IDs nettoyés (pas de `\n`)
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté à Vercel
- [ ] Redéployé
- [ ] Test achat avec `4242...`
- [ ] Event visible dans Stripe
- [ ] Package créé en Supabase
- [ ] Dashboard affiche le forfait

---

**Une fois terminé, tu auras un flow 100% automatique** :  
Achat Stripe → Webhook → Package créé → Affichage dashboard ! 🎉
