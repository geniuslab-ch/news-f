'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-5xl">✅</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Paiement réussi !
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-8">
                    Votre forfait a été acheté avec succès. Vous pouvez maintenant réserver vos sessions de coaching.
                </p>

                {/* Session ID */}
                {sessionId && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                        <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                        <p className="text-sm font-mono text-gray-700">{sessionId}</p>
                    </div>
                )}

                {/* Next Steps */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-bold text-gray-900 mb-3">Prochaines étapes :</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">1.</span>
                            <span>Retournez au dashboard pour voir votre forfait</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">2.</span>
                            <span>Réservez votre première session de coaching</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">3.</span>
                            <span>Commencez votre transformation !</span>
                        </li>
                    </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="bg-gradient-fitbuddy text-white font-bold px-8 py-3 rounded-lg hover:scale-105 transition-all shadow-lg"
                    >
                        Voir mon dashboard
                    </Link>
                    <Link
                        href="/dashboard/book"
                        className="bg-white border-2 border-primary-500 text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-primary-50 transition-all"
                    >
                        Réserver une session
                    </Link>
                </div>

                {/* Support */}
                <p className="text-sm text-gray-500 mt-8">
                    Besoin d'aide ?{' '}
                    <a href="mailto:contact@fitbuddy.ch" className="text-primary-600 hover:underline">
                        Contactez-nous
                    </a>
                </p>
            </div>
        </div>
    );
}
