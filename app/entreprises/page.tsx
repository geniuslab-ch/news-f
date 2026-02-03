import Link from 'next/link';
import GlobalNav from '@/components/GlobalNav';

export const metadata = {
    title: 'Fitbuddy Entreprises - Programme de Bien-être pour vos Employés',
    description: 'Améliorez la santé et le bien-être de vos employés avec Fitbuddy. Coaching sport et santé en visio pour entreprises suisses.',
};

export default function EntreprisesPage() {
    const benefits = [
        {
            icon: '💪',
            title: 'Amélioration de la Santé',
            description: 'Réduction de l\'absentéisme et amélioration de la santé globale de vos équipes',
        },
        {
            icon: '🚀',
            title: 'Performance Accrue',
            description: 'Employés plus énergiques, concentrés et productifs',
        },
        {
            icon: '😊',
            title: 'Bien-être au Travail',
            description: 'Amélioration du climat de travail et de la satisfaction employé',
        },
        {
            icon: '💰',
            title: 'ROI Mesurable',
            description: 'Retour sur investissement démontré en termes de santé et productivité',
        },
        {
            icon: '🎯',
            title: 'Programme Personnalisé',
            description: 'Solutions adaptées aux besoins spécifiques de votre entreprise',
        },
        {
            icon: '📊',
            title: 'Suivi et Rapports',
            description: 'Tableaux de bord et rapports d\'activité pour mesurer l\'impact',
        },
    ];

    const stats = [
        { value: '30%', label: 'Réduction de l\'absentéisme' },
        { value: '45%', label: 'Amélioration du bien-être' },
        { value: '25%', label: 'Augmentation de la productivité' },
        { value: '90%', label: 'Taux de satisfaction' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            <GlobalNav />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                        Investissez dans la{' '}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            santé de vos employés
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        Fitbuddy accompagne les entreprises suisses dans l'amélioration de la santé et du bien-être de leurs collaborateurs.
                        Coaching personnalisé en visio, accessible depuis n'importe où.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:contact@fitbuddy.ch?subject=Demande d'information - Fitbuddy Entreprises"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                        >
                            Demander une démo
                        </a>
                        <a
                            href="#contact"
                            className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl border-2 border-emerald-600"
                        >
                            Contactez-nous
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Pourquoi choisir Fitbuddy pour votre entreprise ?
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Des solutions complètes pour le bien-être de vos collaborateurs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="text-5xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
                            Nos Services Entreprises
                        </h2>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 md:p-12 text-white">
                            <ul className="space-y-6 text-lg">
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <strong>Coaching Personnalisé en Visio</strong> - Séances individuelles ou en groupe adaptées aux besoins de vos employés
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <strong>Programmes sur Mesure</strong> - Du Déclic Durable au Système Apex, adaptés à votre secteur d'activité
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <strong>Plateforme de Suivi</strong> - Dashboard entreprise pour suivre la participation et l'engagement
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <strong>Webinaires Santé</strong> - Sessions de sensibilisation sur la nutrition, le stress, l'ergonomie
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <strong>Support Continu</strong> - Accompagnement par WhatsApp et email pour vos collaborateurs
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
                        Prêt à transformer votre entreprise ?
                    </h2>
                    <p className="text-xl text-gray-700 mb-8 text-center">
                        Contactez-nous pour discuter de vos besoins et obtenir une offre personnalisée
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                            <span className="text-3xl">📧</span>
                            <div>
                                <div className="font-semibold text-gray-900">Email</div>
                                <a href="mailto:contact@fitbuddy.ch" className="text-emerald-600 hover:text-emerald-700">
                                    contact@fitbuddy.ch
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                            <span className="text-3xl">💬</span>
                            <div>
                                <div className="font-semibold text-gray-900">WhatsApp</div>
                                <a
                                    href="https://wa.me/41787382881?text=Bonjour,%20je%20suis%20intéressé%20par%20Fitbuddy%20pour%20mon%20entreprise"
                                    className="text-emerald-600 hover:text-emerald-700"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    +41 78 738 28 81
                                </a>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <a
                                href="mailto:contact@fitbuddy.ch?subject=Demande d'information - Fitbuddy Entreprises"
                                className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                            >
                                Demander un devis gratuit
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-gray-900 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 mb-4">
                        Rejoignez les entreprises qui font confiance à Fitbuddy
                    </p>
                    <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </section>
        </div>
    );
}
