'use client';

import Link from 'next/link';

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                {/* Cancel Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-5xl">⚠️</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Paiement annulé
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-8">
                    Votre paiement a été annulé. Aucun montant n'a été débité.
                </p>

                {/* Info Box */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-bold text-gray-900 mb-3">Que s'est-il passé ?</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Vous avez annulé le processus de paiement ou fermé la fenêtre de paiement avant la fin de la transaction.
                    </p>
                    <p className="text-sm text-gray-700">
                        Vous pouvez réessayer à tout moment en sélectionnant à nouveau un forfait.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard/checkout"
                        className="bg-gradient-fitbuddy text-white font-bold px-8 py-3 rounded-lg hover:scale-105 transition-all shadow-lg"
                    >
                        Choisir un forfait
                    </Link>
                    <Link
                        href="/dashboard"
                        className="bg-white border-2 border-gray-300 text-gray-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Retour au dashboard
                    </Link>
                </div>

                {/* Support */}
                <p className="text-sm text-gray-500 mt-8">
                    Des questions ?{' '}
                    <a href="mailto:contact@fitbuddy.ch" className="text-primary-600 hover:underline">
                        Contactez notre support
                    </a>
                </p>
            </div>
        </div>
    );
}
