'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    totalCoaches: number;
    totalClients: number;
    totalSessions: number;
    sessionsThisWeek: number;
    activePackages: number;
    totalConversations: number;
}

interface Coach {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    clientCount: number;
    sessionCount: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [coaches, setCoaches] = useState<Coach[]>([]);
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

        if (profile?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        await loadAdminData();
    };

    const loadAdminData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setCoaches(data.coaches || []);
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard-admin">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition">
                                Fitbuddy Admin
                            </h1>
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
                            href="/dashboard-admin"
                            className="py-3 px-2 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard-admin/coaches"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Coaches
                        </Link>
                        <Link
                            href="/dashboard-admin/clients"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Tous les Clients
                        </Link>
                        <Link
                            href="/dashboard-admin/sessions"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Toutes les Sessions
                        </Link>
                        <Link
                            href="/dashboard-coach/messages"
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Messages WhatsApp
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin - Vue Globale</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                            {/* Total Coaches */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Coaches</p>
                                        <p className="text-3xl font-bold text-purple-600 mt-2">
                                            {stats?.totalCoaches || 0}
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Clients */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Clients</p>
                                        <p className="text-3xl font-bold text-blue-600 mt-2">
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

                            {/* Total Sessions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Sessions Totales</p>
                                        <p className="text-3xl font-bold text-green-600 mt-2">
                                            {stats?.totalSessions || 0}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Sessions This Week */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Cette Semaine</p>
                                        <p className="text-3xl font-bold text-orange-600 mt-2">
                                            {stats?.sessionsThisWeek || 0}
                                        </p>
                                    </div>
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Active Packages */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Packages Actifs</p>
                                        <p className="text-3xl font-bold text-pink-600 mt-2">
                                            {stats?.activePackages || 0}
                                        </p>
                                    </div>
                                    <div className="bg-pink-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Conversations */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Conversations</p>
                                        <p className="text-3xl font-bold text-[#25D366] mt-2">
                                            {stats?.totalConversations || 0}
                                        </p>
                                    </div>
                                    <div className="bg-[#25D366]/10 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coaches List */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Liste des Coaches</h3>
                                <Link
                                    href="/dashboard-admin/coaches"
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Voir tous →
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coach</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clients</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {coaches.slice(0, 10).map((coach) => (
                                            <tr key={coach.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {coach.first_name} {coach.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{coach.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-blue-600 font-semibold">{coach.clientCount}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-green-600 font-semibold">{coach.sessionCount}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(coach.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <Link href="/dashboard-admin/clients" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Tous les Clients</h4>
                                <p className="text-sm text-gray-600">Voir et gérer tous les clients de la plateforme</p>
                            </Link>
                            <Link href="/dashboard-admin/sessions" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Toutes les Sessions</h4>
                                <p className="text-sm text-gray-600">Consulter toutes les sessions planifiées</p>
                            </Link>
                            <Link href="/dashboard-admin/coaches" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                                <h4 className="font-semibold text-gray-900 mb-2">Gérer Coaches</h4>
                                <p className="text-sm text-gray-600">Ajouter ou gérer les coaches</p>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
