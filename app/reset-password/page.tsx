'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First check if the user exists and how they signed up
            const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();

            // Since we can't use admin API from client, we'll try to send the reset email
            // Supabase will only send it if the user exists with email/password auth
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) {
                // Check if error message indicates OAuth user
                if (error.message.includes('OAuth') || error.message.includes('google')) {
                    setError('Ce compte utilise Google pour se connecter. Veuillez utiliser "Continuer avec Google" sur la page de connexion.');
                    setLoading(false);
                    return;
                }
                throw error;
            }

            setSent(true);
        } catch (error: any) {
            // If user signed up with Google, show appropriate message
            if (error.message?.toLowerCase().includes('user not found')) {
                setError('Aucun compte trouvé avec cet email. Vérifiez l\'orthographe ou créez un compte.');
            } else {
                setError('Erreur: ' + (error.message || 'Impossible d\'envoyer l\'email'));
            }
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé ✉️</h2>
                        <p className="text-gray-600 mb-6">
                            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                            Vérifiez votre boîte de réception (et vos spams).
                        </p>
                        <Link
                            href="/login"
                            className="inline-block text-purple-600 hover:text-purple-700 font-medium"
                        >
                            ← Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié?</h1>
                    <p className="text-gray-600">
                        Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
