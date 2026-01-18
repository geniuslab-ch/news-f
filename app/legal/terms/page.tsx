'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TermsPage() {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    const content = {
        fr: {
            title: 'Conditions Générales de Vente',
            intro: 'Dernière mise à jour : Janvier 2026',
            sections: [
                {
                    title: '1. Objet',
                    content: `Les présentes Conditions Générales de Vente (CGV) régissent toutes les prestations de coaching en ligne proposées par Fitbuddy.

En vous inscrivant à nos services, vous acceptez sans réserve les présentes CGV.`
                },
                {
                    title: '2. Prestations',
                    content: `Fitbuddy propose des programmes de coaching sportif et santé en ligne via Google Meet, comprenant :
• Des sessions individuelles personnalisées
• Un plan d'entraînement sur mesure
• Un suivi régulier et un soutien continu
• Une planification flexible selon vos disponibilités

Les sessions durent 45 minutes et sont planifiées selon votre disponibilité.`
                },
                {
                    title: '3. Tarifs',
                    content: `Les tarifs en vigueur sont :
• 1 mois (8 sessions) : CHF 200/mois
• 3 mois (24 sessions) : CHF 185/mois
• 6 mois (48 sessions) : CHF 175/mois
• 12 mois (98 sessions) : CHF 165/mois

Les prix sont indiqués en francs suisses (CHF), toutes taxes comprises.

Les tarifs peuvent être modifiés à tout moment mais ne s'appliqueront pas aux abonnements en cours.`
                },
                {
                    title: '4. Paiement',
                    content: `Le paiement s'effectue mensuellement par carte bancaire ou virement bancaire.

Le premier paiement est dû à l'inscription. Les paiements suivants sont prélevés automatiquement chaque mois.

En cas de défaut de paiement, l'accès aux services sera suspendu jusqu'à régularisation.`
                },
                {
                    title: '5. Annulation et remboursement',
                    content: `Vous pouvez annuler votre abonnement à tout moment sans frais.

Garantie satisfait ou remboursé 30 jours :
Si vous n'êtes pas satisfait dans les 30 premiers jours, nous vous remboursons intégralement, sans condition.

Après 30 jours :
• Aucun remboursement pour le mois en cours
• L'annulation prend effet à la fin de la période de facturation en cours

Les sessions non utilisées ne sont pas remboursables.`
                },
                {
                    title: '6. Annulation de session',
                    content: `Vous pouvez annuler ou reporter une session jusqu'à 24h avant l'heure prévue. Les annulations tardives (moins de 24h) seront décomptées de votre forfait.`
                },
                {
                    title: '7. Responsabilité',
                    content: `Nos services de coaching ne remplacent pas un avis médical professionnel. Consultez votre médecin avant de commencer tout programme d'entraînement.

Fitbuddy ne peut être tenu responsable des blessures ou problèmes de santé résultant de la pratique d'exercices physiques.

En cas de condition médicale, il est de votre responsabilité d'en informer votre coach.`
                },
                {
                    title: '8. Propriété intellectuelle',
                    content: `Tous les contenus fournis (plans d'entraînement, guides, supports) restent la propriété de Fitbuddy et sont strictement réservés à votre usage personnel.

Toute reproduction ou diffusion est interdite sans autorisation écrite.`
                },
                {
                    title: '9. Modification des CGV',
                    content: `Fitbuddy se réserve le droit de modifier les présentes CGV à tout moment. Les modifications seront communiquées par email et publiées sur le site.`
                },
                {
                    title: '10. Droit applicable',
                    content: `Les présentes CGV sont soumises au droit suisse. Tout litige sera de la compétence exclusive des tribunaux suisses.`
                }
            ]
        },
        en: {
            title: 'Terms and Conditions',
            intro: 'Last updated: January 2026',
            sections: [
                {
                    title: '1. Purpose',
                    content: `These Terms and Conditions govern all online coaching services offered by Fitbuddy.

By signing up for our services, you accept these Terms and Conditions without reservation.`
                },
                {
                    title: '2. Services',
                    content: `Fitbuddy offers online sports and health coaching programs via Google Meet, including:
• Personalized individual sessions
• Custom workout plans
• Regular monitoring and ongoing support
• Flexible scheduling according to your availability

Sessions last 45 minutes and are scheduled according to your availability.`
                },
                {
                    title: '3. Pricing',
                    content: `Current rates are:
• 1 month (8 sessions): CHF 200/month
• 3 months (24 sessions): CHF 185/month
• 6 months (48 sessions): CHF 175/month
• 12 months (98 sessions): CHF 165/month

Prices are in Swiss Francs (CHF), all taxes included.

Pricing may change at any time but will not apply to subscriptions in progress.`
                },
                {
                    title: '4. Payment',
                    content: `Payment is made monthly by credit card or bank transfer.

The first payment is due upon registration. Subsequent payments are automatically charged each month.

In case of payment default, access to services will be suspended until regularization.`
                },
                {
                    title: '5. Cancellation and Refund',
                    content: `You can cancel your subscription at any time without fees.

30-day money-back guarantee:
If you're not satisfied within the first 30 days, we'll refund you in full, no questions asked.

After 30 days:
• No refund for the current month
• Cancellation takes effect at the end of the current billing period

Unused sessions are non-refundable.`
                },
                {
                    title: '6. Session Cancellation',
                    content: `You can cancel or reschedule a session up to 24 hours before the scheduled time. Late cancellations (less than 24h) will be deducted from your package.`
                },
                {
                    title: '7. Liability',
                    content: `Our coaching services do not replace professional medical advice. Consult your doctor before starting any training program.

Fitbuddy cannot be held responsible for injuries or health problems resulting from physical exercise.

If you have a medical condition, it is your responsibility to inform your coach.`
                },
                {
                    title: '8. Intellectual Property',
                    content: `All provided content (workout plans, guides, materials) remains the property of Fitbuddy and is strictly for your personal use.

Any reproduction or distribution is prohibited without written authorization.`
                },
                {
                    title: '9. T&C Modifications',
                    content: `Fitbuddy reserves the right to modify these Terms and Conditions at any time. Changes will be communicated by email and published on the website.`
                },
                {
                    title: '10. Applicable Law',
                    content: `These Terms and Conditions are governed by Swiss law. Any dispute will be under the exclusive jurisdiction of Swiss courts.`
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
