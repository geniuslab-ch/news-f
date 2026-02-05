'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Profile form
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUserId(user.id);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, phone, email')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setProfileData({
                first_name: profile?.first_name || '',
                last_name: profile?.last_name || '',
                email: profile?.email || user.email || '',
                phone: profile?.phone || '',
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    phone: profileData.phone,
                    email: profileData.email,
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('✅ Profil mis à jour avec succès!');
        } catch (error: any) {
            alert('Erreur: ' + (error.message || 'Impossible de sauvegarder'));
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new.length < 6) {
            alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (passwordData.new !== passwordData.confirm) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        setSaving(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.new,
            });

            if (error) throw error;

            alert('✅ Mot de passe changé avec succès!');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            alert('Erreur: ' + (error.message || 'Impossible de changer le mot de passe'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-transparent mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <DashboardHeader />

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-10 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-2xl">
                        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            ⚙️ Paramètres
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Gérez vos informations personnelles et votre compte
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Section */}
                        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">👤</span>
                                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                            </div>

                            <form onSubmit={handleProfileSave} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Prénom *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.first_name}
                                            onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Nom *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.last_name}
                                            onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <span className="text-xl">📱</span> Numéro WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+41 79 123 45 67"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                    />
                                    <p className="text-xs text-gray-600 mt-2 bg-purple-50 p-3 rounded-xl border border-purple-100">
                                        💡 Ce numéro sera utilisé pour vous envoyer les liens Google Meet de vos sessions
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder les modifications'}
                                </button>
                            </form>
                        </div>

                        {/* Password Section */}
                        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">🔒</span>
                                <h2 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h2>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        minLength={6}
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        minLength={6}
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {saving ? '⏳ Modification...' : '🔑 Modifier le mot de passe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
