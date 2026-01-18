interface WhatYouGetProps {
    items: string[];
    lang: 'fr' | 'en';
}

export default function WhatYouGet({ items, lang }: WhatYouGetProps) {
    const title = lang === 'fr' ? 'Ce que vous obtenez' : 'What You Get';

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    {title}
                </h2>
                <div className="max-w-3xl mx-auto">
                    <ul className="space-y-4">
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                                    ✓
                                </span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
