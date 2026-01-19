'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getActivePackage } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import type { Package } from '@/lib/supabase-helpers';

export default function BookPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activePackage, setActivePackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<'discovery' | 'coaching' | 'coaching_followup'>('coaching_followup');

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            // Get active package
            const { data: packageData } = await getActivePackage(user.id);
            setActivePackage(packageData);

        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Build Cal.com URL with user info
    const calLink = selectedType === 'discovery'
        ? `https://app.cal.eu/fitbuddy/15min?email=${user?.email || ''}&name=${user?.user_metadata?.first_name || ''}`
        : selectedType === 'coaching_followup'
            ? `https://app.cal.eu/fitbuddy/session-coaching-suivi-45-min?email=${user?.email || ''}&name=${user?.user_metadata?.first_name || ''}`
            : `https://app.cal.eu/fitbuddy/45min?email=${user?.email || ''}&name=${user?.user_metadata?.first_name || ''}`;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-primary-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-gradient">
                        Fitbuddy
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/sessions" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Mes sessions
                        </Link>
                        <div className="flex items-center gap-4 border-l border-gray-300 pl-6">
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10">
                <div className="max-w-2xl mx-auto">
                    {/* Back Link */}
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                        ← Retour au dashboard
                    </Link>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📅 Réserver une session
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Choisissez le type de rendez-vous et planifiez votre session.
                    </p>

                    {/* Package Info */}
                    {activePackage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-green-800">
                                ✅ Vous avez <span className="font-bold">{activePackage.sessions_remaining} sessions restantes</span> dans votre forfait.
                            </p>
                        </div>
                    )}

                    {/* Type Selection */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Type de session</h2>

                        <div className="space-y-3">
                            {/* Coaching Followup Only */}
                            <label className="flex items-start gap-3 p-4 border-2 border-primary-500 rounded-lg cursor-pointer bg-primary-50">
                                <input
                                    type="radio"
                                    name="session-type"
                                    value="coaching_followup"
                                    checked={true}
                                    readOnly
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900 mb-1">🔄 Coaching Suivi (45 min)</div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Session de suivi pour continuer votre progression.
                                    </p>
                                    <p className="text-sm font-bold text-primary-600">
                                        Cette session sera déduite de votre forfait.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 text-center border-2 border-primary-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Prêt à réserver ?
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Vous allez être redirigé vers Cal.com pour choisir votre créneau horaire.
                        </p>

                        <a
                            href={calLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-fitbuddy text-white font-bold text-lg px-10 py-4 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl btn-shine"
                        >
                            📅 Ouvrir le calendrier →
                        </a>

                        <p className="text-xs text-gray-600 mt-4">
                            Un nouvel onglet s'ouvrira avec le calendrier de réservation.
                        </p>
                    </div>

                    {/* No Package Warning */}
                    {!activePackage && selectedType === 'coaching' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                            <p className="text-sm text-orange-800">
                                ⚠️ Vous n'avez pas de forfait actif. Vous pouvez réserver une session découverte gratuite ou{' '}
                                <Link href="/#pricing" className="font-semibold underline">
                                    choisir un forfait
                                </Link>.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
