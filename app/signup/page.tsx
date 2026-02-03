'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            // Create user account
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Update profile with names
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        role: 'client', // Default role
                    })
                    .eq('id', data.user.id);

                if (profileError) console.error('Profile update error:', profileError);

                // Redirect to dashboard
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error: any) {
            setError(error.message || 'Une erreur est survenue lors de la création du compte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-gradient">Fitbuddy</h1>
                    </Link>
                    <p className="text-gray-600 mt-2">Créez votre espace client</p>
                </div>

                {/* Signup Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe *
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="Min. 6 caractères"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmer mot de passe *
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="Répétez le mot de passe"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-fitbuddy text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                                Se connecter
                            </Link>
                        </p>
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 block">
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    En créant un compte, vous pourrez gérer vos sessions, suivre votre progression et accéder à votre forfait.
                </p>
            </div>
        </div>
    );
}
