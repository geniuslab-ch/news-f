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
        availability: '',
        consent: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [assignedCoach, setAssignedCoach] = useState<string | null>(null);
    const [noCoachAvailable, setNoCoachAvailable] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Attribution du coach
        const coach = assignCoach(formData.language, programSlug);

        if (!coach) {
            setNoCoachAvailable(true);
            setSubmitted(true);
            return;
        }

        setAssignedCoach(coach.name);
        setNoCoachAvailable(false);
        setSubmitted(true);

        // Tracking placeholder (Google Tag Manager / dataLayer)
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'form_submission',
                program: programSlug,
                language: formData.language,
                coach: coach.name,
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
            availability: 'Vos disponibilités (ex: lundi et mercredi soir)',
            consent: 'J\'accepte de recevoir des communications de Fitbuddy et j\'ai lu la politique de confidentialité',
            submit: ctaText.fr,
            successTitle: 'Merci ! 🎉',
            successMessage: assignedCoach
                ? `Votre demande a été envoyée. Votre coach ${assignedCoach} vous contactera sous 24–48h pour planifier votre première séance.`
                : 'Votre demande a été envoyée. Nous reviendrons vers vous sous 24–48h.',
            noCoachTitle: 'Merci de votre intérêt',
            noCoachMessage: `Nous n'avons pas encore de coach disponible dans cette langue pour le programme ${programTitle}. Laissez-nous votre email et nous vous contacterons dès qu'un coach sera disponible.`,
        },
        en: {
            firstName: 'First Name',
            email: 'Email',
            language: 'Language',
            goal: 'Main Goal',
            availability: 'Your availability (e.g., Monday and Wednesday evening)',
            consent: 'I agree to receive communications from Fitbuddy and have read the privacy policy',
            submit: ctaText.en,
            successTitle: 'Thank You! 🎉',
            successMessage: assignedCoach
                ? `Your request has been sent. Your coach ${assignedCoach} will contact you within 24–48h to schedule your first session.`
                : 'Your request has been sent. We will get back to you within 24–48h.',
            noCoachTitle: 'Thank You for Your Interest',
            noCoachMessage: `We don't have a coach available in this language for the ${programTitle} program yet. Leave us your email and we'll contact you as soon as a coach is available.`,
        },
    };

    const t = labels[lang];

    if (submitted) {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center border border-emerald-200">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {noCoachAvailable ? t.noCoachTitle : t.successTitle}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    {noCoachAvailable ? t.noCoachMessage : t.successMessage}
                </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                    <option value="">-- {lang === 'fr' ? 'Sélectionnez' : 'Select'} --</option>
                    {goalOptions[lang].map((goal, idx) => (
                        <option key={idx} value={goal}>
                            {goal}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.availability} *
                </label>
                <textarea
                    id="availability"
                    required
                    rows={3}
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                />
            </div>

            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                    {t.consent}
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                {t.submit}
            </button>
        </form>
    );
}
