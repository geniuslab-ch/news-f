interface Benefit {
    title: string;
    description: string;
    icon: string;
}

interface BenefitsProps {
    benefits: Benefit[];
    lang: 'fr' | 'en';
}

export default function Benefits({ benefits, lang }: BenefitsProps) {
    const title = lang === 'fr' ? 'Pourquoi Fitbuddy ?' : 'Why Fitbuddy?';

    return (
        <section className="py-20 bg-gradient-brand-gradient-soft">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    {lang === 'fr' ? 'Pourquoi Fitbuddy ?' : 'Why Fitbuddy?'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 card-hover border-2 border-primary-100 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
