interface Step {
    step: string;
    title: string;
    description: string;
}

interface HowItWorksProps {
    steps: Step[];
    lang: 'fr' | 'en';
}

export default function HowItWorks({ steps, lang }: HowItWorksProps) {
    const title = lang === 'fr' ? 'Comment ça marche' : 'How It Works';

    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="relative text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
