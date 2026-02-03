'use client';

import { useState } from 'react';
import Link from 'next/link';

import { STRIPE_PRODUCTS, PackageType } from '@/lib/stripe-config';
const programs = [
    { id: 'declic-durable', name: 'Déclic Durable', icon: '🌱', color: 'from-green-500 to-emerald-600' },
    { id: 'systeme-apex', name: 'Système Apex', icon: '⚡', color: 'from-blue-500 to-indigo-600' },
    { id: 'elan-senior', name: 'Élan Senior', icon: '👴', color: 'from-amber-500 to-orange-600' },
    { id: 'renaissance', name: 'Renaissance', icon: '🌸', color: 'from-pink-500 to-rose-600' },
];

const packages = [
    { id: '1month', duration: '1 mois', sessions: 8, price: 200, pricePerSession: 25 },
    { id: '3months', duration: '3 mois', sessions: 24, price: 555, pricePerSession: 23.13, badge: 'Le plus populaire' },
    { id: '6months', duration: '6 mois', sessions: 48, price: 1050, pricePerSession: 21.88 },
    { id: '12months', duration: '12 mois', sessions: 98, price: 1980, pricePerSession: 20.20, badge: 'Meilleure valeur' },
];

export default function ProgramSelector() {
    const [selectedProgram, setSelectedProgram] = useState('systeme-apex');
    const [selectedPackage, setSelectedPackage] = useState('3months');
    const [paymentMode, setPaymentMode] = useState<'once' | 'monthly'>('once');

    const selected = packages.find(p => p.id === selectedPackage);
    const product = STRIPE_PRODUCTS[selectedPackage as PackageType];
    const showMonthly = paymentMode === 'monthly' && product?.monthlyPrice;
    const displayPrice = showMonthly ? product.monthlyPrice : selected?.price;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-primary-200">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Choisissez votre programme
                </h2>
                <p className="text-gray-600">
                    Sélectionnez un programme et un forfait adapté à vos besoins
                </p>
            </div>

            {/* Programme Selection */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Programme</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {programs.map((program) => (
                        <button
                            key={program.id}
                            onClick={() => setSelectedProgram(program.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${selectedProgram === program.id
                                ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 bg-gradient-to-r ${program.color} rounded-lg flex items-center justify-center text-2xl mx-auto mb-2`}>
                                {program.icon}
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">{program.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Package Selection */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Forfait</h3>

                    {/* Payment Mode Toggle */}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {packages.map((pkg) => {
                        const product = STRIPE_PRODUCTS[pkg.id as PackageType];
                        const showMonthly = paymentMode === 'monthly' && product?.monthlyPrice;
                        const displayPrice = showMonthly ? product.monthlyPrice : pkg.price;

                        return (
                            <button
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id)}
                                className={`relative p-6 rounded-xl border-2 transition-all ${selectedPackage === pkg.id
                                    ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                    }`}
                            >
                                {pkg.badge && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-fitbuddy text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            {pkg.badge}
                                        </span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 text-lg mb-1">{pkg.duration}</p>
                                    <p className="text-3xl font-extrabold text-gradient mb-2">
                                        CHF {displayPrice}
                                        {showMonthly && <span className="text-sm text-gray-500 font-normal">/mois</span>}
                                    </p>
                                    {!showMonthly && (
                                        <>
                                            <p className="text-sm text-gray-600 mb-2">{pkg.sessions} sessions</p>
                                            <p className="text-xs text-gray-500">
                                                {pkg.pricePerSession.toFixed(2)} CHF/session
                                            </p>
                                        </>
                                    )}
                                    {showMonthly && (
                                        <p className="text-xs text-primary-600 font-medium bg-primary-50 py-1 px-2 rounded-full inline-block mt-2">
                                            Engagement {pkg.duration}
                                        </p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary & CTA */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border-2 border-primary-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-600 mb-1">Votre sélection :</p>
                        <p className="text-xl font-bold text-gray-900">
                            {programs.find(p => p.id === selectedProgram)?.name} - {selected?.duration}
                        </p>
                        <p className="text-lg font-semibold text-primary-600 mt-1">
                            CHF {displayPrice} {showMonthly ? '/ mois' : `(${selected?.sessions} sessions)`}
                        </p>
                    </div>
                    <Link
                        href={`/dashboard/checkout?program=${selectedProgram}&duration=${selectedPackage}&mode=${paymentMode}`}
                        className="bg-gradient-fitbuddy text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl btn-shine whitespace-nowrap"
                    >
                        💳 Acheter maintenant →
                    </Link>
                </div>
            </div>
        </div>
    );
}
