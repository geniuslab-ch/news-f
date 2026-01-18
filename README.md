# Fitbuddy Landing Pages

Projet Next.js avec TypeScript et Tailwind CSS pour les 4 landing pages de Fitbuddy.

## 🚀 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📂 Structure du projet

```
fitbuddy-landing/
├── app/
│   ├── [slug]/
│   │   └── page.tsx          # Page dynamique pour chaque programme
│   ├── layout.tsx             # Layout racine
│   ├── page.tsx               # Page d'accueil (sélection des programmes)
│   └── globals.css            # Styles globaux
├── components/
│   ├── Header.tsx             # Header avec navigation
│   ├── Footer.tsx             # Footer avec liens légaux
│   ├── Hero.tsx               # Section Hero
│   ├── Benefits.tsx           # Section bénéfices
│   ├── WhatYouGet.tsx         # Liste des inclusions
│   ├── HowItWorks.tsx         # Processus en 3 étapes
│   ├── ProgramDetails.tsx     # Détails du programme
│   ├── GoogleMeetSection.tsx  # Avantages Google Meet
│   ├── Testimonials.tsx       # Témoignages clients
│   ├── FAQ.tsx                # FAQ avec accordéons
│   └── SignupForm.tsx         # Formulaire d'inscription
├── lib/
│   ├── programsConfig.ts      # Configuration des 4 programmes
│   └── coachAssignment.ts     # Logique d'attribution des coachs
└── public/                    # Assets statiques (placeholders pour images)
```

## 🎯 Les 4 programmes

1. **Déclic Durable** (`/declic-durable`) - Personnes obèses
2. **Le Système Apex** (`/systeme-apex`) - Professionnels occupés
3. **Élan Senior** (`/elan-senior`) - Personnes âgées
4. **Renaissance** (`/renaissance`) - Femmes post-partum

## 🌍 Langues

- **FR** (par défaut)
- **EN** (switch via bouton)

Le switch de langue est géré côté client avec un simple state React.

## 🧠 Logique d'attribution des coachs

Le fichier `lib/coachAssignment.ts` contient :
- Une liste de coachs (actuellement 1 coach : Sarah Martinez, FR/EN)
- Une fonction `assignCoach(userLanguage, program)` qui retourne un coach compatible

**Règle impérative** : La langue du coach doit correspondre à la langue de l'utilisateur.

Si aucun coach n'est disponible dans la langue demandée, un message alternatif s'affiche.

## 📝 Formulaire d'inscription

Champs :
- Prénom
- Email
- Langue (FR/EN)
- Objectif principal (select adapté au programme)
- Disponibilités (texte libre)
- Consentement RGPD (checkbox)

Au submit :
- Simulation d'envoi (mock)
- Attribution automatique d'un coach
- Message de confirmation avec nom du coach

**Tracking** : Placeholders pour Google Tag Manager (dataLayer.push)

## 🎨 Design

- Style premium clean (fitness + santé + confiance)
- Responsive mobile-first
- Animations douces (blobs animés, hover effects)
- Gradients modernes (emerald → teal → cyan)
- Font : Inter (Google Fonts)

## ⚡ Performance

- Next.js App Router avec génération statique
- Images optimisées (à ajouter dans `/public`)
- CSS minimal et Tailwind optimisé
- Excellent CLS/LCP attendu

## ♿ Accessibilité

- Contrastes WCAG AA
- Labels de formulaire explicites
- Focus states visibles
- Smooth scroll
- Aria-labels si nécessaire

## 🖼️ Images (placeholders)

Ajoutez les images suivantes dans `/public` :
- `hero-declic.jpg`
- `hero-apex.jpg`
- `hero-senior.jpg`
- `hero-renaissance.jpg`
- `logo.png` ou `logo.svg`

## 📦 Dépendances

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Aucune dépendance externe supplémentaire

## 🚢 Déploiement

```bash
# Build de production
npm run build

# Lancer en production
npm start
```

Déploiement recommandé sur **Vercel** (zero-config).

## ⚠️ Disclaimer

Tous les programmes affichent un disclaimer médical :

> "Les programmes Fitbuddy ne remplacent pas un avis médical. Consultez votre médecin avant de commencer tout programme d'exercice."

## 📄 Contenu

Tout le contenu (copywriting, témoignages, FAQ) est stocké dans `lib/programsConfig.ts` pour faciliter la maintenance et les traductions.

## 🔧 Personnalisation

Pour ajouter un nouveau programme :
1. Ajouter la config dans `lib/programsConfig.ts`
2. La route sera automatiquement générée via `generateStaticParams`

Pour ajouter un coach :
1. Ajouter l'entrée dans `lib/coachAssignment.ts`

---

Développé avec ❤️ pour Fitbuddy
