'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserSessions, cancelSession } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import type { Session } from '@/lib/supabase-helpers';
import SessionCard from '@/components/dashboard/SessionCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

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

        const confirmed = window.confirm('Êtes-vous sûr de vouloir annuler cette session ?');
        if (!confirmed) return;

        setCancellingId(sessionId);

        try {
            const result = await cancelSession(sessionId, user.id);

            if (result.error) {
                alert(`Erreur: ${result.error.message || 'Impossible d\'annuler la session'}`);
                return;
            }

            await loadSessions();
        } catch (error) {
            alert('Erreur lors de la suppression. Veuillez reessayer.');
        } finally {
            setCancellingId(null);
        }
    };

    const upcomingSessions = sessions.filter(s => new Date(s.session_date) >= new Date());
    const pastSessions = sessions.filter(s => new Date(s.session_date) < new Date());

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
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-10 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                    📖 Mes Sessions
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Consultez et gérez toutes vos sessions de coaching
                                </p>
                            </div>
                            <Link
                                href="/dashboard/book"
                                className="hidden md:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110"
                            >
                                + Nouvelle session
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 mb-8 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${filter === 'all'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                                    : 'bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-400 hover:scale-105'
                                }`}
                        >
                            Toutes ({sessions.length})
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${filter === 'upcoming'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                                    : 'bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-400 hover:scale-105'
                                }`}
                        >
                            À venir ({upcomingSessions.length})
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${filter === 'past'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                                    : 'bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-400 hover:scale-105'
                                }`}
                        >
                            Passées ({pastSessions.length})
                        </button>
                    </div>

                    {/* Sessions List */}
                    {sessions.length > 0 && (
                        <div className="space-y-4">
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
                    {sessions.length === 0 && (
                        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-12 text-center border-2 border-purple-100 shadow-xl">
                            <div className="text-8xl mb-6 animate-bounce">📅</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {filter === 'all' && 'Aucune session'}
                                {filter === 'upcoming' && 'Aucune session à venir'}
                                {filter === 'past' && 'Aucune session passée'}
                            </h3>
                            <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
                                {filter === 'all' && 'Réservez votre première session pour commencer !'}
                                {filter === 'upcoming' && 'Réservez une session pour continuer votre progression.'}
                                {filter === 'past' && 'Vos sessions passées apparaîtront ici.'}
                            </p>
                            {filter !== 'past' && (
                                <Link
                                    href="/dashboard/book"
                                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110"
                                >
                                    Réserver une session ✨
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
