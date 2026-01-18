interface Testimonial {
    name: string;
    age: string;
    text: string;
    rating: number;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
    lang: 'fr' | 'en';
}

export default function Testimonials({ testimonials, lang }: TestimonialsProps) {
    const title = lang === 'fr' ? 'Ils ont transformé leur vie' : 'They Transformed Their Lives';

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-emerald-100"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-6 italic">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.age}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
