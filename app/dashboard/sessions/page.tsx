'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserSessions, cancelSession } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import type { Session } from '@/lib/supabase-helpers';
import SessionCard from '@/components/dashboard/SessionCard';

export default function SessionsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        loadSessions();
    }, [filter]);

    const loadSessions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            const { data } = await getUserSessions(user.id, filter);
            setSessions(data || []);

        } catch (error) {
            console.error('Error loading sessions:', error);
        } finally {
            setLoading(false);
        }
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

            console.log('✅ Session cancelled successfully, refreshing sessions...');
            await loadSessions(); // Refresh list
        } catch (error) {
            console.error('💥 Exception during cancel:', error);
            alert('Erreur lors de l\'annulation. Veuillez réessayer.');
        } finally {
            setCancellingId(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const upcomingSessions = sessions.filter(s => new Date(s.session_date) >= new Date());
    const pastSessions = sessions.filter(s => new Date(s.session_date) < new Date());

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
                        <Link href="/dashboard/sessions" className="text-sm font-semibold text-primary-600">
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
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            📖 Historique des sessions
                        </h1>
                        <Link
                            href="/dashboard/book"
                            className="bg-gradient-fitbuddy text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all"
                        >
                            + Réserver
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                ? 'bg-gradient-fitbuddy text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
                                }`}
                        >
                            Toutes ({sessions.length})
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'upcoming'
                                ? 'bg-gradient-fitbuddy text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
                                }`}
                        >
                            À venir ({upcomingSessions.length})
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'past'
                                ? 'bg-gradient-fitbuddy text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
                                }`}
                        >
                            Passées ({pastSessions.length})
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto"></div>
                        </div>
                    )}

                    {/* Sessions List */}
                    {!loading && sessions.length > 0 && (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onCancel={handleCancel}
                                    cancelling={cancellingId === session.id}
                                />
                            ))}
                        </div>
                    )}

                    {/* No sessions */}
                    {!loading && sessions.length === 0 && (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {filter === 'all' && 'Aucune session'}
                                {filter === 'upcoming' && 'Aucune session à venir'}
                                {filter === 'past' && 'Aucune session passée'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'all' && 'Réservez votre première session pour commencer !'}
                                {filter === 'upcoming' && 'Réservez une session pour continuer votre progression.'}
                                {filter === 'past' && 'Vos sessions passées apparaîtront ici.'}
                            </p>
                            {filter !== 'past' && (
                                <Link
                                    href="/dashboard/book"
                                    className="inline-block bg-gradient-fitbuddy text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all"
                                >
                                    Réserver une session
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
