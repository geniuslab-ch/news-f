interface Benefit {
    icon: string;
    title: string;
    description: string;
}

interface BenefitsProps {
    benefits: Benefit[];
    lang: 'fr' | 'en';
}

export default function Benefits({ benefits, lang }: BenefitsProps) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Three Key Benefits Cards - moved from Hero */}
                <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 backdrop-blur-md rounded-2xl p-8 shadow-xl card-hover border-2 border-primary-200">
                        <div className="text-6xl mb-4 text-center">📹</div>
                        <h3 className="font-bold text-gray-900 mb-3 text-center text-xl">
                            {lang === 'fr' ? '100% en visio' : '100% Online'}
                        </h3>
                        <p className="text-sm text-gray-700 text-center">
                            {lang === 'fr' ? 'Google Meet, depuis chez vous' : 'Google Meet, from your home'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 backdrop-blur-md rounded-2xl p-8 shadow-xl card-hover border-2 border-primary-200">
                        <div className="text-6xl mb-4 text-center">💪</div>
                        <h3 className="font-bold text-gray-900 mb-3 text-center text-xl">
                            {lang === 'fr' ? 'Coach dédié' : 'Dedicated Coach'}
                        </h3>
                        <p className="text-sm text-gray-700 text-center">
                            {lang === 'fr' ? 'Accompagnement personnalisé' : 'Personalized support'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 backdrop-blur-md rounded-2xl p-8 shadow-xl card-hover border-2 border-primary-200">
                        <div className="text-6xl mb-4 text-center">🌍</div>
                        <h3 className="font-bold text-gray-900 mb-3 text-center text-xl">
                            {lang === 'fr' ? 'Multilingue' : 'Multilingual'}
                        </h3>
                        <p className="text-sm text-gray-700 text-center">
                            FR, EN
                        </p>
                    </div>
                </div>

                {/* Original Benefits Section */}
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    {lang === 'fr' ? 'Pourquoi Fitbuddy ?' : 'Why Fitbuddy?'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 card-hover border-2 border-primary-100 hover:border-primary-400"
                        >
                            <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
