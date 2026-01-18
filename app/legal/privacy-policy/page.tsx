'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    const content = {
        fr: {
            title: 'Politique de Confidentialité',
            intro: 'Dernière mise à jour : Janvier 2026',
            sections: [
                {
                    title: '1. Collecte des données',
                    content: `Nous collectons les informations suivantes lorsque vous utilisez nos services :
• Nom et prénom
• Adresse email
• Langue préférée
• Objectifs de coaching
• Disponibilités

Ces données sont collectées avec votre consentement explicite lors de l'inscription.`
                },
                {
                    title: '2. Utilisation des données',
                    content: `Vos données sont utilisées pour :
• Fournir nos services de coaching personnalisé
• Communiquer avec vous concernant vos sessions
• Améliorer nos services
• Envoyer des communications marketing (avec votre consentement)

Nous ne vendons jamais vos données à des tiers.`
                },
                {
                    title: '3. Stockage et sécurité',
                    content: `Vos données sont stockées de manière sécurisée sur des serveurs protégés. Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos informations contre tout accès non autorisé, perte ou altération.`
                },
                {
                    title: '4. Vos droits',
                    content: `Conformément au RGPD, vous disposez des droits suivants :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement
• Droit à la portabilité
• Droit d'opposition

Pour exercer ces droits, contactez-nous à : contact@fitbuddy.ch`
                },
                {
                    title: '5. Cookies',
                    content: `Nous utilisons des cookies essentiels pour le fonctionnement du site. Aucun cookie publicitaire n'est utilisé sans votre consentement.`
                },
                {
                    title: '6. Modifications',
                    content: `Nous nous réservons le droit de modifier cette politique. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.`
                }
            ]
        },
        en: {
            title: 'Privacy Policy',
            intro: 'Last updated: January 2026',
            sections: [
                {
                    title: '1. Data Collection',
                    content: `We collect the following information when you use our services:
• First and last name
• Email address
• Preferred language
• Coaching goals
• Availability

This data is collected with your explicit consent during registration.`
                },
                {
                    title: '2. Data Usage',
                    content: `Your data is used to:
• Provide our personalized coaching services
• Communicate with you about your sessions
• Improve our services
• Send marketing communications (with your consent)

We never sell your data to third parties.`
                },
                {
                    title: '3. Storage and Security',
                    content: `Your data is stored securely on protected servers. We implement technical and organizational security measures to protect your information against unauthorized access, loss, or alteration.`
                },
                {
                    title: '4. Your Rights',
                    content: `In accordance with GDPR, you have the following rights:
• Right of access to your data
• Right to rectification
• Right to erasure
• Right to data portability
• Right to object

To exercise these rights, contact us at: contact@fitbuddy.ch`
                },
                {
                    title: '5. Cookies',
                    content: `We use essential cookies for site functionality. No advertising cookies are used without your consent.`
                },
                {
                    title: '6. Modifications',
                    content: `We reserve the right to modify this policy. Changes will be posted on this page with a new update date.`
                }
            ]
        }
    };

    const t = content[lang];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-gradient">
                        Fitbuddy
                    </Link>
                    <button
                        onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                        className="px-4 py-2 text-sm font-bold text-white bg-gradient-fitbuddy rounded-full shadow-lg hover:scale-105 transition-all"
                    >
                        {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
                <p className="text-gray-600 mb-8">{t.intro}</p>

                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
                    {t.sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{section.content}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-block text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        ← {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
                    </Link>
                </div>
            </main>
        </div>
    );
}
