'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Service role client for admin operations (bypasses RLS)
const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Will upgrade on server side
);

interface Client {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'client')
                .order('created_at', { ascending: false });

            setClients(data || []);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            // Get current session for authorization
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert('Session expirée. Veuillez vous reconnecter.');
                router.push('/login');
                return;
            }

            // Call API endpoint to create client
            const response = await fetch('/api/admin/create-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Échec de la création du client');
            }

            alert('Client créé avec succès !');
            setShowAddModal(false);
            setFormData({ email: '', password: '', first_name: '', last_name: '', phone: '' });
            await loadClients();
        } catch (error: any) {
            alert('Erreur: ' + (error.message || 'Impossible de créer le client'));
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
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
                        <Link href="/dashboard-admin/clients" className="py-3 px-2 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap">
                            Tous les Clients
                        </Link>
                        <Link href="/dashboard-admin/sessions" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Toutes les Sessions
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Tous les Clients</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter un Client
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {client.first_name} {client.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(client.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Ajouter un Client</h3>
                        <form onSubmit={handleAddClient} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    placeholder="+41 XX XXX XX XX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format international recommandé (+41...)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    disabled={creating}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
