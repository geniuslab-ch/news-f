
export const dashboardTranslations = {
    fr: {
        nav: {
            dashboard: "🏠 Dashboard",
            sessions: "📖 Sessions",
            recurring: "🔄 Récurrentes",
            settings: "⚙️ Paramètres",
            logout: "Déconnexion"
        },
        banner: {
            title: "Ajoutez votre numéro WhatsApp !",
            message: "Pour recevoir automatiquement les liens Google Meet de vos sessions de coaching par WhatsApp, veuillez ajouter votre numéro dans vos paramètres.",
            cta: "⚙️ Aller aux paramètres",
            later: "Plus tard"
        },
        welcome: {
            title: "Bienvenue {name} ! 👋",
            subtitle: "Prêt à continuer votre transformation ? Voici votre espace personnalisé.",
            loading: "Chargement de votre espace..."
        },
        nextSession: {
            title: "🎯 Prochaine session"
        },
        quickActions: {
            book: {
                title: "Réserver une session",
                subtitle: "Planifiez votre prochain coaching maintenant"
            },
            history: {
                title: "Historique complet",
                subtitle: "Consultez toutes vos sessions passées"
            }
        },
        noSessions: {
            title: "C'est le moment de commencer !",
            message: "Réservez votre première session et démarrez votre transformation dès aujourd'hui.",
            cta: "Réserver maintenant ✨"
        },
        recentSessions: {
            title: "⏱️ Sessions récentes",
            viewAll: "Voir tout"
        },
        package: {
            active: "Actif",
            sessions: "Sessions",
            remaining: "restantes",
            used: "utilisées",
            total: "totales",
            startDate: "Date de début",
            endDate: "Date de fin",
            manage: "⚙️ Gérer mon abonnement",
            manageSubtitle: "Annuler, modifier le paiement ou télécharger vos factures",
            expiring: "⚠️ Votre forfait expire bientôt. Pensez à le renouveler pour continuer votre progression !"
        }
    },
    en: {
        nav: {
            dashboard: "🏠 Dashboard",
            sessions: "📖 Sessions",
            recurring: "🔄 Recurring",
            settings: "⚙️ Settings",
            logout: "Logout"
        },
        banner: {
            title: "Add your WhatsApp number!",
            message: "To automatically receive Google Meet links for your coaching sessions via WhatsApp, please add your number in your settings.",
            cta: "⚙️ Go to settings",
            later: "Later"
        },
        welcome: {
            title: "Welcome {name}! 👋",
            subtitle: "Ready to continue your transformation? Here is your personalized space.",
            loading: "Loading your space..."
        },
        nextSession: {
            title: "🎯 Next session"
        },
        quickActions: {
            book: {
                title: "Book a session",
                subtitle: "Schedule your next coaching now"
            },
            history: {
                title: "Full history",
                subtitle: "View all your past sessions"
            }
        },
        noSessions: {
            title: "Time to get started!",
            message: "Book your first session and start your transformation today.",
            cta: "Book now ✨"
        },
        recentSessions: {
            title: "⏱️ Recent sessions",
            viewAll: "View all"
        },
        package: {
            active: "Active",
            sessions: "Sessions",
            remaining: "remaining",
            used: "used",
            total: "total",
            startDate: "Start Date",
            endDate: "End Date",
            manage: "⚙️ Manage subscription",
            manageSubtitle: "Cancel, update payment or download invoices",
            expiring: "⚠️ Your package is expiring soon. Remember to renew to continue your progress!"
        }
    }
};

export type Language = 'fr' | 'en';

export function getTranslation(lang: string | undefined | null) {
    const safeLang = (lang === 'en' ? 'en' : 'fr') as Language;
    return dashboardTranslations[safeLang];
}
