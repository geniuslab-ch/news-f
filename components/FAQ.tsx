'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqItems: FAQItem[];
    lang: 'fr' | 'en';
}

export default function FAQ({ faqItems, lang }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const title = lang === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions';

    return (
        <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    {title}
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                                <span
                                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-emerald-600 font-bold text-xl transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
