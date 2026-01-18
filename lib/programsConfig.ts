export interface ProgramConfig {
  slug: string;
  title: string;
  audience: string;
  heroTitle: {
    fr: string;
    en: string;
  };
  heroSubtitle: {
    fr: string;
    en: string;
  };
  primaryBenefits: {
    fr: Array<{ title: string; description: string; icon: string }>;
    en: Array<{ title: string; description: string; icon: string }>;
  };
  whatYouGet: {
    fr: string[];
    en: string[];
  };
  howItWorks: {
    fr: Array<{ step: string; title: string; description: string }>;
    en: Array<{ step: string; title: string; description: string }>;
  };
  programDetails: {
    fr: {
      objectives: string[];
      duration: string;
      frequency: string;
    };
    en: {
      objectives: string[];
      duration: string;
      frequency: string;
    };
  };
  testimonials: {
    fr: Array<{ name: string; age: string; text: string; rating: number }>;
    en: Array<{ name: string; age: string; text: string; rating: number }>;
  };
  faq: {
    fr: Array<{ question: string; answer: string }>;
    en: Array<{ question: string; answer: string }>;
  };
  cta: {
    fr: string;
    en: string;
  };
  goalOptions: {
    fr: string[];
    en: string[];
  };
}

export const programs: Record<string, ProgramConfig> = {
  'declic-durable': {
    slug: 'declic-durable',
    title: 'Déclic Durable',
    audience: 'personnes obèses',
    heroTitle: {
      fr: 'Retrouvez votre énergie et votre santé avec Déclic Durable',
      en: 'Regain Your Energy and Health with Déclic Durable',
    },
    heroSubtitle: {
      fr: 'Un accompagnement bienveillant et personnalisé pour progresser à votre rythme, sans jugement. Coaching sport et santé en visio, depuis chez vous.',
      en: 'Compassionate and personalized support to progress at your own pace, judgment-free. Sport and health coaching via video, from home.',
    },
    primaryBenefits: {
      fr: [
        {
          title: 'Accompagnement bienveillant',
          description: 'Un coach à votre écoute qui comprend vos défis et vous guide sans jugement',
          icon: '💚',
        },
        {
          title: 'Progression à votre rythme',
          description: 'Des séances adaptées à votre condition physique actuelle, en douceur et en sécurité',
          icon: '📈',
        },
        {
          title: 'Résultats durables',
          description: 'Construisez des habitudes saines qui durent, pas des régimes temporaires',
          icon: '✨',
        },
        {
          title: 'Depuis chez vous',
          description: 'Coaching en visio Google Meet - confortable, privé, et sans déplacement',
          icon: '🏠',
        },
      ],
      en: [
        {
          title: 'Compassionate Support',
          description: 'A coach who listens, understands your challenges, and guides you without judgment',
          icon: '💚',
        },
        {
          title: 'Progress at Your Pace',
          description: 'Sessions adapted to your current fitness level, gently and safely',
          icon: '📈',
        },
        {
          title: 'Lasting Results',
          description: 'Build healthy habits that last, not temporary diets',
          icon: '✨',
        },
        {
          title: 'From Home',
          description: 'Coaching via Google Meet - comfortable, private, and no travel required',
          icon: '🏠',
        },
      ],
    },
    whatYouGet: {
      fr: [
        'Séances de coaching personnalisées en visio Google Meet',
        'Programme adapté à votre condition physique et vos objectifs',
        'Suivi régulier de vos progrès avec votre coach dédié',
        'Conseils nutrition et mode de vie sain (non médicaux)',
        'Support et motivation continue entre les séances',
        'Exercices sécurisés et progressifs, adaptés à votre mobilité',
      ],
      en: [
        'Personalized coaching sessions via Google Meet',
        'Program adapted to your fitness level and goals',
        'Regular progress tracking with your dedicated coach',
        'Nutrition and healthy lifestyle advice (non-medical)',
        'Continuous support and motivation between sessions',
        'Safe and progressive exercises, adapted to your mobility',
      ],
    },
    howItWorks: {
      fr: [
        {
          step: '1',
          title: 'Remplissez le formulaire',
          description: 'Parlez-nous de vos objectifs et disponibilités. C\'est simple et rapide.',
        },
        {
          step: '2',
          title: 'Rencontrez votre coach',
          description: 'Nous vous attribuons un coach qui parle votre langue et comprend vos besoins.',
        },
        {
          step: '3',
          title: 'Commencez votre parcours',
          description: 'Première séance en visio pour établir votre programme personnalisé.',
        },
      ],
      en: [
        {
          step: '1',
          title: 'Fill Out the Form',
          description: 'Tell us about your goals and availability. It\'s simple and quick.',
        },
        {
          step: '2',
          title: 'Meet Your Coach',
          description: 'We assign you a coach who speaks your language and understands your needs.',
        },
        {
          step: '3',
          title: 'Start Your Journey',
          description: 'First video session to establish your personalized program.',
        },
      ],
    },
    programDetails: {
      fr: {
        objectives: [
          'Améliorer votre condition physique générale',
          'Développer une relation saine avec le mouvement',
          'Gagner en énergie et en mobilité au quotidien',
          'Construire des habitudes durables',
          'Retrouver confiance en vous',
        ],
        duration: '3 à 6 mois recommandés pour des résultats visibles et durables',
        frequency: '2 à 3 séances par semaine (30-45 min chacune)',
      },
      en: {
        objectives: [
          'Improve your overall fitness',
          'Develop a healthy relationship with movement',
          'Gain energy and daily mobility',
          'Build lasting habits',
          'Regain self-confidence',
        ],
        duration: '3 to 6 months recommended for visible and lasting results',
        frequency: '2 to 3 sessions per week (30-45 min each)',
      },
    },
    testimonials: {
      fr: [
        {
          name: 'Marie L.',
          age: '48 ans',
          text: 'Après des années à éviter le sport, Fitbuddy m\'a permis de bouger à nouveau sans avoir peur du jugement. Mon coach est incroyablement patient et encourageant. Je me sens déjà plus énergique !',
          rating: 5,
        },
        {
          name: 'Jean-Claude D.',
          age: '55 ans',
          text: 'Le coaching en visio, c\'est parfait pour moi. Pas besoin de me déplacer, et mon coach adapte vraiment les exercices à mes capacités. Je progresse chaque semaine.',
          rating: 5,
        },
      ],
      en: [
        {
          name: 'Marie L.',
          age: '48 years old',
          text: 'After years of avoiding exercise, Fitbuddy allowed me to move again without fear of judgment. My coach is incredibly patient and encouraging. I already feel more energetic!',
          rating: 5,
        },
        {
          name: 'Jean-Claude D.',
          age: '55 years old',
          text: 'Video coaching is perfect for me. No need to travel, and my coach really adapts exercises to my abilities. I progress every week.',
          rating: 5,
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Est-ce que le programme est adapté si je n\'ai jamais fait de sport ?',
          answer: 'Absolument ! Nos coachs sont formés pour travailler avec tous les niveaux, y compris les débutants complets. Chaque programme est entièrement personnalisé selon votre condition actuelle.',
        },
        {
          question: 'Ai-je besoin d\'équipement spécial ?',
          answer: 'Non, les exercices sont conçus pour être réalisés avec peu ou pas d\'équipement. Votre coach s\'adapte à ce que vous avez chez vous.',
        },
        {
          question: 'Que se passe-t-il si j\'ai des problèmes de santé ?',
          answer: 'Nous vous recommandons de consulter votre médecin avant de commencer tout programme d\'exercice. Nos coachs ne sont pas médecins, mais ils adapteront les exercices selon vos capacités et limitations.',
        },
        {
          question: 'Puis-je annuler ou reporter une séance ?',
          answer: 'Oui, avec un préavis de 24h, vous pouvez annuler ou reprogrammer vos séances selon vos besoins.',
        },
      ],
      en: [
        {
          question: 'Is the program suitable if I\'ve never exercised before?',
          answer: 'Absolutely! Our coaches are trained to work with all levels, including complete beginners. Each program is fully personalized to your current condition.',
        },
        {
          question: 'Do I need special equipment?',
          answer: 'No, exercises are designed to be done with little or no equipment. Your coach adapts to what you have at home.',
        },
        {
          question: 'What if I have health issues?',
          answer: 'We recommend consulting your doctor before starting any exercise program. Our coaches are not doctors, but they will adapt exercises to your abilities and limitations.',
        },
        {
          question: 'Can I cancel or reschedule a session?',
          answer: 'Yes, with 24 hours\' notice, you can cancel or reschedule sessions as needed.',
        },
      ],
    },
    cta: {
      fr: 'Démarrer Déclic Durable',
      en: 'Start Déclic Durable',
    },
    goalOptions: {
      fr: [
        'Améliorer ma santé générale',
        'Gagner en mobilité et énergie',
        'Perdre du poids progressivement',
        'Développer une routine d\'exercice durable',
        'Retrouver confiance en moi',
      ],
      en: [
        'Improve my overall health',
        'Gain mobility and energy',
        'Lose weight progressively',
        'Develop a sustainable exercise routine',
        'Regain self-confidence',
      ],
    },
  },
  'systeme-apex': {
    slug: 'systeme-apex',
    title: 'Le Système Apex',
    audience: 'professionnels occupés',
    heroTitle: {
      fr: 'Performance maximale en un minimum de temps avec le Système Apex',
      en: 'Maximum Performance in Minimum Time with the Apex System',
    },
    heroSubtitle: {
      fr: 'Coaching intensif et ultra-efficace pour professionnels exigeants. Gagnez en énergie, en posture et en concentration. 20-30 min par session, depuis votre bureau ou domicile.',
      en: 'Intensive and ultra-efficient coaching for demanding professionals. Gain energy, posture, and focus. 20-30 min per session, from your office or home.',
    },
    primaryBenefits: {
      fr: [
        {
          title: 'Gain de temps maximal',
          description: 'Sessions de 20-30 min ultra-ciblées qui s\'intègrent dans votre agenda chargé',
          icon: '⚡',
        },
        {
          title: 'Performance optimisée',
          description: 'Boostez votre énergie, concentration et productivité grâce à un corps en meilleure forme',
          icon: '🎯',
        },
        {
          title: 'Posture & bien-être',
          description: 'Corrigez les maux de dos et tensions liés aux longues heures assis',
          icon: '🧘',
        },
        {
          title: 'Flexibilité totale',
          description: 'Planifiez vos séances tôt le matin, pause déjeuner ou fin de journée',
          icon: '📅',
        },
      ],
      en: [
        {
          title: 'Maximum Time Savings',
          description: 'Ultra-targeted 20-30 min sessions that fit into your busy schedule',
          icon: '⚡',
        },
        {
          title: 'Optimized Performance',
          description: 'Boost your energy, focus, and productivity with a fitter body',
          icon: '🎯',
        },
        {
          title: 'Posture & Wellness',
          description: 'Correct back pain and tension from long hours sitting',
          icon: '🧘',
        },
        {
          title: 'Total Flexibility',
          description: 'Schedule sessions early morning, lunch break, or end of day',
          icon: '📅',
        },
      ],
    },
    whatYouGet: {
      fr: [
        'Micro-sessions intensives de 20-30 min maximum',
        'Programme axé sur l\'efficacité et l\'énergie',
        'Exercices de mobilité pour compenser les heures assis',
        'Coaching en visio Google Meet - zéro déplacement',
        'Planification flexible selon vos contraintes',
        'Techniques de récupération express pour gérer le stress',
      ],
      en: [
        'Intensive micro-sessions of 20-30 min maximum',
        'Program focused on efficiency and energy',
        'Mobility exercises to compensate for hours sitting',
        'Coaching via Google Meet - zero travel',
        'Flexible scheduling according to your constraints',
        'Express recovery techniques to manage stress',
      ],
    },
    howItWorks: {
      fr: [
        {
          step: '1',
          title: 'Remplissez le formulaire',
          description: 'Indiquez vos objectifs et créneaux disponibles (même 6h du matin ou 20h).',
        },
        {
          step: '2',
          title: 'Attribution de votre coach',
          description: 'Un coach performant qui respecte votre emploi du temps et vos ambitions.',
        },
        {
          step: '3',
          title: 'Sessions ultra-ciblées',
          description: 'Chaque séance compte : résultats maximaux, temps minimal.',
        },
      ],
      en: [
        {
          step: '1',
          title: 'Fill Out the Form',
          description: 'Indicate your goals and available slots (even 6 AM or 8 PM).',
        },
        {
          step: '2',
          title: 'Coach Assignment',
          description: 'A high-performing coach who respects your schedule and ambitions.',
        },
        {
          step: '3',
          title: 'Ultra-Targeted Sessions',
          description: 'Every session counts: maximum results, minimum time.',
        },
      ],
    },
    programDetails: {
      fr: {
        objectives: [
          'Maximiser votre niveau d\'énergie quotidien',
          'Améliorer votre posture et réduire les maux de dos',
          'Développer force et endurance sans passer des heures à la salle',
          'Optimiser votre récupération et gestion du stress',
          'Intégrer le mouvement dans votre routine pro sans sacrifier du temps',
        ],
        duration: '6 à 12 semaines pour des résultats mesurables',
        frequency: '3 à 4 micro-sessions par semaine (20-30 min)',
      },
      en: {
        objectives: [
          'Maximize your daily energy level',
          'Improve your posture and reduce back pain',
          'Develop strength and endurance without spending hours at the gym',
          'Optimize your recovery and stress management',
          'Integrate movement into your work routine without sacrificing time',
        ],
        duration: '6 to 12 weeks for measurable results',
        frequency: '3 to 4 micro-sessions per week (20-30 min)',
      },
    },
    testimonials: {
      fr: [
        {
          name: 'Alexandre R.',
          age: '38 ans, CEO',
          text: 'En 20 minutes avant mes réunions, je gagne l\'énergie et la clarté mentale pour toute la journée. Le Système Apex est un game-changer pour ma performance.',
          rating: 5,
        },
        {
          name: 'Sophie M.',
          age: '42 ans, Avocate',
          text: 'J\'étais sceptique au début, mais ces sessions courtes sont incroyablement efficaces. Mon dos ne me fait plus mal et je suis bien plus concentrée.',
          rating: 5,
        },
      ],
      en: [
        {
          name: 'Alexandre R.',
          age: '38, CEO',
          text: 'In 20 minutes before my meetings, I gain the energy and mental clarity for the whole day. The Apex System is a game-changer for my performance.',
          rating: 5,
        },
        {
          name: 'Sophie M.',
          age: '42, Lawyer',
          text: 'I was skeptical at first, but these short sessions are incredibly effective. My back doesn\'t hurt anymore and I\'m much more focused.',
          rating: 5,
        },
      ],
    },
    faq: {
      fr: [
        {
          question: '20-30 minutes, c\'est vraiment efficace ?',
          answer: 'Oui ! Nos sessions sont conçues pour une efficacité maximale avec des exercices ciblés haute intensité. Vous obtiendrez plus de résultats en 25 min qu\'avec une heure de salle traditionnelle.',
        },
        {
          question: 'Puis-je faire les sessions depuis mon bureau ?',
          answer: 'Absolument. Les exercices peuvent être adaptés pour un espace limité et ne nécessitent pas de matériel encombrant. Certains clients font leurs sessions en tenue de travail !',
        },
        {
          question: 'Que se passe-t-il si j\'ai un imprévu ?',
          answer: 'Nous comprenons les imprévus professionnels. Vous pouvez reprogrammer avec un simple message, et nous trouvons un créneau qui vous convient.',
        },
        {
          question: 'Dois-je être en forme pour commencer ?',
          answer: 'Non, nous adaptons l\'intensité à votre niveau actuel. Le programme monte progressivement en intensité selon vos progrès.',
        },
      ],
      en: [
        {
          question: 'Are 20-30 minutes really effective?',
          answer: 'Yes! Our sessions are designed for maximum efficiency with targeted high-intensity exercises. You\'ll get more results in 25 min than with a traditional hour at the gym.',
        },
        {
          question: 'Can I do sessions from my office?',
          answer: 'Absolutely. Exercises can be adapted for limited space and don\'t require bulky equipment. Some clients do their sessions in work attire!',
        },
        {
          question: 'What if something unexpected comes up?',
          answer: 'We understand professional emergencies. You can reschedule with a simple message, and we\'ll find a slot that works for you.',
        },
        {
          question: 'Do I need to be fit to start?',
          answer: 'No, we adapt the intensity to your current level. The program progressively increases in intensity according to your progress.',
        },
      ],
    },
    cta: {
      fr: 'Activer le Système Apex',
      en: 'Activate the Apex System',
    },
    goalOptions: {
      fr: [
        'Maximiser mon énergie et productivité',
        'Corriger ma posture et maux de dos',
        'Développer force et endurance rapidement',
        'Mieux gérer mon stress',
        'Intégrer le sport dans mon agenda chargé',
      ],
      en: [
        'Maximize my energy and productivity',
        'Correct my posture and back pain',
        'Develop strength and endurance quickly',
        'Better manage my stress',
        'Integrate sport into my busy schedule',
      ],
    },
  },
  'elan-senior': {
    slug: 'elan-senior',
    title: 'Élan Senior',
    audience: 'personnes âgées',
    heroTitle: {
      fr: 'Restez actif, autonome et en forme avec Élan Senior',
      en: 'Stay Active, Independent, and Fit with Élan Senior',
    },
    heroSubtitle: {
      fr: 'Un programme doux et progressif pour préserver votre mobilité, équilibre et autonomie. Coaching bienveillant en visio, à votre rythme, depuis le confort de votre domicile.',
      en: 'A gentle and progressive program to preserve your mobility, balance, and independence. Compassionate video coaching, at your pace, from the comfort of your home.',
    },
    primaryBenefits: {
      fr: [
        {
          title: 'Mobilité & équilibre',
          description: 'Prévenez les chutes et maintenez votre autonomie avec des exercices adaptés',
          icon: '🚶',
        },
        {
          title: 'Rythme respectueux',
          description: 'Progressez à votre vitesse, sans pression, avec un coach patient et à l\'écoute',
          icon: '🕐',
        },
        {
          title: 'Prévention santé',
          description: 'Renforcez votre cœur, vos os et vos muscles pour rester en forme longtemps',
          icon: '❤️',
        },
        {
          title: 'Confort & sécurité',
          description: 'Coaching en visio depuis chez vous, sans déplacement ni risque',
          icon: '🏡',
        },
      ],
      en: [
        {
          title: 'Mobility & Balance',
          description: 'Prevent falls and maintain your independence with adapted exercises',
          icon: '🚶',
        },
        {
          title: 'Respectful Pace',
          description: 'Progress at your speed, without pressure, with a patient and attentive coach',
          icon: '🕐',
        },
        {
          title: 'Health Prevention',
          description: 'Strengthen your heart, bones, and muscles to stay fit longer',
          icon: '❤️',
        },
        {
          title: 'Comfort & Safety',
          description: 'Video coaching from home, no travel or risk',
          icon: '🏡',
        },
      ],
    },
    whatYouGet: {
      fr: [
        'Séances douces et progressives adaptées aux seniors',
        'Exercices d\'équilibre et prévention des chutes',
        'Renforcement musculaire en douceur',
        'Amélioration de la mobilité articulaire',
        'Coach patient et à l\'écoute de vos besoins',
        'Suivi personnalisé et encouragements réguliers',
      ],
      en: [
        'Gentle and progressive sessions adapted for seniors',
        'Balance exercises and fall prevention',
        'Gentle muscle strengthening',
        'Improved joint mobility',
        'Patient coach attentive to your needs',
        'Personalized follow-up and regular encouragement',
      ],
    },
    howItWorks: {
      fr: [
        {
          step: '1',
          title: 'Inscription simple',
          description: 'Remplissez le formulaire ou faites-vous aider par un proche.',
        },
        {
          step: '2',
          title: 'Rencontre avec votre coach',
          description: 'Un coach bienveillant qui parle votre langue et comprend vos besoins.',
        },
        {
          step: '3',
          title: 'Sessions en douceur',
          description: 'Commencez à bouger en toute sécurité, à votre rythme.',
        },
      ],
      en: [
        {
          step: '1',
          title: 'Simple Registration',
          description: 'Fill out the form or get help from a loved one.',
        },
        {
          step: '2',
          title: 'Meet Your Coach',
          description: 'A caring coach who speaks your language and understands your needs.',
        },
        {
          step: '3',
          title: 'Gentle Sessions',
          description: 'Start moving safely, at your own pace.',
        },
      ],
    },
    programDetails: {
      fr: {
        objectives: [
          'Améliorer votre équilibre et prévenir les chutes',
          'Maintenir et développer votre mobilité articulaire',
          'Renforcer vos muscles en douceur',
          'Préserver votre autonomie au quotidien',
          'Améliorer votre bien-être général et moral',
        ],
        duration: 'Programme continu recommandé pour maintenir les bénéfices',
        frequency: '2 à 3 séances par semaine (30-40 min)',
      },
      en: {
        objectives: [
          'Improve your balance and prevent falls',
          'Maintain and develop your joint mobility',
          'Strengthen your muscles gently',
          'Preserve your daily independence',
          'Improve your overall well-being and morale',
        ],
        duration: 'Ongoing program recommended to maintain benefits',
        frequency: '2 to 3 sessions per week (30-40 min)',
      },
    },
    testimonials: {
      fr: [
        {
          name: 'Michèle P.',
          age: '72 ans',
          text: 'Grâce à Élan Senior, je me sens plus stable sur mes jambes et j\'ai beaucoup moins peur de tomber. Mon coach est adorable et me pousse juste ce qu\'il faut.',
          rating: 5,
        },
        {
          name: 'Robert G.',
          age: '68 ans',
          text: 'C\'est tellement pratique de faire mes exercices depuis mon salon ! Je n\'aurais jamais pu me déplacer dans une salle. Et je vois vraiment la différence.',
          rating: 5,
        },
      ],
      en: [
        {
          name: 'Michèle P.',
          age: '72 years old',
          text: 'Thanks to Élan Senior, I feel more stable on my legs and I\'m much less afraid of falling. My coach is wonderful and pushes me just enough.',
          rating: 5,
        },
        {
          name: 'Robert G.',
          age: '68 years old',
          text: 'It\'s so convenient to do my exercises from my living room! I could never have traveled to a gym. And I really see the difference.',
          rating: 5,
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Est-ce que le programme est adapté à mon âge ?',
          answer: 'Oui, nos coachs sont formés spécifiquement pour travailler avec les seniors. Chaque exercice est adapté à vos capacités actuelles, en toute sécurité.',
        },
        {
          question: 'J\'ai des problèmes d\'arthrose, puis-je quand même participer ?',
          answer: 'Les exercices seront adaptés à votre condition. Nous vous recommandons de consulter votre médecin avant de commencer et d\'informer votre coach de vos limitations.',
        },
        {
          question: 'Comment fonctionne la visio ? C\'est compliqué ?',
          answer: 'C\'est très simple ! Nous utilisons Google Meet. Si vous avez besoin d\'aide pour configurer, nous pouvons vous guider ou demander à un proche de vous aider pour la première fois.',
        },
        {
          question: 'Ai-je besoin de matériel spécial ?',
          answer: 'Non, les exercices utilisent principalement le poids de votre corps et des objets du quotidien (chaise, bouteilles d\'eau, etc.). Rien d\'encombrant ou coûteux.',
        },
      ],
      en: [
        {
          question: 'Is the program suitable for my age?',
          answer: 'Yes, our coaches are specifically trained to work with seniors. Each exercise is adapted to your current abilities, safely.',
        },
        {
          question: 'I have arthritis problems, can I still participate?',
          answer: 'Exercises will be adapted to your condition. We recommend consulting your doctor before starting and informing your coach of your limitations.',
        },
        {
          question: 'How does video work? Is it complicated?',
          answer: 'It\'s very simple! We use Google Meet. If you need help setting it up, we can guide you or ask a loved one to help you the first time.',
        },
        {
          question: 'Do I need special equipment?',
          answer: 'No, exercises mainly use your body weight and everyday objects (chair, water bottles, etc.). Nothing bulky or expensive.',
        },
      ],
    },
    cta: {
      fr: 'Commencer Élan Senior',
      en: 'Start Élan Senior',
    },
    goalOptions: {
      fr: [
        'Améliorer mon équilibre',
        'Maintenir ma mobilité',
        'Prévenir les chutes',
        'Rester autonome le plus longtemps possible',
        'Rester actif et en forme',
      ],
      en: [
        'Improve my balance',
        'Maintain my mobility',
        'Prevent falls',
        'Stay independent as long as possible',
        'Stay active and fit',
      ],
    },
  },
  renaissance: {
    slug: 'renaissance',
    title: 'Renaissance',
    audience: 'femmes post-partum',
    heroTitle: {
      fr: 'Retrouvez votre corps et votre énergie avec Renaissance',
      en: 'Reclaim Your Body and Energy with Renaissance',
    },
    heroSubtitle: {
      fr: 'Un accompagnement doux et sécuritaire pour jeunes mamans. Renforcez votre périnée, retrouvez votre force, et prenez soin de vous. Coaching en visio depuis chez vous, même avec bébé à côté.',
      en: 'Gentle and safe support for new moms. Strengthen your pelvic floor, regain your strength, and take care of yourself. Video coaching from home, even with baby nearby.',
    },
    primaryBenefits: {
      fr: [
        {
          title: 'Retour progressif & sécuritaire',
          description: 'Respectez votre corps avec un programme adapté au post-partum',
          icon: '🌸',
        },
        {
          title: 'Renforcement du périnée',
          description: 'Exercices spécifiques pour retrouver votre force profonde en toute sécurité',
          icon: '💪',
        },
        {
          title: 'Écoute & bienveillance',
          description: 'Un coach qui comprend la réalité des jeunes mamans et la charge mentale',
          icon: '💝',
        },
        {
          title: 'Depuis chez vous',
          description: 'Sessions flexibles en visio, compatibles avec le rythme de bébé',
          icon: '🏠',
        },
      ],
      en: [
        {
          title: 'Progressive & Safe Return',
          description: 'Respect your body with a program adapted to postpartum',
          icon: '🌸',
        },
        {
          title: 'Pelvic Floor Strengthening',
          description: 'Specific exercises to regain your deep strength safely',
          icon: '💪',
        },
        {
          title: 'Listening & Compassion',
          description: 'A coach who understands the reality of new moms and mental load',
          icon: '💝',
        },
        {
          title: 'From Home',
          description: 'Flexible video sessions, compatible with baby\'s rhythm',
          icon: '🏠',
        },
      ],
    },
    whatYouGet: {
      fr: [
        'Programme post-partum sécuritaire et progressif',
        'Renforcement du périnée et de la sangle abdominale',
        'Exercices adaptés au diastasis si nécessaire',
        'Récupération énergétique et gestion de la fatigue',
        'Sessions flexibles qui s\'adaptent au rythme de bébé',
        'Coach formée aux spécificités du post-partum',
      ],
      en: [
        'Safe and progressive postpartum program',
        'Pelvic floor and core strengthening',
        'Exercises adapted to diastasis if needed',
        'Energy recovery and fatigue management',
        'Flexible sessions that adapt to baby\'s rhythm',
        'Coach trained in postpartum specificities',
      ],
    },
    howItWorks: {
      fr: [
        {
          step: '1',
          title: 'Inscription rapide',
          description: 'Parlez-nous de votre situation et vos objectifs (5 minutes max).',
        },
        {
          step: '2',
          title: 'Coach dédiée',
          description: 'Une coach qui comprend le post-partum et parle votre langue.',
        },
        {
          step: '3',
          title: 'Reprise en douceur',
          description: 'Première séance pour évaluer où vous en êtes et créer votre programme.',
        },
      ],
      en: [
        {
          step: '1',
          title: 'Quick Registration',
          description: 'Tell us about your situation and goals (5 min max).',
        },
        {
          step: '2',
          title: 'Dedicated Coach',
          description: 'A coach who understands postpartum and speaks your language.',
        },
        {
          step: '3',
          title: 'Gentle Recovery',
          description: 'First session to assess where you are and create your program.',
        },
      ],
    },
    programDetails: {
      fr: {
        objectives: [
          'Renforcer votre périnée en toute sécurité',
          'Récupérer votre force abdominale et posturale',
          'Gérer et réduire le diastasis si présent',
          'Retrouver votre énergie et votre bien-être',
          'Prendre du temps pour vous sans culpabilité',
        ],
        duration: '3 à 6 mois pour une récupération complète (après accord médical)',
        frequency: '2 à 3 séances par semaine (25-35 min)',
      },
      en: {
        objectives: [
          'Strengthen your pelvic floor safely',
          'Recover your core and postural strength',
          'Manage and reduce diastasis if present',
          'Regain your energy and well-being',
          'Take time for yourself without guilt',
        ],
        duration: '3 to 6 months for complete recovery (after medical clearance)',
        frequency: '2 to 3 sessions per week (25-35 min)',
      },
    },
    testimonials: {
      fr: [
        {
          name: 'Laura B.',
          age: '32 ans, maman de 2',
          text: 'Renaissance m\'a permis de me reconnecter à mon corps après ma grossesse. Ma coach est incroyablement compréhensive et les séances courtes sont parfaites avec les enfants.',
          rating: 5,
        },
        {
          name: 'Émilie T.',
          age: '29 ans, jeune maman',
          text: 'J\'avais peur de reprendre le sport après l\'accouchement. Les exercices sont parfaitement adaptés et je me sens déjà plus forte. Et si bébé pleure, on fait une pause, zéro stress !',
          rating: 5,
        },
      ],
      en: [
        {
          name: 'Laura B.',
          age: '32, mom of 2',
          text: 'Renaissance helped me reconnect with my body after pregnancy. My coach is incredibly understanding and the short sessions are perfect with kids.',
          rating: 5,
        },
        {
          name: 'Émilie T.',
          age: '29, new mom',
          text: 'I was afraid to resume exercise after childbirth. The exercises are perfectly adapted and I already feel stronger. And if baby cries, we pause, zero stress!',
          rating: 5,
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Combien de temps après l\'accouchement puis-je commencer ?',
          answer: 'Nous recommandons d\'attendre l\'accord de votre médecin ou sage-femme (généralement 6-8 semaines après l\'accouchement, plus si césarienne). La sécurité d\'abord !',
        },
        {
          question: 'Et si j\'ai un diastasis ou des problèmes de périnée ?',
          answer: 'Nos coachs sont formées pour adapter les exercices en cas de diastasis ou faiblesse du périnée. Nous travaillons en complémentarité avec votre kiné si vous en avez un.',
        },
        {
          question: 'Que se passe-t-il si bébé pleure pendant une séance ?',
          answer: 'Aucun problème ! Nous mettons pause, vous vous occupez de bébé, et on reprend quand vous êtes prête. Votre coach comprend parfaitement.',
        },
        {
          question: 'Ai-je besoin d\'équipement ?',
          answer: 'Très peu : un tapis de sol confortable et éventuellement un ballon si vous en avez. Tout est adaptable avec ce que vous avez à la maison.',
        },
      ],
      en: [
        {
          question: 'How long after childbirth can I start?',
          answer: 'We recommend waiting for clearance from your doctor or midwife (usually 6-8 weeks after birth, more if cesarean). Safety first!',
        },
        {
          question: 'What if I have diastasis or pelvic floor issues?',
          answer: 'Our coaches are trained to adapt exercises for diastasis or pelvic floor weakness. We work complementarily with your physio if you have one.',
        },
        {
          question: 'What happens if baby cries during a session?',
          answer: 'No problem! We pause, you take care of baby, and we resume when you\'re ready. Your coach understands perfectly.',
        },
        {
          question: 'Do I need equipment?',
          answer: 'Very little: a comfortable mat and possibly a ball if you have one. Everything is adaptable with what you have at home.',
        },
      ],
    },
    cta: {
      fr: 'Commencer Renaissance',
      en: 'Start Renaissance',
    },
    goalOptions: {
      fr: [
        'Renforcer mon périnée',
        'Récupérer ma force abdominale',
        'Gérer mon diastasis',
        'Retrouver mon énergie',
        'Prendre du temps pour moi',
      ],
      en: [
        'Strengthen my pelvic floor',
        'Recover my core strength',
        'Manage my diastasis',
        'Regain my energy',
        'Take time for myself',
      ],
    },
  },
};
