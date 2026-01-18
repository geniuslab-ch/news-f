# Déploiement sur Cloudflare Pages - Guide complet

## 🚀 Méthode 1 : Via l'interface web Cloudflare (RECOMMANDÉ - Plus simple)

### Étape 1 : Pusher ton code sur GitHub

```bash
cd /Users/nourascharer/Desktop/Fitbuddy-Anti/Fitbuddy/fitbuddy-landing

# Initialiser Git si pas déjà fait
git init
git add .
git commit -m "Initial commit - Fitbuddy landing pages"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/TON-USERNAME/fitbuddy-landing.git
git branch -M main
git push -u origin main
```

### Étape 2 : Connecter à Cloudflare Pages

1. Va sur https://dash.cloudflare.com
2. Clique sur **Workers & Pages** dans le menu
3. Clique sur **Create application**
4. Onglet **Pages** → **Connect to Git**
5. Autorise GitHub et sélectionne ton repo `fitbuddy-landing`

### Étape 3 : Configuration du build

Dans l'interface Cloudflare, configure :

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (leave empty)
Node version: 20
```

**Variables d'environnement** (à ajouter si nécessaire) :
- Aucune requise pour l'instant

### Étape 4 : Déployer

Clique sur **Save and Deploy** ✅

Cloudflare va :
- Cloner ton repo
- Installer les dépendances
- Builder l'application
- La déployer sur son CDN mondial

**URL finale** : `fitbuddy-landing.pages.dev` (ou ton domaine custom)

---

## 🔧 Méthode 2 : Via Wrangler CLI (ligne de commande)

### Prérequis

Wrangler est déjà en cours d'installation localement dans ton projet.

### Étape 1 : Login Cloudflare

Une fois wrangler installé :

```bash
npx wrangler login
```

Cela ouvrira ton navigateur pour te connecter.

### Étape 2 : Configurer pour Cloudflare Pages

Next.js avec Cloudflare Pages nécessite une configuration spéciale.

**Option A : Build statique (recommandé pour ton cas)**

```bash
# 1. Modifier next.config.ts
```

Ajoute cette config :

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

```bash
# 2. Build
npm run build

# 3. Déployer
npx wrangler pages deploy out --project-name=fitbuddy-landing
```

**Option B : Avec @cloudflare/next-on-pages (pour API routes)**

Si tu as besoin des API routes plus tard :

```bash
# Installation
npm install --save-dev @cloudflare/next-on-pages

# Build
npx @cloudflare/next-on-pages

# Déployer
npx wrangler pages deploy .vercel/output/static --project-name=fitbuddy-landing
```

---

## 🌐 Domaine personnalisé

### Configurer ton propre domaine

1. Dans Cloudflare Dashboard → **Pages**
2. Sélectionne ton projet
3. **Custom domains** → **Set up a custom domain**
4. Entre ton domaine (ex: `fitbuddy.com`)
5. Cloudflare configure automatiquement le DNS

---

## ⚙️ Fichiers de configuration

### Créer `wrangler.toml` (optionnel)

```toml
name = "fitbuddy-landing"
compatibility_date = "2024-01-01"

[site]
bucket = ".next"
```

### Créer `.nvmrc` pour Node version

```
20
```

---

## 🔄 Déploiement continu

### Avec GitHub (automatique)

Une fois connecté via l'interface web :
- Chaque `git push` sur `main` → déploiement auto
- Chaque Pull Request → preview deployment

### Avec CLI (manuel)

```bash
# À chaque modification
git add .
git commit -m "Update"
git push

# OU directement avec wrangler
npm run build
npx wrangler pages deploy out --project-name=fitbuddy-landing
```

---

## 🐛 Troubleshooting

### Erreur "output: export" incompatible

Si tu as des fonctionnalités serveur (API routes, ISR, etc.), tu dois utiliser `@cloudflare/next-on-pages` :

```bash
npm install --save-dev @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
```

### Erreur de permissions wrangler

Utilise toujours `npx wrangler` au lieu de l'installer globalement :

```bash
npx wrangler login
npx wrangler pages deploy out
```

### Build trop long

Cloudflare Pages a un timeout de 20 min. Si ton build est trop long, optimise :

```bash
# Nettoie node_modules
rm -rf node_modules
npm ci
```

---

## 📊 Après déploiement

### Vérifier le déploiement

1. **Dashboard Cloudflare** → Pages → Ton projet
2. Tu verras :
   - ✅ Status du build
   - 🌐 URL du site
   - 📊 Analytics (visites, bande passante)
   - 🔄 Historique des déploiements

### Tester

```bash
# Teste l'URL fournie par Cloudflare
curl https://fitbuddy-landing.pages.dev

# Ou ouvre dans le navigateur
open https://fitbuddy-landing.pages.dev
```

---

## 💰 Coûts

- **Gratuit jusqu'à** :
  - 500 builds/mois
  - Illimité bandwidth
  - Illimité pages vues
- **Au-delà** : $0.25 par build supplémentaire

**→ Pour Fitbuddy, c'est 100% GRATUIT** 🎉

---

## 🎯 Recommandation finale

**Utilise la Méthode 1 (interface web)** :
- Plus simple
- Déploiement automatique à chaque push Git
- Preview deployments pour les PRs
- Rollback facile

La Méthode 2 (CLI) est utile pour :
- Déploiements rapides sans Git
- Automatisation CI/CD custom
- Tests locaux

---

## ✅ Checklist de déploiement

- [ ] Code pushé sur GitHub
- [ ] Connecté repo à Cloudflare Pages
- [ ] Configuration build correcte (Next.js)
- [ ] Premier déploiement réussi
- [ ] URL testée
- [ ] (Optionnel) Domaine custom configuré

**Temps estimé** : 5-10 minutes ⏱️
