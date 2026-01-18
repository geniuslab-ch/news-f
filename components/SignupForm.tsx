'use client';

import { useState } from 'react';
import { assignCoach } from '@/lib/coachAssignment';

interface SignupFormProps {
    programSlug: string;
    programTitle: string;
    goalOptions: {
        fr: string[];
        en: string[];
    };
    ctaText: {
        fr: string;
        en: string;
    };
    lang: 'fr' | 'en';
}

export default function SignupForm({
    programSlug,
    programTitle,
    goalOptions,
    ctaText,
    lang,
}: SignupFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        language: 'fr',
        goal: '',
        wantsDiscovery: false,
        consent: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [assignedCoach, setAssignedCoach] = useState<string | null>(null);
    const [noCoachAvailable, setNoCoachAvailable] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const coach = assignCoach(formData.language, programSlug);

        if (!coach) {
            setNoCoachAvailable(true);
            setSubmitted(true);
            return;
        }

        setAssignedCoach(coach.name);
        setNoCoachAvailable(false);
        setSubmitted(true);

        // Track event
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'form_submission',
                program: programSlug,
                language: formData.language,
                coach: coach.name,
                discovery_call: formData.wantsDiscovery,
            });
        }

        console.log('Form submitted:', { formData, coach });
    };

    const labels = {
        fr: {
            firstName: 'Prénom',
            email: 'Email',
            language: 'Langue',
            goal: 'Objectif principal',
            discoveryTitle: 'Type de rendez-vous',
            discoveryOption: '🎁 Appel découverte gratuit de 15 min',
            firstSessionOption: '💪 Première session de coaching de 45 min',
            bookButton: '📅 Réserver mon créneau maintenant',
            consent: 'J\'accepte de recevoir des communications de Fitbuddy et j\'ai lu la politique de confidentialité',
            submit: ctaText.fr,
            successTitle: 'Merci ! 🎉',
            successMessage: 'Cliquez sur le bouton ci-dessous pour accéder au calendrier de réservation :',
            noCoachTitle: 'Merci de votre intérêt',
            noCoachMessage: `Nous n'avons pas encore de coach disponible dans cette langue pour le programme ${programTitle}. Laissez-nous votre email et nous vous contacterons dès qu'un coach sera disponible.`,
        },
        en: {
            firstName: 'First Name',
            email: 'Email',
            language: 'Language',
            goal: 'Main Goal',
            discoveryTitle: 'Appointment Type',
            discoveryOption: '🎁 Free 15-min discovery call',
            firstSessionOption: '💪 First 45-min coaching session',
            bookButton: '📅 Book my time slot now',
            consent: 'I agree to receive communications from Fitbuddy and have read the privacy policy',
            submit: ctaText.en,
            successTitle: 'Thank You! 🎉',
            successMessage: 'Click the button below to access the booking calendar:',
            noCoachTitle: 'Thank You for Your Interest',
            noCoachMessage: `We don't have a coach available in this language for the ${programTitle} program yet. Leave us your email and we'll contact you as soon as a coach is available.`,
        },
    };

    const t = labels[lang];

    // Direct Cal.com links (app.cal.eu domain)
    const calLink = formData.wantsDiscovery
        ? 'https://app.cal.eu/fitbuddy/15min'
        : 'https://app.cal.eu/fitbuddy/45min';

    if (submitted) {
        return (
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 text-center border border-primary-200">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {noCoachAvailable ? t.noCoachTitle : t.successTitle}
                </h3>
                {noCoachAvailable ? (
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {t.noCoachMessage}
                    </p>
                ) : (
                    <div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            {t.successMessage}
                        </p>
                        {assignedCoach && (
                            <p className="text-sm text-gray-600 mb-6">
                                ✅ Coach assigné : <span className="font-bold text-primary-600">{assignedCoach}</span>
                            </p>
                        )}
                        <a
                            href={`${calLink}?name=${encodeURIComponent(formData.firstName)}&email=${encodeURIComponent(formData.email)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-fitbuddy text-white font-bold text-lg px-10 py-5 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl btn-shine animate-pulse"
                        >
                            {t.bookButton} →
                        </a>
                        <p className="text-xs text-gray-500 mt-4">
                            {lang === 'fr'
                                ? 'Un nouvel onglet s\'ouvrira avec le calendrier'
                                : 'A new tab will open with the calendar'}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.firstName} *
                </label>
                <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.email} *
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
            </div>

            <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.language} *
                </label>
                <select
                    id="language"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div>
                <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.goal} *
                </label>
                <select
                    id="goal"
                    required
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                    <option value="">-- {lang === 'fr' ? 'Sélectionnez' : 'Select'} --</option>
                    {goalOptions[lang].map((goal, idx) => (
                        <option key={idx} value={goal}>
                            {goal}
                        </option>
                    ))}
                </select>
            </div>

            {/* Discovery Call Selection */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-4">{t.discoveryTitle}</h4>
                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-yellow-100 transition">
                        <input
                            type="radio"
                            name="appointmentType"
                            checked={formData.wantsDiscovery}
                            onChange={() => setFormData({ ...formData, wantsDiscovery: true })}
                            className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <div>
                            <span className="font-semibold text-gray-900">{t.discoveryOption}</span>
                            <p className="text-xs text-gray-600 mt-1">
                                {lang === 'fr'
                                    ? 'Découvrez nos programmes sans engagement'
                                    : 'Discover our programs with no commitment'}
                            </p>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-yellow-100 transition">
                        <input
                            type="radio"
                            name="appointmentType"
                            checked={!formData.wantsDiscovery}
                            onChange={() => setFormData({ ...formData, wantsDiscovery: false })}
                            className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <div>
                            <span className="font-semibold text-gray-900">{t.firstSessionOption}</span>
                            <p className="text-xs text-gray-600 mt-1">
                                {lang === 'fr'
                                    ? 'Commencez votre transformation maintenant'
                                    : 'Start your transformation now'}
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                    {t.consent}
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-fitbuddy text-white font-bold py-4 px-8 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
                {t.submit}
            </button>
        </form>
    );
}
