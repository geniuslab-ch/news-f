'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import WhatYouGet from '@/components/WhatYouGet';
import HowItWorks from '@/components/HowItWorks';
import ProgramDetails from '@/components/ProgramDetails';
import GoogleMeetSection from '@/components/GoogleMeetSection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import SignupForm from '@/components/SignupForm';
import type { ProgramConfig } from '@/lib/programsConfig';

export default function ProgramPageClient({ program }: { program: ProgramConfig }) {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    return (
        <div className="min-h-screen">
            {/* Language toggle - fixed top right */}
            <div className="fixed top-20 right-4 z-40">
                <button
                    onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                    {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                </button>
            </div>

            <Header />

            <Hero
                title={program.heroTitle[lang]}
                subtitle={program.heroSubtitle[lang]}
                ctaText={program.cta[lang]}
                programSlug={program.slug}
            />

            <Benefits benefits={program.primaryBenefits[lang]} lang={lang} />

            <WhatYouGet items={program.whatYouGet[lang]} lang={lang} />

            <HowItWorks steps={program.howItWorks[lang]} lang={lang} />

            <ProgramDetails
                objectives={program.programDetails[lang].objectives}
                duration={program.programDetails[lang].duration}
                frequency={program.programDetails[lang].frequency}
                programTitle={program.title}
                lang={lang}
            />

            <GoogleMeetSection lang={lang} />

            <Testimonials testimonials={program.testimonials[lang]} lang={lang} />

            <FAQ faqItems={program.faq[lang]} lang={lang} />

            {/* CTA + Signup Section */}
            <section id="signup" className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {lang === 'fr'
                                    ? 'Prêt à transformer votre vie ?'
                                    : 'Ready to Transform Your Life?'}
                            </h2>
                            <p className="text-lg text-white/90">
                                {lang === 'fr'
                                    ? 'Remplissez le formulaire ci-dessous et commencez votre parcours dès aujourd\'hui.'
                                    : 'Fill out the form below and start your journey today.'}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
                            <SignupForm
                                programSlug={program.slug}
                                programTitle={program.title}
                                goalOptions={program.goalOptions}
                                ctaText={program.cta}
                                lang={lang}
                            />
                        </div>

                        <p className="text-center text-white/80 text-sm mt-8">
                            {lang === 'fr'
                                ? '⚠️ Important : Les programmes Fitbuddy ne remplacent pas un avis médical. Consultez votre médecin avant de commencer.'
                                : '⚠️ Important: Fitbuddy programs do not replace medical advice. Consult your doctor before starting.'}
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
