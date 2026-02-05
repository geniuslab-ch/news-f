'use client';

import { useState } from 'react';
import type { Package } from '@/lib/supabase-helpers';
import { getPackageDetails, formatDate } from '@/lib/supabase-helpers';
import { supabase } from '@/lib/supabase';

interface PackageCardProps {
    package: Package | null;
    loading?: boolean;
}

export default function PackageCard({ package: pkg, loading }: PackageCardProps) {
    const [loadingPortal, setLoadingPortal] = useState(false);

    const handleManageSubscription = async () => {
        if (!pkg) return;

        setLoadingPortal(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Vous devez être connecté');
                return;
            }

            const response = await fetch('/api/stripe/customer-portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Erreur: ${data.error}`);
                return;
            }

            // Redirect to Stripe customer portal
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error opening customer portal:', error);
            alert('Erreur lors de l\'ouverture du portail client');
        } finally {
            setLoadingPortal(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-primary-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (!pkg) {
        return null; // Dashboard shows ProgramSelector instead
    }

    const details = getPackageDetails(pkg.package_type);
    const progressPercent = (pkg.sessions_used / pkg.total_sessions) * 100;
    const isExpiringSoon = new Date(pkg.end_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // 30 days

    return (
        <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl p-6 shadow-xl border-2 border-primary-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-fitbuddy rounded-full flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{details.name}</h3>
                        {pkg.price_chf && (
                            <p className="text-sm text-gray-600">CHF {pkg.price_chf.toFixed(2)}</p>
                        )}
                    </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    Actif
                </span>
            </div>

            {/* Sessions Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold text-gray-700">Sessions</span>
                    <span className="text-2xl font-bold text-gradient">
                        {pkg.sessions_remaining} <span className="text-sm text-gray-600">restantes</span>
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                        className="bg-gradient-fitbuddy h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                    <span>{pkg.sessions_used} utilisées</span>
                    <span>{pkg.total_sessions} totales</span>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-200">
                <div>
                    <p className="text-xs text-gray-600 mb-1">Date de début</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {formatDate(pkg.start_date)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-600 mb-1">Date de fin</p>
                    <p className={`text-sm font-semibold ${isExpiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                        {formatDate(pkg.end_date)}
                        {isExpiringSoon && <span className="ml-2">⚠️</span>}
                    </p>
                </div>
            </div>

            {/* Warning if expiring soon */}
            {isExpiringSoon && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                        ⚠️ Votre forfait expire bientôt. Pensez à le renouveler pour continuer votre progression !
                    </p>
                </div>
            )}

            {/* Manage Subscription Button */}
            {pkg.stripe_subscription_id && (
                <div className="mt-4 pt-4 border-t border-primary-200">
                    <button
                        onClick={handleManageSubscription}
                        disabled={loadingPortal}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loadingPortal ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                                Chargement...
                            </>
                        ) : (
                            <>
                                ⚙️ Gérer mon abonnement
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Annuler, modifier le paiement ou télécharger vos factures
                    </p>
                </div>
            )}
        </div>
    );
}
