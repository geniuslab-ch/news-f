# Instructions de lancement - Fitbuddy Landing Pages

## 🚀 Démarrage rapide

### 1. Accéder au projet
```bash
cd /Users/nourascharer/Desktop/Fitbuddy-Anti/Fitbuddy/fitbuddy-landing
```

### 2. Installer les dépendances (si pas déjà fait)
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

## 🌐 Routes disponibles

- **Homepage** : http://localhost:3000
- **Déclic Durable** : http://localhost:3000/declic-durable
- **Le Système Apex** : http://localhost:3000/systeme-apex
- **Élan Senior** : http://localhost:3000/elan-senior  
- **Renaissance** : http://localhost:3000/renaissance

## 🛠️ Commandes utiles

### Développement
```bash
npm run dev          # Serveur de développement (Turbopack)
npm run build        # Build de production
npm start            # Lancer en mode production (après build)
npm run lint         # Linter ESLint
```

### Tests
```bash
# Pour tester une page spécifique
curl http://localhost:3000/declic-durable

# Vérifier que le serveur répond
curl -I http://localhost:3000
```

## 📂 Fichiers principaux à éditer

### Contenu des programmes
**Fichier** : `lib/programsConfig.ts`

Modifier le copywriting, témoignages, FAQ, etc.

### Coachs disponibles
**Fichier** : `lib/coachAssignment.ts`

Ajouter/modifier les coachs et leurs langues.

### Styles globaux
**Fichier** : `app/globals.css`

Animations et styles personnalisés.

### Metadata SEO
**Fichier** : `app/layout.tsx`

Title, description, keywords pour le référencement.

## 🎨 Ajouter des images

Placer vos images dans le dossier `public/` :

```bash
public/
├── logo.png              # Logo Fitbuddy
├── hero-declic.jpg       # Image Hero Déclic Durable
├── hero-apex.jpg         # Image Hero Système Apex
├── hero-senior.jpg       # Image Hero Élan Senior
└── hero-renaissance.jpg  # Image Hero Renaissance
```

Puis utiliser dans les composants :
```tsx
<Image src="/logo.png" alt="Fitbuddy" width={200} height={60} />
```

## 🔧 Personnalisation

### Changer les couleurs
Éditer `tailwind.config.ts` :
```typescript
theme: {
  extend: {
    colors: {
      primary: '#10b981',  // emerald-600
      // ... autres couleurs
    },
  },
}
```

### Ajouter Google Analytics
Dans `app/layout.tsx`, ajouter le script GA :
```tsx
<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
```

## 📦 Déploiement Vercel

1. Push sur GitHub :
```bash
git init
git add .
git commit -m "Initial commit - Fitbuddy landing pages"
git branch -M main
git remote add origin https://github.com/your-username/fitbuddy-landing.git
git push -u origin main
```

2. Sur **vercel.com** :
   - Import your Git repository
   - Deploy (zero configuration needed)

3. Domaine custom :
   - Settings → Domains → Add your domain

## ⚠️ Troubleshooting

### Port 3000 déjà utilisé
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Erreurs TypeScript
```bash
# Vérifier les erreurs
npm run build

# Nettoyer le cache Next.js
rm -rf .next
npm run dev
```

### Tailwind ne compile pas les styles
```bash
# Reconstruire le cache Tailwind
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## 📞 Support

Pour toute question sur le code :
- Consulter le [README.md](README.md)
- Consulter le [walkthrough.md](walkthrough.md)
- Vérifier la structure dans `lib/programsConfig.ts`

---

✅ **Le serveur de développement tourne actuellement sur http://localhost:3000**
