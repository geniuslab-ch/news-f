'use client';

import { useEffect } from 'react';

interface InstagramFeedProps {
    lang: 'fr' | 'en';
}

export default function InstagramFeed({ lang }: InstagramFeedProps) {
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
            title: 'Rejoignez notre communauté sur Instagram',
            subtitle: 'Découvrez les transformations de nos clients et restez motivé !',
            cta: 'Suivez @fitbuddy'
        },
        en: {
            title: 'Join Our Community on Instagram',
            subtitle: 'See our clients\' transformations and stay motivated!',
            cta: 'Follow @fitbuddy'
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

                {/* Elfsight Instagram Feed */}
                <div className="max-w-6xl mx-auto">
                    <div
                        className="elfsight-app-c2484fb9-3639-4b7a-8744-ae72ea38f117"
                        data-elfsight-app-lazy
                    ></div>
                </div>

                {/* CTA to follow */}
                <div className="text-center mt-8">
                    <a
                        href="https://instagram.com/fitbuddy"
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
