'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Coach {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export default function CoachesPage() {
    const router = useRouter();
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCoaches();
    }, []);

    const loadCoaches = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'coach')
                .order('created_at', { ascending: false });

            setCoaches(data || []);
        } catch (error) {
            console.error('Error loading coaches:', error);
        } finally {
            setLoading(false);
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
                        <Link href="/dashboard-admin/coaches" className="py-3 px-2 border-b-2 border-purple-600 text-purple-600 font-medium whitespace-nowrap">
                            Coaches
                        </Link>
                        <Link href="/dashboard-admin/clients" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Tous les Clients
                        </Link>
                        <Link href="/dashboard-admin/sessions" className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap">
                            Toutes les Sessions
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Coaches</h2>

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
                                {coaches.map((coach) => (
                                    <tr key={coach.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {coach.first_name} {coach.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{coach.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(coach.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
