'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GlobalNav from '@/components/GlobalNav';
import { supabase } from '@/lib/supabase';
import { STRIPE_PRODUCTS, type PackageType } from '@/lib/stripe-config';
import type { User } from '@supabase/supabase-js';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<PackageType | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [highlightedPackage, setHighlightedPackage] = useState<PackageType | null>(null);
    const [paymentMode, setPaymentMode] = useState<'once' | 'monthly'>('once');

    useEffect(() => {
        loadUser();

        // Pre-fill from URL params
        const program = searchParams.get('program');
        const duration = searchParams.get('duration');

        if (program) {
            setSelectedProgram(program);
        }

        const modeParam = searchParams.get('mode');
        if (modeParam === 'monthly') {
            setPaymentMode('monthly');
        }

        if (duration) {
            setHighlightedPackage(duration as PackageType);
            // Smooth scroll to highlighted package after render
            setTimeout(() => {
                const element = document.getElementById(`package-${duration}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [searchParams]);

    const loadUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (packageType: PackageType) => {
        if (!user) return;

        setPurchasing(packageType);

        try {
            const product = STRIPE_PRODUCTS[packageType];

            // Handle monthly payment link redirect
            if (paymentMode === 'monthly' && product.paymentLink) {
                window.location.href = product.paymentLink;
                return;
            }

            const response = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: product.priceId,
                    packageType,
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Erreur: ${data.error}`);
                return;
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('Erreur lors de la création de la session. Veuillez réessayer.');
        } finally {
            setPurchasing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    const products = Object.entries(STRIPE_PRODUCTS).map(([key, product]) => ({
        type: key as PackageType,
        ...product,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            {/* Global Navigation */}
            <GlobalNav />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                        ← Retour au dashboard
                    </Link>

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Choisissez votre forfait
                        </h1>
                        <p className="text-lg text-gray-600">
                            Commencez votre transformation avec un programme adapté à vos objectifs
                        </p>
                        {selectedProgram && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                                Programme : <span className="font-bold capitalize">{selectedProgram.replace('-', ' ')}</span>
                            </div>
                        )}
                    </div>

                    {/* Payment Mode Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => setPaymentMode('once')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${paymentMode === 'once'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Paiement unique
                            </button>
                            <button
                                onClick={() => setPaymentMode('monthly')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${paymentMode === 'monthly'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Paiement mensuel
                            </button>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.type}
                                id={`package-${product.type}`}
                                className={`relative bg-white rounded-2xl p-6 shadow-xl border-2 transition-all hover:scale-105 ${highlightedPackage === product.type
                                    ? 'border-primary-500 ring-4 ring-primary-100 bg-primary-50'
                                    : product.recommended
                                        ? 'border-primary-500 ring-4 ring-primary-100'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                {/* Badge */}
                                {product.badge && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-fitbuddy text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                            {product.badge}
                                        </span>
                                    </div>
                                )}

                                {(() => {
                                    const showMonthly = paymentMode === 'monthly' && product.monthlyPrice;
                                    const displayPrice = showMonthly ? product.monthlyPrice : product.price;

                                    return (
                                        <>
                                            {/* Header */}
                                            <div className="text-center mb-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-4xl font-extrabold text-gradient">
                                                        CHF {displayPrice}
                                                    </span>
                                                    {showMonthly && <span className="text-sm text-gray-500">/mois</span>}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                                                {showMonthly && (
                                                    <p className="text-xs text-primary-600 font-medium bg-primary-50 py-1 px-2 rounded-full inline-block mt-2">
                                                        Engagement {product.duration} jours
                                                    </p>
                                                )}
                                            </div>

                                            {/* Sessions */}
                                            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                                                <div className="text-center">
                                                    <span className="text-3xl font-bold text-primary-600">{product.sessions}</span>
                                                    <p className="text-sm text-gray-700">sessions de coaching</p>
                                                    {!showMonthly && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {Math.round((product.price / product.sessions) * 100) / 100} CHF/session
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}

                                {/* Features */}
                                <ul className="space-y-3 mb-6">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handlePurchase(product.type)}
                                    disabled={purchasing === product.type}
                                    className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${product.recommended
                                        ? 'bg-gradient-fitbuddy text-white hover:scale-105 shadow-lg'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {purchasing === product.type ? 'Chargement...' : 'Acheter maintenant'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-600 mb-4">Paiement 100% sécurisé par Stripe</p>
                        <div className="flex items-center justify-center gap-6 text-gray-400">
                            <span className="text-2xl">🔒</span>
                            <span className="text-2xl">💳</span>
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
