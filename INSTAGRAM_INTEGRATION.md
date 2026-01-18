# 📸 Guide : Intégrer vos posts Instagram dans les Témoignages

## Option 1 : Embed Instagram (Recommandé)

### Pour des posts Instagram existants :

1. **Obtenir l'embed code** :
   - Va sur ton post Instagram
   - Clique sur `...` (trois points)
   - Clique sur "Embed" / "Intégrer"
   - Copie le code

2. **Créer un composant InstagramPost** :

```tsx
// components/InstagramPost.tsx
'use client';

import { useEffect } from 'react';

interface InstagramPostProps {
  embedCode: string;
}

export default function InstagramPost({ embedCode }: InstagramPostProps) {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div 
      className="instagram-media" 
      dangerouslySetInnerHTML={{ __html: embedCode }}
    />
  );
}
```

3. **Utiliser dans Testimonials.tsx** :

```tsx
import InstagramPost from './InstagramPost';

export default function Testimonials({ testimonials, lang }: TestimonialsProps) {
  // Tes embed codes Instagram
  const instagramPosts = [
    {
      id: '1',
      embedCode: `<blockquote class="instagram-media">...</blockquote>`
    },
    // Plus de posts...
  ];

  return (
    <section>
      {/* Tes témoignages actuels */}
      
      {/* Section Instagram */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">
          {lang === 'fr' ? 'Suivez notre communauté' : 'Follow our community'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instagramPosts.map(post => (
            <InstagramPost key={post.id} embedCode={post.embedCode} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Option 2 : Widget Instagram (Plus simple)

### Utiliser un service tiers :

**EmbedSocial** ou **Curator.io** :
1. Connecte ton compte Instagram
2. Sélectionne les posts à afficher
3. Copie le code widget
4. Colle dans ton site

**Exemple avec EmbedSocial** :
```tsx
<div className="embedsocial-hashtag" data-ref="abc123"></div>
<script>(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialHashtagScript"));</script>
```

---

## Option 3 : Vidéos uploadées manuellement

Si tu préfères uploader tes vidéos Instagram :

1. **Télécharge tes vidéos Instagram** (avec un outil comme insta-downloader.net)

2. **Ajoute-les dans `/public/testimonials/`**

3. **Modifie programsConfig.ts** :

```typescript
testimonials: {
  fr: [
    {
      name: "Marie D.",
      role: "Perte de 15kg",
      quote: "...",
      rating: 5,
      videoUrl: "/testimonials/marie-testimonial.mp4"  // Nouveau champ
    }
  ]
}
```

4. **Modifie Testimonials.tsx** :

```tsx
export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
          {testimonial.videoUrl ? (
            <video 
              controls
              className="w-full rounded-lg mb-4"
              poster="/testimonials/thumbnail.jpg"
            >
              <source src={testimonial.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
          )}
          
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Recommandation

**Option 1 (Embed Instagram)** si :
- ✅ Tu veux garder tes posts sur Instagram
- ✅ Tu veux que ce soit toujours à jour
- ✅ Tu veux l'intégration sociale (likes, commentaires)

**Option 3 (Vidéos uploadées)** si :
- ✅ Tu veux contrôle total sur l'affichage
- ✅ Tu veux que ça charge plus vite
- ✅ Tu ne veux pas dépendre d'Instagram

---

## 📝 Marche à suivre maintenant

1. **Choisis une option**
2. **Prépare 3-5 posts/vidéos**
3. Dis-moi laquelle tu préfères, je modifie le code pour toi !

**Questions** :
- Combien de posts Instagram veux-tu afficher ?
- Préfères-tu les embed Instagram ou vidéos uploadées ?
- As-tu un hashtag spécifique (#fitbuddy) ?
