'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getActivePackage, getNextSession, getUserSessions, cancelSession } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import type { Package, Session } from '@/lib/supabase-helpers';
import PackageCard from '@/components/dashboard/PackageCard';
import SessionCard from '@/components/dashboard/SessionCard';
import ProgramSelector from '@/components/dashboard/ProgramSelector';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [activePackage, setActivePackage] = useState<Package | null>(null);
    const [nextSession, setNextSession] = useState<Session | null>(null);
    const [recentSessions, setRecentSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            const { data: packageData } = await getActivePackage(user.id);
            setActivePackage(packageData);

            const { data: nextSessionData } = await getNextSession(user.id);
            setNextSession(nextSessionData);

            const { data: sessionsData } = await getUserSessions(user.id);
            setRecentSessions(sessionsData?.slice(0, 3) || []);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const handleCancel = async (sessionId: string) => {
        if (!user) return;

        const confirmed = window.confirm('Êtes-vous sûr de vouloir annuler cette session ?');
        if (!confirmed) return;

        setCancellingId(sessionId);

        try {
            const result = await cancelSession(sessionId, user.id);

            if (result.error) {
                alert(`Erreur: ${result.error.message || 'Impossible d\'annuler la session'}`);
                return;
            }

            await loadDashboard();
        } catch (error) {
            alert('Erreur lors de la suppression. Veuillez reessayer.');
        } finally {
            setCancellingId(null);
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
                    <p className="text-gray-700 font-semibold text-lg">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header moderne */}
            <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-100/50 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                            <Image
                                src="/logo (1)FITBUDDY.png"
                                alt="Fitbuddy"
                                width={150}
                                height={50}
                                className="h-12 w-auto transition-transform group-hover:scale-105"
                            />
                        </Link>

                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                🏠 Dashboard
                            </Link>
                            <Link
                                href="/dashboard/sessions"
                                className="px-4 py-2 rounded-full text-gray-700 hover:bg-white/80 font-medium text-sm transition-all hover:scale-105"
                            >
                                📖 Sessions
                            </Link>
                            <Link
                                href="/dashboard/book/recurring"
                                className="px-4 py-2 rounded-full text-gray-700 hover:bg-white/80 font-medium text-sm transition-all hover:scale-105"
                            >
                                🔄 Récurrentes
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="px-4 py-2 rounded-full text-gray-700 hover:bg-white/80 font-medium text-sm transition-all hover:scale-105"
                            >
                                ⚙️ Paramètres
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {profile?.first_name?.charAt(0) || 'C'}
                                </div>
                                <span className="font-semibold text-gray-800">
                                    {profile?.first_name || 'Client'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-all hover:bg-gray-100 rounded-full"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Section avec effet glassmorphism */}
                    <div className="mb-10 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-2xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Bienvenue, {profile?.first_name || 'Champion'} ! 👋
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Prêt à continuer votre transformation ? Voici votre espace personnalisé.
                        </p>
                    </div>

                    {/* Package Card ou Program Selector */}
                    <div className="mb-10">
                        {activePackage ? (
                            <PackageCard package={activePackage} loading={loading} />
                        ) : (
                            <ProgramSelector />
                        )}
                    </div>

                    {/* Next Session avec style premium */}
                    {nextSession && (
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                                <span className="text-3xl">🎯</span>
                                Prochaine session
                            </h2>
                            <SessionCard
                                session={nextSession}
                                onCancel={handleCancel}
                                cancelling={cancellingId === nextSession.id}
                            />
                        </div>
                    )}

                    {/* Quick Actions avec animations */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <Link
                            href="/dashboard/book"
                            className="group relative bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative z-10">
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">📅</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Réserver une session</h3>
                                <p className="text-white/90">Planifiez votre prochain coaching maintenant</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/sessions"
                            className="group relative bg-white p-8 rounded-3xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative z-10">
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">📚</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Historique complet</h3>
                                <p className="text-gray-600">Consultez toutes vos sessions passées</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Sessions */}
                    {recentSessions.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <span className="text-3xl">⏱️</span>
                                    Sessions récentes
                                </h2>
                                <Link
                                    href="/dashboard/sessions"
                                    className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group"
                                >
                                    Voir tout
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onCancel={handleCancel}
                                        cancelling={cancellingId === session.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No sessions avec design engageant */}
                    {recentSessions.length === 0 && !nextSession && (
                        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-12 text-center border-2 border-purple-100 shadow-xl">
                            <div className="text-8xl mb-6 animate-bounce">🚀</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">C'est le moment de commencer !</h3>
                            <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
                                Réservez votre première session et démarrez votre transformation dès aujourd'hui.
                            </p>
                            <Link
                                href="/dashboard/book"
                                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110"
                            >
                                Réserver maintenant ✨
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
