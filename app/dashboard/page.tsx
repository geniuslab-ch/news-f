'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);
        } catch (error) {
            console.error('Error:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-primary-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gradient">Fitbuddy</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Bonjour, <span className="font-semibold">{profile?.first_name || 'Client'}</span> !
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Card */}
                    <div className="bg-gradient-fitbuddy rounded-2xl p-8 text-white mb-8 shadow-xl">
                        <h2 className="text-3xl font-bold mb-2">
                            Bienvenue dans votre espace Fitbuddy ! 🎉
                        </h2>
                        <p className="text-white/90">
                            Votre portail client est maintenant actif. Gérez vos sessions de coaching, suivez votre progression et bien plus encore.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Package Card - Placeholder */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Votre forfait</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Aucun forfait actif pour le moment.
                            </p>
                            <a
                                href="/"
                                className="inline-block text-primary-600 font-semibold hover:text-primary-700"
                            >
                                Choisir un forfait →
                            </a>
                        </div>

                        {/* Sessions Card - Placeholder */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Prochaine session</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Aucune session programmée.
                            </p>
                            <a
                                href="/#signup"
                                className="inline-block text-primary-600 font-semibold hover:text-primary-700"
                            >
                                Réserver une session →
                            </a>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-primary-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🚧 Fonctionnalités à venir</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600">✓</span>
                                <span className="text-gray-700">Visualisation de votre forfait et sessions restantes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600">✓</span>
                                <span className="text-gray-700">Réservation de sessions directement depuis le dashboard</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600">✓</span>
                                <span className="text-gray-700">Historique complet de vos sessions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600">✓</span>
                                <span className="text-gray-700">Gestion de votre profil</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-600">✓</span>
                                <span className="text-gray-700">Paiements en ligne sécurisés (Stripe)</span>
                            </li>
                        </ul>
                    </div>

                    {/* User Info (for debugging) */}
                    <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">Informations du compte :</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>ID:</strong> {user?.id}</p>
                            <p><strong>Créé le:</strong> {user?.created_at && new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
