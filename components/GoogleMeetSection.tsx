interface GoogleMeetSectionProps {
    lang: 'fr' | 'en';
}

export default function GoogleMeetSection({ lang }: GoogleMeetSectionProps) {
    const content = {
        fr: {
            title: 'Coaching en visio Google Meet',
            subtitle: 'Simple, sécurisé, et accessible de partout',
            benefits: [
                {
                    icon: '🔒',
                    title: 'Sécurisé',
                    description: 'Connexion chiffrée et confidentielle',
                },
                {
                    icon: '💻',
                    title: 'Facile',
                    description: 'Un simple lien, aucune installation complexe',
                },
                {
                    icon: '🏋️',
                    title: 'Sans matériel',
                    description: 'Exercices adaptés à votre espace et équipement',
                },
                {
                    icon: '📱',
                    title: 'Multi-appareils',
                    description: 'Ordinateur, tablette ou smartphone',
                },
            ],
        },
        en: {
            title: 'Google Meet Video Coaching',
            subtitle: 'Simple, secure, and accessible from anywhere',
            benefits: [
                {
                    icon: '🔒',
                    title: 'Secure',
                    description: 'Encrypted and confidential connection',
                },
                {
                    icon: '💻',
                    title: 'Easy',
                    description: 'Just a link, no complex installation',
                },
                {
                    icon: '🏋️',
                    title: 'No Equipment Needed',
                    description: 'Exercises adapted to your space and equipment',
                },
                {
                    icon: '📱',
                    title: 'Multi-Device',
                    description: 'Computer, tablet, or smartphone',
                },
            ],
        },
    };

    const t = content[lang];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
                    <p className="text-lg text-gray-600">{t.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {t.benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center"
                        >
                            <div className="text-4xl mb-3">{benefit.icon}</div>
                            <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
