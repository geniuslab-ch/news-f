interface ProgramDetailsProps {
    objectives: string[];
    duration: string;
    frequency: string;
    programTitle: string;
    lang: 'fr' | 'en';
}

export default function ProgramDetails({
    objectives,
    duration,
    frequency,
    programTitle,
    lang,
}: ProgramDetailsProps) {
    const labels = {
        fr: {
            title: `Le programme ${programTitle}`,
            objectivesTitle: 'Objectifs',
            durationTitle: 'Durée',
            frequencyTitle: 'Fréquence',
        },
        en: {
            title: `The ${programTitle} Program`,
            objectivesTitle: 'Objectives',
            durationTitle: 'Duration',
            frequencyTitle: 'Frequency',
        },
    };

    const t = labels[lang];

    return (
        <section id="program" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    {t.title}
                </h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-emerald-600">🎯</span> {t.objectivesTitle}
                        </h3>
                        <ul className="space-y-3">
                            {objectives.map((objective, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                                        ✓
                                    </span>
                                    <span className="text-gray-700 leading-relaxed">{objective}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="text-3xl mb-3">⏱️</div>
                            <h3 className="font-bold text-gray-900 mb-2">{t.durationTitle}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{duration}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="text-3xl mb-3">📅</div>
                            <h3 className="font-bold text-gray-900 mb-2">{t.frequencyTitle}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{frequency}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
