'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getActivePackage, getNextSession, getUserSessions, cancelSession } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import type { Package, Session } from '@/lib/supabase-helpers';
import PackageCard from '@/components/dashboard/PackageCard';
import SessionCard from '@/components/dashboard/SessionCard';

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
            // Get user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            // Get profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // Get active package
            const { data: packageData } = await getActivePackage(user.id);
            setActivePackage(packageData);

            // Get next session
            const { data: nextSessionData } = await getNextSession(user.id);
            setNextSession(nextSessionData);

            // Get recent sessions
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

        console.log('🔴 Cancel clicked for session:', sessionId);

        const confirmed = window.confirm('Êtes-vous sûr de vouloir annuler cette session ?');
        console.log('✅ User confirmed:', confirmed);

        if (!confirmed) return;

        setCancellingId(sessionId);

        try {
            console.log('📡 Calling cancelSession API...');
            const result = await cancelSession(sessionId, user.id);

            console.log('📦 Cancel result:', result);

            if (result.error) {
                console.error('❌ Cancel error:', result.error);
                alert(`Erreur: ${result.error.message || 'Impossible d\'annuler la session'}`);
                return;
            }

            console.log('✅ Session cancelled successfully, refreshing dashboard...');
            await loadDashboard(); // Refresh dashboard
        } catch (error) {
            console.error('💥 Exception during cancel:', error);
            alert('Erreur lors de l\'annulation. Veuillez réessayer.');
        } finally {
            setCancellingId(null);
        }
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
                    <Link href="/" className="text-2xl font-bold text-gradient">
                        Fitbuddy
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-semibold text-primary-600">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/sessions" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Mes sessions
                        </Link>
                        <div className="flex items-center gap-4 border-l border-gray-300 pl-6">
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
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Tableau de bord
                    </h1>

                    {/* Package Card */}
                    <div className="mb-8">
                        <PackageCard package={activePackage} loading={loading} />
                    </div>

                    {/* Next Session */}
                    {nextSession && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Prochaine session</h2>
                            <SessionCard session={nextSession} onCancel={handleCancel} cancelling={cancellingId === nextSession.id} />
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <Link
                            href="/dashboard/book"
                            className="bg-gradient-fitbuddy text-white p-6 rounded-xl hover:scale-105 transition-all shadow-lg group"
                        >
                            <div className="text-4xl mb-2">📅</div>
                            <h3 className="text-lg font-bold mb-1">Réserver une session</h3>
                            <p className="text-white/90 text-sm">Planifiez votre prochain coaching</p>
                        </Link>

                        <Link
                            href="/dashboard/sessions"
                            className="bg-white border-2 border-primary-200 p-6 rounded-xl hover:border-primary-400 hover:shadow-lg transition-all group"
                        >
                            <div className="text-4xl mb-2">📖</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Historique complet</h3>
                            <p className="text-gray-600 text-sm">Voir toutes vos sessions</p>
                        </Link>
                    </div>

                    {/* Recent Sessions */}
                    {recentSessions.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Sessions récentes</h2>
                                <Link href="/dashboard/sessions" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                                    Voir tout →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentSessions.map((session) => (
                                    <SessionCard key={session.id} session={session} onCancel={handleCancel} cancelling={cancellingId === session.id} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No sessions */}
                    {recentSessions.length === 0 && !nextSession && (
                        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune session programmée</h3>
                            <p className="text-gray-600 mb-4">
                                Réservez votre première session pour commencer votre transformation !
                            </p>
                            <Link
                                href="/dashboard/book"
                                className="inline-block bg-gradient-fitbuddy text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all"
                            >
                                Réserver maintenant
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
