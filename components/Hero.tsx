interface HeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    programSlug: string;
}

export default function Hero({ title, subtitle, ctaText, programSlug }: HeroProps) {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                    <a
                        href="#signup"
                        className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg px-10 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        {ctaText}
                    </a>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                            <div className="text-4xl mb-3">📹</div>
                            <h3 className="font-semibold text-gray-900 mb-2">100% en visio</h3>
                            <p className="text-sm text-gray-600">Google Meet, depuis chez vous</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                            <div className="text-4xl mb-3">👤</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Coach dédié</h3>
                            <p className="text-sm text-gray-600">Accompagnement personnalisé</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                            <div className="text-4xl mb-3">🌍</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Multilingue</h3>
                            <p className="text-sm text-gray-600">FR, EN et plus</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
