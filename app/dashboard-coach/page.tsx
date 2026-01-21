'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    totalClients: number;
    sessionsThisWeek: number;
    unreadMessages: number;
    activePackages: number;
}

interface UpcomingSession {
    id: string;
    session_date: string;
    profiles: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function CoachDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthAndLoadData();
    }, []);

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

        await loadStats();
    };

    const loadStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/coach/stats', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setUpcomingSessions(data.upcomingSessions || []);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gradient">Fitbuddy Coach</h1>
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
                            className="py-3 px-2 border-b-2 border-primary-600 text-primary-600 font-medium whitespace-nowrap"
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
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Sessions
                        </Link>
                        <Link
                            href="/dashboard-coach/messages"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Messages
                            {stats && stats.unreadMessages > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                    {stats.unreadMessages}
                                </span>
                            )}
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Clients */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats?.totalClients || 0}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Sessions This Week */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Sessions (7 jours)</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats?.sessionsThisWeek || 0}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Unread Messages */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats?.unreadMessages || 0}
                                        </p>
                                    </div>
                                    <div className="bg-[#25D366]/10 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Active Packages */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Packages Actifs</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats?.activePackages || 0}
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines Sessions</h3>
                            {upcomingSessions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucune session à venir</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingSessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {session.profiles?.first_name} {session.profiles?.last_name}
                                                </p>
                                                <p className="text-sm text-gray-500">{session.profiles?.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDate(session.session_date)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link
                                href="/dashboard-coach/sessions"
                                className="mt-4 block text-center text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Voir toutes les sessions →
                            </Link>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <Link href="/dashboard-coach/clients" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Gérer Clients</h4>
                                <p className="text-sm text-gray-600">Voir et gérer vos clients</p>
                            </Link>
                            <Link href="/dashboard-coach/sessions" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Planifier Session</h4>
                                <p className="text-sm text-gray-600">Créer ou modifier une session</p>
                            </Link>
                            <Link href="/dashboard-coach/messages" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Messages WhatsApp</h4>
                                <p className="text-sm text-gray-600">Répondre aux messages clients</p>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
