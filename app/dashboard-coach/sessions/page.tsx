'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Session {
    id: string;
    session_date: string;
    status: string;
    gmeet_link: string;
    notes: string;
    profiles: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function SessionsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

    useEffect(() => {
        checkAuthAndLoadData();
    }, [filter]);

    const checkAuthAndLoadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'coach') {
            router.push('/dashboard');
            return;
        }

        await loadSessions();
    };

    const loadSessions = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`/api/coach/sessions?filter=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions || []);
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            rescheduled: 'bg-yellow-100 text-yellow-800',
        };

        const labels = {
            scheduled: 'Planifiée',
            completed: 'Complétée',
            cancelled: 'Annulée',
            rescheduled: 'Replanifiée',
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    const groupSessionsByDate = (sessions: Session[]) => {
        const grouped: { [key: string]: Session[] } = {};

        sessions.forEach(session => {
            const date = new Date(session.session_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(session);
        });

        return grouped;
    };

    const groupedSessions = groupSessionsByDate(sessions);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard-coach">
                            <h1 className="text-2xl font-bold text-gradient cursor-pointer hover:opacity-80 transition">Fitbuddy Coach</h1>
                        </Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 border-t border-gray-100">
                    <div className="flex gap-6 overflow-x-auto">
                        <Link
                            href="/dashboard-coach"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard-coach/clients"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Clients
                        </Link>
                        <Link
                            href="/dashboard-coach/sessions"
                            className="py-3 px-2 border-b-2 border-primary-600 text-primary-600 font-medium whitespace-nowrap"
                        >
                            Sessions
                        </Link>
                        <Link
                            href="/dashboard-coach/messages"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Messages
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mes Sessions</h2>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'upcoming'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        À venir
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'past'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Passées
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Toutes
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">Aucune session trouvée</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900">{date}</h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {dateSessions.map((session) => (
                                        <div key={session.id} className="p-6 hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {session.profiles?.first_name} {session.profiles?.last_name}
                                                        </h4>
                                                        {getStatusBadge(session.status)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {formatDateTime(session.session_date)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {session.profiles?.email}
                                                    </p>
                                                    {session.notes && (
                                                        <p className="mt-2 text-sm text-gray-600 italic">
                                                            Note: {session.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {session.gmeet_link && (
                                                        <a
                                                            href={session.gmeet_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                                        >
                                                            Google Meet
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/dashboard-coach/messages`}
                                                        className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        Message
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Total Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Planifiées</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {sessions.filter(s => s.status === 'scheduled').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Complétées</p>
                            <p className="text-2xl font-bold text-green-600">
                                {sessions.filter(s => s.status === 'completed').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Annulées</p>
                            <p className="text-2xl font-bold text-red-600">
                                {sessions.filter(s => s.status === 'cancelled').length}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
