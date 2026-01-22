'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ChooseRolePage() {
    const router = useRouter();
    const [selecting, setSelecting] = useState(false);

    const handleRoleSelect = async (role: 'client' | 'coach') => {
        setSelecting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Update user's role in profiles table
            const { error } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', user.id);

            if (error) throw error;

            // Redirect based on role
            if (role === 'coach') {
                router.push('/dashboard-coach');
            } else {
                router.push('/dashboard');
            }

        } catch (error: any) {
            alert('Erreur: ' + (error.message || 'Impossible de définir le rôle'));
            setSelecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue sur Fitbuddy! 👋</h1>
                    <p className="text-gray-600">
                        Pour continuer, veuillez sélectionner votre profil :
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Card */}
                    <button
                        onClick={() => handleRoleSelect('client')}
                        disabled={selecting}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 hover:border-purple-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
                    >
                        <div className="text-5xl mb-4">👤</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Je suis un Client</h2>
                        <p className="text-gray-600">
                            Je cherche à bénéficier d'un coaching personnalisé pour atteindre mes objectifs.
                        </p>
                        <div className="mt-6 text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Continuer en tant que client →
                        </div>
                    </button>

                    {/* Coach Card */}
                    <button
                        onClick={() => handleRoleSelect('coach')}
                        disabled={selecting}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
                    >
                        <div className="text-5xl mb-4">💪</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Je suis un Coach</h2>
                        <p className="text-gray-600">
                            Je souhaite accompagner des clients et gérer mes sessions de coaching.
                        </p>
                        <div className="mt-6 text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Continuer en tant que coach →
                        </div>
                    </button>
                </div>

                {selecting && (
                    <div className="mt-6 text-center text-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        Configuration de votre profil...
                    </div>
                )}
            </div>
        </div>
    );
}
