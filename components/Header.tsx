'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [lang, setLang] = useState<'fr' | 'en'>('fr');

    const labels = {
        fr: {
            program: 'Programme',
            howItWorks: 'Fonctionnement',
            testimonials: 'Témoignages',
            faq: 'FAQ',
            cta: 'Commencer',
        },
        en: {
            program: 'Program',
            howItWorks: 'How It Works',
            testimonials: 'Testimonials',
            faq: 'FAQ',
            cta: 'Get Started',
        },
    };

    const t = labels[lang];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Fitbuddy
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#program" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                        {t.program}
                    </a>
                    <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                        {t.howItWorks}
                    </a>
                    <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                        {t.testimonials}
                    </a>
                    <a href="#faq" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                        {t.faq}
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-emerald-600 border border-gray-300 rounded-lg hover:border-emerald-600 transition"
                    >
                        {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                    </button>
                    <a
                        href="#signup"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        {t.cta}
                    </a>
                </div>
            </nav>
        </header>
    );
}
