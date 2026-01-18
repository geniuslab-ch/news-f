interface HeroProps {
    lang: 'fr' | 'en';
    ctaText: string;
    programSlug: string;
}

export default function Hero({ lang, ctaText, programSlug }: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    key={lang} // Force re-render when language changes
                >
                    <source src={`/${lang === 'fr' ? 'video-fr' : 'video-en'}.webm`} type="video/webm" />
                </video>
                {/* Dark overlay for better CTA visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
            </div>

            {/* CTA Button - positioned at bottom */}
            <div className="relative z-10 w-full px-4 pb-20">
                <div className="container mx-auto max-w-4xl text-center">
                    <a
                        href="#signup"
                        className="inline-block bg-gradient-fitbuddy text-white font-bold text-xl px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary-400/50 btn-shine"
                    >
                        {ctaText}
                    </a>

                    {/* Three key benefits cards - more visible on video */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl card-hover">
                            <div className="text-5xl mb-3">📹</div>
                            <h3 className="font-bold text-gray-900 mb-2">
                                {lang === 'fr' ? '100% en visio' : '100% Online'}
                            </h3>
                            <p className="text-sm text-gray-700">
                                {lang === 'fr' ? 'Google Meet, depuis chez vous' : 'Google Meet, from your home'}
                            </p>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl card-hover">
                            <div className="text-5xl mb-3">💪</div>
                            <h3 className="font-bold text-gray-900 mb-2">
                                {lang === 'fr' ? 'Coach dédié' : 'Dedicated Coach'}
                            </h3>
                            <p className="text-sm text-gray-700">
                                {lang === 'fr' ? 'Accompagnement personnalisé' : 'Personalized support'}
                            </p>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl card-hover">
                            <div className="text-5xl mb-3">🌍</div>
                            <h3 className="font-bold text-gray-900 mb-2">
                                {lang === 'fr' ? 'Multilingue' : 'Multilingual'}
                            </h3>
                            <p className="text-sm text-gray-700">
                                FR, EN
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}
