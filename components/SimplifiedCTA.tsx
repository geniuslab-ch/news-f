'use client';

import Link from 'next/link';

interface SimplifiedCTAProps {
    lang: 'fr' | 'en';
    programSlug: string;
    programTitle: string;
}

export default function SimplifiedCTA({ lang, programSlug, programTitle }: SimplifiedCTAProps) {
    return (
        <section id="signup" className="py-20 bg-gradient-fitbuddy">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Discovery Session */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {lang === 'fr'
                                ? 'Essayez gratuitement'
                                : 'Try it for free'}
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            {lang === 'fr'
                                ? 'Réservez un appel découverte de 15 minutes pour discuter de vos objectifs'
                                : 'Book a free 15-minute discovery call to discuss your goals'}
                        </p>
                        <a
                            href="https://app.cal.eu/fitbuddy/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-primary-600 font-bold text-lg px-10 py-5 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl"
                        >
                            {lang === 'fr' ? '📞 Réserver mon appel gratuit' : '📞 Book Free Call'}
                        </a>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center gap-4 my-12">
                        <div className="flex-1 h-px bg-white/30"></div>
                        <span className="text-white/70 font-semibold">
                            {lang === 'fr' ? 'OU' : 'OR'}
                        </span>
                        <div className="flex-1 h-px bg-white/30"></div>
                    </div>

                    {/* Signup Section */}
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            {lang === 'fr'
                                ? 'Commencez votre transformation'
                                : 'Start Your Transformation'}
                        </h3>
                        <p className="text-lg text-gray-600 mb-6">
                            {lang === 'fr'
                                ? 'Créez votre compte et choisissez votre forfait pour démarrer'
                                : 'Create your account and choose your package to get started'}
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block bg-gradient-fitbuddy text-white font-bold text-lg px-10 py-5 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl btn-shine"
                        >
                            {lang === 'fr' ? '🚀 Créer mon compte →' : '🚀 Create Account →'}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
