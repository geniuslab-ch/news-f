// Stripe Products Configuration
// After creating products in Stripe Dashboard, update the priceId values here

export type PackageType = '1month' | '3months' | '6months' | '12months';

export interface StripeProduct {
    priceId: string;
    name: string;
    price: number; // CHF
    sessions: number;
    duration: number; // days
    description: string;
    features: string[];
    recommended?: boolean;
    badge?: string;
    monthlyPrice?: number;
    paymentLink?: string;
}

export const STRIPE_PRODUCTS: Record<PackageType, StripeProduct> = {
    '1month': {
        priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_1MONTH || 'price_1month_placeholder').trim(),
        name: 'Formule 1 mois',
        price: 200,
        sessions: 8,
        duration: 30,
        description: '2 sessions par semaine pour démarrer',
        features: [
            '8 sessions de coaching (45 min)',
            'Suivi personnalisé',
            'Accès Google Meet',
            'Support email',
        ],
    },
    '3months': {
        priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_3MONTHS || 'price_3months_placeholder').trim(),
        name: 'Formule 3 mois',
        price: 555,
        sessions: 24,
        duration: 90,
        description: 'Idéal pour créer de bonnes habitudes',
        features: [
            '24 sessions de coaching (45 min)',
            '2 sessions par semaine',
            'Plan nutrition inclus',
            'Suivi hebdomadaire',
            'Support prioritaire',
        ],
        recommended: true,
        badge: 'Populaire',
        monthlyPrice: 185, // 555 / 3
        paymentLink: 'https://buy.stripe.com/14A5kCbp27HHcM642NcAo05',
    },
    '6months': {
        priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_6MONTHS || 'price_6months_placeholder').trim(),
        name: 'Formule 6 mois',
        price: 1050,
        sessions: 48,
        duration: 180,
        description: 'Transformation durable garantie',
        features: [
            '48 sessions de coaching (45 min)',
            '2 sessions par semaine',
            'Plan nutrition personnalisé',
            'Bilan mensuel performance',
            'Accès communauté privée',
            'Support 7j/7',
        ],
        badge: 'Meilleure valeur',
        monthlyPrice: 175, // 1050 / 6
        paymentLink: 'https://buy.stripe.com/fZucN464IbXXaDY1UFcAo06',
    },
    '12months': {
        priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_12MONTHS || 'price_12months_placeholder').trim(),
        name: 'Formule 12 mois',
        price: 1980,
        sessions: 98,
        duration: 365,
        description: 'Engagement annuel pour résultats exceptionnels',
        features: [
            '98 sessions de coaching (45 min)',
            '2 sessions par semaine',
            'Coaching nutrition avancé',
            'Bilan trimestriel complet',
            'Programme sur-mesure',
            'Communauté VIP',
            'Support illimité',
        ],
        monthlyPrice: 165, // 1980 / 12
        paymentLink: 'https://buy.stripe.com/3cI8wO9gUgedh2mdDncAo07',
    },
};

// Helper to get product by type
export function getProduct(packageType: PackageType): StripeProduct {
    return STRIPE_PRODUCTS[packageType];
}

// Helper to get all products as array
export function getAllProducts(): StripeProduct[] {
    return Object.values(STRIPE_PRODUCTS);
}

// Calculate price per session
export function getPricePerSession(packageType: PackageType): number {
    const product = STRIPE_PRODUCTS[packageType];
    return Math.round((product.price / product.sessions) * 100) / 100;
}
