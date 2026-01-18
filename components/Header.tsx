'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
    lang: 'fr' | 'en';
    onLanguageChange: (lang: 'fr' | 'en') => void;
}

export default function Header({ lang, onLanguageChange }: HeaderProps) {
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
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Fitbuddy Logo"
                        width={180}
                        height={60}
                        className="h-12 w-auto"
                        priority
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#program" className="text-gray-700 hover:text-primary-600 font-medium transition">
                        {t.program}
                    </a>
                    <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition">
                        {t.howItWorks}
                    </a>
                    <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition">
                        {t.testimonials}
                    </a>
                    <a href="#faq" className="text-gray-700 hover:text-primary-600 font-medium transition">
                        {t.faq}
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onLanguageChange(lang === 'fr' ? 'en' : 'fr')}
                        className="px-4 py-2 text-sm font-bold text-white bg-gradient-fitbuddy rounded-full shadow-lg hover:scale-105 transition-all duration-300 btn-shine"
                    >
                        {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                    </button>
                    <a
                        href="#signup"
                        className="bg-gradient-fitbuddy text-white font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-md btn-shine"
                    >
                        {t.cta}
                    </a>
                </div>
            </nav>
        </header>
    );
}
