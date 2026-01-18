interface PricingTier {
    duration: string;
    price: number;
    sessions: number;
    savings?: string;
    featured?: boolean;
}

interface PricingSectionProps {
    lang: 'fr' | 'en';
}

export default function PricingSection({ lang }: PricingSectionProps) {
    const content = {
        fr: {
            title: 'Choisissez votre forfait',
            subtitle: '8× moins cher qu\'un coach présentiel, mêmes résultats !',
            perMonth: '/mois',
            select: 'SÉLECTIONNER',
            features: {
                sessions: 'Sessions personnalisées 1:1',
                plan: 'Plan d\'entraînement sur mesure',
                support: 'Suivi & support',
                scheduling: 'Planification flexible'
            },
            bestValue: 'Meilleure valeur',
            popular: 'Le plus populaire'
        },
        en: {
            title: 'Choose Your Plan',
            subtitle: '8× cheaper than in-person coaching, same results!',
            perMonth: '/month',
            select: 'SELECT',
            features: {
                sessions: 'Personalized 1:1 Sessions',
                plan: 'Custom Workout Plan',
                support: 'Accountability & Support',
                scheduling: 'Flexible Scheduling'
            },
            bestValue: 'Best Value',
            popular: 'Most Popular'
        }
    };

    const t = content[lang];

    const tiers: PricingTier[] = [
        {
            duration: '1 Month Pass',
            price: 200,
            sessions: 8,
        },
        {
            duration: '3 Months Pass',
            price: 185,
            sessions: 24,
            savings: '7.5%',
            featured: true
        },
        {
            duration: '6 Months Pass',
            price: 175,
            sessions: 48,
            savings: '12.5%',
            featured: true
        },
        {
            duration: '12 Months Pass',
            price: 165,
            sessions: 98,
            savings: '17.5%',
            featured: true
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="pricing">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-gradient font-bold">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 transition-all duration-300 ${tier.featured
                                    ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-2xl scale-105 border-4 border-primary-300'
                                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl border-2 border-gray-200'
                                }`}
                        >
                            {/* Badge */}
                            {tier.savings && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                        {index === 3 ? t.bestValue : t.popular}
                                    </span>
                                </div>
                            )}

                            {/* Duration */}
                            <div className="mb-6 text-center">
                                <p className={`text-sm font-semibold uppercase tracking-wide ${tier.featured ? 'text-yellow-300' : 'text-gray-600'}`}>
                                    Per Month
                                </p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {tier.duration}
                                </h3>
                            </div>

                            {/* Price */}
                            <div className="mb-6 text-center">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-5xl font-extrabold">CHF {tier.price}</span>
                                    <span className={`ml-2 ${tier.featured ? 'text-yellow-100' : 'text-gray-600'}`}>
                                        {t.perMonth}
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2 text-xl">✓</span>
                                    <span className="text-sm">
                                        {tier.sessions} {t.features.sessions}
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2 text-xl">✓</span>
                                    <span className="text-sm">{t.features.plan}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2 text-xl">✓</span>
                                    <span className="text-sm">{t.features.support}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2 text-xl">✓</span>
                                    <span className="text-sm">{t.features.scheduling}</span>
                                </li>
                            </ul>

                            {/* CTA Button */}
                            <a
                                href="#signup"
                                className={`block w-full text-center font-bold py-4 px-6 rounded-xl transition-all duration-300 ${tier.featured
                                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-lg hover:shadow-xl'
                                        : 'bg-gradient-fitbuddy text-white hover:scale-105 shadow-md'
                                    }`}
                            >
                                {t.select} ≫
                            </a>
                        </div>
                    ))}
                </div>

                {/* Trust indicators */}
                <div className="mt-12 text-center text-gray-600">
                    <p className="text-sm">
                        {lang === 'fr'
                            ? '✓ Sans engagement • ✓ Annulation flexible • ✓ Garantie satisfait ou remboursé 30 jours'
                            : '✓ No commitment • ✓ Flexible cancellation • ✓ 30-day money-back guarantee'}
                    </p>
                </div>
            </div>
        </section>
    );
}
