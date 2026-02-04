'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNav from '@/components/GlobalNav';

export default function EntreprisesPage() {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        phone: '',
        employees: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Send email via mailto
            const subject = `Demande de réunion de découverte - ${formData.company}`;
            const body = `
Nouvelle demande de réunion de découverte

Entreprise: ${formData.company}
Nom du contact: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone}
Nombre d'employés: ${formData.employees}

Message:
${formData.message}
            `.trim();

            window.location.href = `mailto:contact@fitbuddy.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setSubmitStatus('success');
            setFormData({ company: '', name: '', email: '', phone: '', employees: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            <GlobalNav />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                        Investissez dans la{' '}
                        <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            santé de vos employés
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        Fitbuddy accompagne les entreprises suisses dans l'amélioration de la santé et du bien-être de leurs collaborateurs.
                        Coaching personnalisé en visio, accessible depuis n'importe où.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#booking"
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                        >
                            Réunion de découverte
                        </a>
                        <a
                            href="#contact"
                            className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl border-2 border-amber-600"
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
                                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
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
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-amber-400"
                        >
                            <div className="text-5xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-gradient-to-r from-amber-600 to-yellow-600 py-20">
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
                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                            <span className="text-3xl">📧</span>
                            <div>
                                <div className="font-semibold text-gray-900">Email</div>
                                <a href="mailto:contact@fitbuddy.ch" className="text-amber-600 hover:text-amber-700">
                                    contact@fitbuddy.ch
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                            <span className="text-3xl">💬</span>
                            <div>
                                <div className="font-semibold text-gray-900">WhatsApp</div>
                                <a
                                    href="https://wa.me/41765928806?text=Bonjour,%20je%20suis%20intéressé%20par%20Fitbuddy%20pour%20mon%20entreprise"
                                    className="text-amber-600 hover:text-amber-700"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    +41 76 592 88 06
                                </a>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <a
                                href="#booking"
                                className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                            >
                                Planifier une réunion de découverte
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Form Section */}
            <section id="booking" className="container mx-auto px-4 py-20 bg-gradient-to-br from-white to-amber-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Planifiez votre réunion de découverte
                        </h2>
                        <p className="text-xl text-gray-700">
                            Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Nom de l'entreprise *
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                                    placeholder="Votre entreprise"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Nom et Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                                        placeholder="Jean Dupont"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email professionnel *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                                        placeholder="jean.dupont@entreprise.ch"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                                        placeholder="+41 76 592 88 06"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="employees" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Nombre d'employés
                                    </label>
                                    <select
                                        id="employees"
                                        name="employees"
                                        value={formData.employees}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="1-10">1-10 employés</option>
                                        <option value="11-50">11-50 employés</option>
                                        <option value="51-200">51-200 employés</option>
                                        <option value="201-500">201-500 employés</option>
                                        <option value="500+">500+ employés</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Message (optionnel)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none resize-none"
                                    placeholder="Parlez-nous de vos besoins et objectifs..."
                                />
                            </div>

                            {submitStatus === 'success' && (
                                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800">
                                    ✓ Merci ! Votre demande a été envoyée. Nous vous contacterons très prochainement.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800">
                                    Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Demander une réunion de découverte'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-gray-900 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 mb-4">
                        Rejoignez les entreprises qui font confiance à Fitbuddy
                    </p>
                    <Link href="/" className="text-amber-400 hover:text-amber-300 font-semibold">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </section>
        </div>
    );
}
