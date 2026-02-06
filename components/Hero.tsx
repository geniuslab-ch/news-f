interface HeroProps {
    lang: 'fr' | 'en';
    ctaText: string;
    programSlug: string;
}

export default function Hero({ lang, ctaText, programSlug }: HeroProps) {
    // Encode video filenames with spaces
    const videoSrc = lang === 'fr'
        ? '/Website%20french%20video.webm'
        : '/Website%20english%20video.webm';

    return (
        <section className="relative min-h-[60vh] md:min-h-screen flex items-end justify-center overflow-hidden bg-black">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    key={lang}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain md:object-cover"
                    style={{ maxHeight: '100%', maxWidth: '100%', objectPosition: 'center' }}
                >
                    <source src={videoSrc} type="video/webm" />
                    {/* Fallback for browsers that don't support video */}
                    <div className="w-full h-full bg-gradient-fitbuddy"></div>
                </video>
                {/* Dark overlay for better CTA visibility at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70"></div>
            </div>

            {/* CTA Button - positioned at BOTTOM */}
            <div className="relative z-10 w-full px-4 pb-24 mb-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <a
                        href="#signup"
                        className="inline-block bg-gradient-fitbuddy text-white font-bold text-xl md:text-2xl px-14 py-6 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-primary-400/50 btn-shine animate-pulse"
                    >
                        {ctaText}
                    </a>

                    {/* USP Tagline */}
                    <p className="mt-6 text-white font-bold text-lg md:text-xl drop-shadow-lg">
                        {lang === 'fr'
                            ? '8× moins cher qu\'un coach présentiel 💪'
                            : '8× cheaper than in-person coaching 💪'}
                    </p>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-8 h-12 rounded-full border-2 border-white/60 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}
