'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ClientPackage {
    id: string;
    package_type: string;
    sessions_remaining: number;
    status: string;
    end_date: string;
}

interface Client {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    created_at: string;
    packages: ClientPackage[];
    lastSession?: {
        session_date: string;
        status: string;
    };
}

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

        await loadClients();
    };

    const load Clients = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/coach/clients', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClients(data.clients || []);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const filteredClients = clients.filter(client => {
        const query = searchQuery.toLowerCase();
        return (
            client.first_name?.toLowerCase().includes(query) ||
            client.last_name?.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                            className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard-coach/clients"
                            className="py-3 px-2 border-b-2 border-primary-600 text-primary-600 font-medium whitespace-nowrap"
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
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mes Clients</h2>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">
                            {searchQuery ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Package
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sessions Restantes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dernière Session
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClients.map((client) => {
                                    const activePackage = client.packages?.find(p => p.status === 'active') || client.packages?.[0];

                                    return (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {client.first_name} {client.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{client.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {activePackage ? (
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {activePackage.package_type}
                                                        </div>
                                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(activePackage.status)}`}>
                                                            {activePackage.status}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 font-medium">
                                                    {activePackage?.sessions_remaining || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900">
                                                    {formatDate(client.lastSession?.session_date || '')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/dashboard-coach/messages`}
                                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    Message
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Total Clients</p>
                            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Packages Actifs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {clients.filter(c => c.packages?.some(p => p.status === 'active')).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Sessions Totales Restantes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {clients.reduce((sum, c) => {
                                    const activePackage = c.packages?.find(p => p.status === 'active');
                                    return sum + (activePackage?.sessions_remaining || 0);
                                }, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
