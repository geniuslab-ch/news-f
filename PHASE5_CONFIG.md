# 🎯 Phase 5 : Configuration Cal.com Webhook

## ✅ Ce qui a été déployé

1. **Webhook endpoint** : `/api/webhooks/calcom`
2. **Page rendez-vous récurrents** : `/dashboard/book/recurring`
3. **API création sessions** : `/api/sessions/recurring`
4. **Database migration** : `supabase-calcom-integration.sql`

---

## 📋 ÉTAPE 1 : Exécuter le SQL Migration

**Va sur Supabase SQL Editor** et exécute :

```sql
--  Copie tout le contenu de supabase-calcom-integration.sql
```

Cela va :
- ✅ Ajouter `calcom_booking_id` à la table sessions
- ✅ Ajouter `meeting_link` si manquant
- ✅ Créer les index pour performance

---

## 📋 ÉTAPE 2 : Configurer le Webhook Cal.com

### A. Aller sur Cal.com Settings

https://app.cal.eu/settings/developer/webhooks

### B. Créer le Webhook

1. Clique **+ New Webhook**
2. **Subscriber URL** : 
   ```
   https://news-f-phi.vercel.app/api/webhooks/calcom
   ```
3. **Events to listen to** : Sélectionne :
   - ✅ Booking created
   - ✅ Booking cancelled
   - ✅ Booking rescheduled
4. **Secret** : (optionnel mais recommandé)
   - Génère un secret ou utilise : `whsec_fitbuddy_calcom_2026`
5. **Save**

### C. Ajouter le Secret (optionnel)

Si tu as configuré un secret :

**.env.local** :
```bash
CALCOM_WEBHOOK_SECRET=whsec_fitbuddy_calcom_2026
```

**Vercel** :
```
CALCOM_WEBHOOK_SECRET=whsec_fitbuddy_calcom_2026
```

---

## 🧪 ÉTAPE 3 : Tester le Webhook

### Test 1 : Créer une réservation

1. **Va sur** https://app.cal.eu/fitbuddy/session-coaching-suivi-45-min
2. **Réserve** une session avec ton email
3. **Vérifie le dashboard** → La session devrait apparaître automatiquement !

### Test 2 : Vérifier en DB

```sql
SELECT * FROM sessions 
WHERE calcom_booking_id IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 5;
```

Tu devrais voir le `calcom_booking_id` rempli !

### Test 3 : Annuler une réservation

1. **Va sur Cal.com** et annule la réservation
2. **Vérifie le dashboard** → Status = `cancelled`

---

## 🔄 ÉTAPE 4 : Tester Rendez-vous Récurrents

### A. Aller sur la page

https://news-f-phi.vercel.app/dashboard/book/recurring

### B. Configuration test

1. **Fréquence** : Hebdomadaire
2. **Nombre** : 4 sessions
3. **Jour** : Lundi
4. **Heure** : 10:00

### C. Vérifier le preview

Tu devrais voir :
```
✓ Lundi 27 Jan 2026 à 10:00
✓ Lundi 03 Fév 2026 à 10:00
✓ Lundi 10 Fév 2026 à 10:00
✓ Lundi 17 Fév 2026 à 10:00
```

### D. Créer les sessions

1. Clique **"Créer 4 sessions"**
2. **Va sur** `/dashboard/sessions`
3. **Vérifie** que les 4 sessions sont créées
4. **Vérifie** sessions_used incrémenté

---

## 🎯 Workflow Final

### Scénario 1 : Client réserve via Cal.com

```
Client → Cal.com → Réserve session
                    ↓
            Webhook trigger
                    ↓
         Session créée en DB
                    ↓
      Visible sur dashboard
```

### Scénario 2 : Client crée rendez-vous récurrents

```
Client → Dashboard → /book/recurring
                        ↓
           Sélectionne fréquence
                        ↓
              Preview dates
                        ↓
               Confirme
                        ↓
          4 sessions créées
                        ↓
      Toutes visibles dashboard
```

---

## 🐛 Troubleshooting

### Webhook ne se déclenche pas

**Check** :
1. URL correcte dans Cal.com ?
2. Events sélectionnés ?
3. Logs Vercel : https://vercel.com/geniuslab-chs-fitbuddy/news/logs

**Debug webhook** :
- Cherche 📅 dans les logs Vercel
- Tu devrais voir : `Cal.com webhook received: BOOKING_CREATED`

### Session pas créée

**Causes possibles** :
1. User email ne correspond pas → Check logs : `⚠️ User not found`
2. Pas de package actif → Check logs : `⚠️ No active package`
3. Session déjà existante → Check logs : `ℹ️ Session already exists`

**Fix** : Les logs Vercel te donneront l'erreur exacte

### Rendez-vous récurrents - erreur sessions

**Check** :
1. Package actif ?
2. Sessions disponibles >= nombre demandé ?
3. Logs API : `/api/sessions/recurring`

---

## ✅ Checklist Phase 5

- [ ] SQL migration exécutée
- [ ] Webhook Cal.com configuré
- [ ] Test : réservation Cal.com créée
- [ ] Test : session apparaît dashboard
- [ ] Test : annulation sync
- [ ] Test : rendez-vous récurrents (4 sessions)
- [ ] Vérifier sessions_used incrémenté

**Une fois tout validé, Phase 5 est complète ! 🎉**
