'use client';

import { useState, useEffect, useRef } from 'react';
import { assignCoach } from '@/lib/coachAssignment';
import Script from 'next/script';

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

declare global {
    interface Window {
        Cal?: any;
    }
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
    const calInitialized = useRef(false);

    // Initialize Cal.com when script loads and appointment type changes
    useEffect(() => {
        // Wait for Cal to be available
        const initCal = () => {
            if (typeof window === 'undefined' || !window.Cal) {
                return false;
            }

            const namespace = formData.wantsDiscovery ? '15min' : '45min';
            const calLink = formData.wantsDiscovery ? 'fitbuddy/15min' : 'fitbuddy/45min';
            const elementId = formData.wantsDiscovery ? 'my-cal-inline-15min' : 'my-cal-inline-45min';

            try {
                // Initialize Cal
                window.Cal('init', namespace, { origin: 'https://app.cal.eu' });

                // Configure inline calendar
                window.Cal.ns[namespace]('inline', {
                    elementOrSelector: `#${elementId}`,
                    config: { layout: 'month_view' },
                    calLink: calLink,
                });

                // Set UI options
                window.Cal.ns[namespace]('ui', {
                    hideEventTypeDetails: false,
                    layout: 'month_view'
                });

                console.log(`Cal.com initialized: ${namespace}`);
                return true;
            } catch (error) {
                console.error('Cal.com initialization error:', error);
                return false;
            }
        };

        // Try to initialize immediately
        if (initCal()) {
            calInitialized.current = true;
            return;
        }

        // If not ready, poll until Cal is available
        const checkInterval = setInterval(() => {
            if (initCal()) {
                calInitialized.current = true;
                clearInterval(checkInterval);
            }
        }, 100);

        // Cleanup
        return () => {
            clearInterval(checkInterval);
        };
    }, [formData.wantsDiscovery]);

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
            discoveryOption: '🎁 Je veux d\'abord un appel découverte gratuit de 15 min',
            firstSessionOption: '💪 Je suis prêt(e) pour ma première session de 45 min',
            calendarTitle: 'Choisissez votre créneau',
            consent: 'J\'accepte de recevoir des communications de Fitbuddy et j\'ai lu la politique de confidentialité',
            submit: ctaText.fr,
            successTitle: 'Merci ! 🎉',
            successMessage: assignedCoach
                ? `Votre demande a été envoyée. Votre coach ${assignedCoach} vous contactera sous 24–48h pour confirmer votre rendez-vous.`
                : 'Votre demande a été envoyée. Nous reviendrons vers vous sous 24–48h.',
            noCoachTitle: 'Merci de votre intérêt',
            noCoachMessage: `Nous n'avons pas encore de coach disponible dans cette langue pour le programme ${programTitle}. Laissez-nous votre email et nous vous contacterons dès qu'un coach sera disponible.`,
        },
        en: {
            firstName: 'First Name',
            email: 'Email',
            language: 'Language',
            goal: 'Main Goal',
            discoveryTitle: 'Appointment Type',
            discoveryOption: '🎁 I want a free 15-min discovery call first',
            firstSessionOption: '💪 I\'m ready for my first 45-min session',
            calendarTitle: 'Choose your time slot',
            consent: 'I agree to receive communications from Fitbuddy and have read the privacy policy',
            submit: ctaText.en,
            successTitle: 'Thank You! 🎉',
            successMessage: assignedCoach
                ? `Your request has been sent. Your coach ${assignedCoach} will contact you within 24–48h to confirm your appointment.`
                : 'Your request has been sent. We will get back to you within 24–48h.',
            noCoachTitle: 'Thank You for Your Interest',
            noCoachMessage: `We don't have a coach available in this language for the ${programTitle} program yet. Leave us your email and we'll contact you as soon as a coach is available.`,
        },
    };

    const t = labels[lang];

    if (submitted) {
        return (
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 text-center border border-primary-200">
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
        <>
            {/* Cal.com Script */}
            <Script
                src="https://app.cal.eu/embed/embed.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Cal.com script loaded successfully');
                }}
                onError={(e) => {
                    console.error('Failed to load Cal.com script:', e);
                }}
            />

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
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">{t.discoveryTitle}</h4>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="appointmentType"
                                checked={formData.wantsDiscovery}
                                onChange={() => setFormData({ ...formData, wantsDiscovery: true })}
                                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{t.discoveryOption}</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="appointmentType"
                                checked={!formData.wantsDiscovery}
                                onChange={() => setFormData({ ...formData, wantsDiscovery: false })}
                                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{t.firstSessionOption}</span>
                        </label>
                    </div>
                </div>

                {/* Cal.com Calendar Embed */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        {t.calendarTitle} *
                    </label>
                    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                        {formData.wantsDiscovery ? (
                            <div
                                id="my-cal-inline-15min"
                                style={{ width: '100%', height: '600px', overflow: 'auto' }}
                            />
                        ) : (
                            <div
                                id="my-cal-inline-45min"
                                style={{ width: '100%', height: '600px', overflow: 'auto' }}
                            />
                        )}
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
                    className="w-full bg-gradient-fitbuddy text-white font-bold py-4 px-8 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {t.submit}
                </button>
            </form>
        </>
    );
}
