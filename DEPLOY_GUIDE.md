# 🚀 Instructions de déploiement GitHub + Cloudflare Pages

## Étape 1 : Créer le repo sur GitHub

1. **Va sur GitHub** : https://github.com/new

2. **Remplis le formulaire** :
   - Repository name : `fitbuddy-landing`
   - Description : `Landing pages pour Fitbuddy - Coaching sport/santé en visio`
   - Visibilité : **Public** ou **Private** (au choix)
   - ⚠️ **Ne coche PAS** "Add a README file"
   - ⚠️ **Ne coche PAS** "Add .gitignore"
   - ⚠️ **Ne coche PAS** "Choose a licence"

3. **Clique sur** "Create repository"

4. **Note l'URL du repo** qui apparaît en haut (ex: `https://github.com/nourascharer/fitbuddy-landing.git`)

---

## Étape 2 : Lier ton code local au repo GitHub

Une fois le repo créé sur GitHub, **copie l'URL du repo** et exécute :

```bash
cd /Users/nourascharer/Desktop/Fitbuddy-Anti/Fitbuddy/fitbuddy-landing

# Remplace TON-VRAI-USERNAME par ton username GitHub réel
git remote add origin https://github.com/TON-VRAI-USERNAME/fitbuddy-landing.git

# Push vers GitHub
git branch -M main
git push -u origin main
```

**Note** : Ton commit est déjà créé localement, il ne reste plus qu'à pusher !

---

## Étape 3 : Connecter à Cloudflare Pages

1. **Va sur** : https://dash.cloudflare.com

2. **Workers & Pages** (menu gauche) → **Create application**

3. **Onglet Pages** → **Connect to Git**

4. **GitHub** → Autorise Cloudflare → Sélectionne `fitbuddy-landing`

5. **Configuration du build** :
   ```
   Project name: fitbuddy-landing
   Production branch: main
   
   Build settings:
   - Framework preset: Next.js
   - Build command: npm run build
   - Build output directory: (laisse vide ou mets .next)
   ```

6. **Environment variables** (optionnel pour l'instant, laisse vide)

7. **Save and Deploy** ✨

---

## Étape 4 : Attendre le déploiement

Cloudflare va :
- ✅ Installer les dépendances (~2 min)
- ✅ Builder l'application (~3-5 min)
- ✅ Déployer sur le CDN (~30 sec)

**Total** : ~5-8 minutes

Tu recevras une URL genre : `https://fitbuddy-landing-xxx.pages.dev`

---

## ✅ Déploiements futurs (automatiques)

Chaque fois que tu fais un `git push` :

```bash
# Faire des modifications
# ...

git add .
git commit -m "Description des changements"
git push
```

→ Cloudflare redéploie automatiquement ! 🚀

---

## 🌐 Domaine personnalisé (optionnel)

Dans Cloudflare Pages :
1. **Custom domains** → **Set up a custom domain**
2. Entre ton domaine (ex: `fitbuddy.com`)
3. Cloudflare configure le DNS automatiquement

---

## 🔥 Commandes utiles

```bash
# Vérifier l'état Git
git status

# Voir l'URL du repo GitHub
git remote -v

# Voir l'historique des commits
git log --oneline

# Push après modifications
git add .
git commit -m "Update: description"
git push
```

---

**Tu es prêt !** 🎉

Une fois le repo GitHub créé, reviens exécuter l'étape 2 avec la vraie URL.
