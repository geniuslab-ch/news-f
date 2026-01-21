'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
    overview: {
        totalSessions: number;
        completedSessions: number;
        cancelledSessions: number;
        completionRate: number;
    };
    sessionsByMonth: { month: string; count: number }[];
    clientGrowth: { month: string; count: number }[];
    messaging: {
        activeConversations: number;
        totalMessages: number;
    };
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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

        await loadAnalytics();
    };

    const loadAnalytics = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/coach/analytics', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
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
                        <Link href="/dashboard-coach" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Dashboard
                        </Link>
                        <Link href="/dashboard-coach/clients" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Clients
                        </Link>
                        <Link href="/dashboard-coach/sessions" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Sessions
                        </Link>
                        <Link href="/dashboard-coach/analytics" className="py-3 px-2 border-b-2 border-primary-600 text-primary-600 font-medium whitespace-nowrap">
                            Analytics
                        </Link>
                        <Link href="/dashboard-coach/messages" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Messages
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : analytics ? (
                    <div className="space-y-6">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-sm text-gray-600 mb-2">Total Sessions</p>
                                <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalSessions}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-sm text-gray-600 mb-2">Complétées</p>
                                <p className="text-3xl font-bold text-green-600">{analytics.overview.completedSessions}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-sm text-gray-600 mb-2">Annulées</p>
                                <p className="text-3xl font-bold text-red-600">{analytics.overview.cancelledSessions}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-sm text-gray-600 mb-2">Taux Complétion</p>
                                <p className="text-3xl font-bold text-blue-600">{analytics.overview.completionRate}%</p>
                            </div>
                        </div>

                        {/* Sessions par Mois */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions par Mois</h3>
                            {analytics.sessionsByMonth.length > 0 ? (
                                <div className="space-y-3">
                                    {analytics.sessionsByMonth.reverse().map((item) => (
                                        <div key={item.month} className="flex items-center justify-between">
                                            <span className="text-gray-700">{formatMonth(item.month)}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-64 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary-600 h-2 rounded-full"
                                                        style={{ width: `${Math.min((item.count / Math.max(...analytics.sessionsByMonth.map(s => s.count))) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-semibold text-gray-900 w-8 text-right">{item.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Aucune donnée disponible</p>
                            )}
                        </div>

                        {/* Croissance Clients */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveaux Clients par Mois</h3>
                            {analytics.clientGrowth.length > 0 ? (
                                <div className="space-y-3">
                                    {analytics.clientGrowth.reverse().map((item) => (
                                        <div key={item.month} className="flex items-center justify-between">
                                            <span className="text-gray-700">{formatMonth(item.month)}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-64 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${Math.min((item.count / Math.max(...analytics.clientGrowth.map(s => s.count))) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-semibold text-gray-900 w-8 text-right">{item.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Aucune donnée disponible</p>
                            )}
                        </div>

                        {/* Messaging Stats */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Messagerie</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Conversations Actives</p>
                                    <p className="text-4xl font-bold text-gray-900">{analytics.messaging.activeConversations}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Total Messages</p>
                                    <p className="text-4xl font-bold text-gray-900">{analytics.messaging.totalMessages}</p>
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg shadow p-6 border border-primary-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📈</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Performance</p>
                                        <p className="text-sm text-gray-600">
                                            Taux de complétion de {analytics.overview.completionRate}%
                                            {analytics.overview.completionRate >= 80 ? ' - Excellent !' : analytics.overview.completionRate >= 60 ? ' - Bon' : ' - À améliorer'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Communication</p>
                                        <p className="text-sm text-gray-600">
                                            {analytics.messaging.activeConversations} conversation(s) active(s) -
                                            {analytics.messaging.activeConversations > 0 ? ' Restez connecté avec vos clients' : ' Encouragez vos clients à vous contacter'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">Erreur de chargement des analytics</p>
                    </div>
                )}
            </main>
        </div>
    );
}
