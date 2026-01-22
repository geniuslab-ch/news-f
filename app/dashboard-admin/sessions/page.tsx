'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Session {
    id: string;
    session_date: string;
    status: string;
    user_id: string;
    profiles?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

interface Client {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export default function SessionsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        user_id: '',
        session_date: '',
        status: 'scheduled',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadSessions();
        loadClients();
    }, []);

    const loadSessions = async () => {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select(`
                    *,
                    profiles!sessions_user_id_fkey (
                        first_name,
                        last_name,
                        email
                    )
                `)
                .order('session_date', { ascending: false })
                .limit(100);

            if (error) {
                console.error('Error loading sessions:', error);
                alert(`Erreur de chargement: ${error.message}`);
                return;
            }

            console.log('Sessions loaded:', data?.length || 0);
            setSessions(data || []);
        } catch (error) {
            console.error('Exception loading sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('id, email, first_name, last_name')
                .eq('role', 'client')
                .order('first_name', { ascending: true });

            setClients(data || []);
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    };

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const { data, error } = await supabase
                .from('sessions')
                .insert({
                    user_id: formData.user_id,
                    session_date: formData.session_date,
                    status: formData.status,
                })
                .select();

            if (error) {
                console.error('Session creation error:', error);
                throw error;
            }

            console.log('Session created:', data);
            alert('Session créée avec succès !');
            setShowCreateModal(false);
            setFormData({ user_id: '', session_date: '', status: 'scheduled' });

            // Reload the sessions list
            await loadSessions();
        } catch (error: any) {
            alert('Erreur: ' + (error.message || 'Impossible de créer la session'));
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            rescheduled: 'bg-yellow-100 text-yellow-800',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard-admin">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
                            Fitbuddy Admin
                        </h1>
                    </Link>
                    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
                        Déconnexion
                    </button>
                </div>
                <nav className="px-4 border-t border-gray-100">
                    <div className="flex gap-6 overflow-x-auto">
                        <Link href="/dashboard-admin" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Dashboard
                        </Link>
                        <Link href="/dashboard-admin/coaches" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Coaches
                        </Link>
                        <Link href="/dashboard-admin/clients" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Tous les Clients
                        </Link>
                        <Link href="/dashboard-admin/sessions" className="py-3 px-2 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap">
                            Toutes les Sessions
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Toutes les Sessions</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Créer une Session
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {session.profiles?.first_name} {session.profiles?.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">{session.profiles?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(session.session_date).toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Create Session Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Créer une Session</h3>
                        <form onSubmit={handleCreateSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                                <select
                                    required
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                >
                                    <option value="">Sélectionner un client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name} ({client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date et Heure *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.session_date}
                                    onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                >
                                    <option value="scheduled">Planifiée</option>
                                    <option value="completed">Complétée</option>
                                    <option value="cancelled">Annulée</option>
                                    <option value="rescheduled">Reportée</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    disabled={creating}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    disabled={creating}
                                >
                                    {creating ? 'Création...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
