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
import PricingSection from '@/components/PricingSection';
import Testimonials from '@/components/Testimonials';
import TikTokFeed from '@/components/TikTokFeed';
import FAQ from '@/components/FAQ';
import SimplifiedCTA from '@/components/SimplifiedCTA';
import type { ProgramConfig } from '@/lib/programsConfig';

export default function ProgramPageClient({ program }: { program: ProgramConfig }) {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    return (
        <div className="min-h-screen">
            <Header lang={lang} onLanguageChange={setLang} />

            <Hero
                lang={lang}
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

            <PricingSection lang={lang} />

            <Testimonials testimonials={program.testimonials[lang]} lang={lang} />

            <TikTokFeed lang={lang} />

            <FAQ faqItems={program.faq[lang]} lang={lang} />

            {/* Simplified CTA */}
            <SimplifiedCTA
                lang={lang}
                programSlug={program.slug}
                programTitle={program.title}
            />

            <Footer />
        </div>
    );
}
