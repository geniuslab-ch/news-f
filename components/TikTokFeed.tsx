'use client';

import { useEffect } from 'react';

interface TikTokFeedProps {
    lang: 'fr' | 'en';
}

export default function TikTokFeed({ lang }: TikTokFeedProps) {
    useEffect(() => {
        // Load Elfsight script if not already loaded
        const scriptId = 'elfsight-platform';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://elfsightcdn.com/platform.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const content = {
        fr: {
            title: 'Nos transformations sur TikTok',
            subtitle: 'Découvrez les résultats de nos clients et leur parcours inspirant !',
            cta: 'Suivez-nous sur TikTok'
        },
        en: {
            title: 'Our Transformations on TikTok',
            subtitle: 'See our clients\' results and their inspiring journeys!',
            cta: 'Follow us on TikTok'
        }
    };

    const t = content[lang];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        {t.subtitle}
                    </p>
                </div>

                {/* Elfsight TikTok Feed */}
                <div className="max-w-6xl mx-auto">
                    <div
                        className="elfsight-app-ac1fb514-52f4-43fe-81af-4b7d4caa7747"
                        data-elfsight-app-lazy
                    ></div>
                </div>

                {/* CTA to follow */}
                <div className="text-center mt-8">
                    <a
                        href="https://www.tiktok.com/@thu_coaching?_t=8sXBHuP2dSE&_r=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gradient-fitbuddy text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg"
                    >
                        {t.cta}
                    </a>
                </div>
            </div>
        </section>
    );
}
