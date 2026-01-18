'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MentionsLegalesPage() {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    const content = {
        fr: {
            title: 'Mentions Légales',
            company: 'Fitbuddy',
            companyTitle: 'Informations sur l\'entreprise',
            companyInfo: `
Fitbuddy
Coaching sportif et santé en ligne
Suisse

Email : contact@fitbuddy.ch
      `,
            responsibleTitle: 'Responsable de la publication',
            responsibleInfo: 'Fitbuddy',
            hostingTitle: 'Hébergement',
            hostingInfo: `
Ce site est hébergé par :
Vercel Inc.
340 S Lemon Ave #4133
Walnut, CA 91789, USA
      `,
            dataTitle: 'Protection des données',
            dataInfo: 'Pour toute information concernant la collecte et le traitement de vos données personnelles, veuillez consulter notre Politique de confidentialité.',
            intellectualTitle: 'Propriété intellectuelle',
            intellectualInfo: 'L\'ensemble de ce site (structure, textes, graphismes, logos) est la propriété exclusive de Fitbuddy. Toute reproduction, même partielle, est interdite sans autorisation préalable.',
        },
        en: {
            title: 'Legal Notice',
            company: 'Fitbuddy',
            companyTitle: 'Company Information',
            companyInfo: `
Fitbuddy
Online Sports and Health Coaching
Switzerland

Email: contact@fitbuddy.ch
      `,
            responsibleTitle: 'Publication Manager',
            responsibleInfo: 'Fitbuddy',
            hostingTitle: 'Hosting',
            hostingInfo: `
This website is hosted by:
Vercel Inc.
340 S Lemon Ave #4133
Walnut, CA 91789, USA
      `,
            dataTitle: 'Data Protection',
            dataInfo: 'For information about the collection and processing of your personal data, please consult our Privacy Policy.',
            intellectualTitle: 'Intellectual Property',
            intellectualInfo: 'All content on this site (structure, text, graphics, logos) is the exclusive property of Fitbuddy. Any reproduction, even partial, is prohibited without prior authorization.',
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
                <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.title}</h1>

                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.companyTitle}</h2>
                        <p className="text-gray-700 whitespace-pre-line">{t.companyInfo}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.responsibleTitle}</h2>
                        <p className="text-gray-700">{t.responsibleInfo}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.hostingTitle}</h2>
                        <p className="text-gray-700 whitespace-pre-line">{t.hostingInfo}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.dataTitle}</h2>
                        <p className="text-gray-700">
                            {t.dataInfo}{' '}
                            <Link href="/legal/privacy-policy" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Privacy Policy
                            </Link>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.intellectualTitle}</h2>
                        <p className="text-gray-700">{t.intellectualInfo}</p>
                    </section>
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
