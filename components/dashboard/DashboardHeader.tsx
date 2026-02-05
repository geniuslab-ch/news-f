'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
    userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const isActive = (path: string) => pathname === path;

    const displayName = userName || profile?.first_name || 'Client';

    return (
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-100/50 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo - Clickable to Dashboard */}
                    <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
                        <Image
                            src="/logo (1)FITBUDDY.png"
                            alt="Fitbuddy"
                            width={150}
                            height={50}
                            className="h-12 w-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 ${isActive('/dashboard')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/80'
                                }`}
                        >
                            🏠 Dashboard
                        </Link>
                        <Link
                            href="/dashboard/sessions"
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 ${isActive('/dashboard/sessions')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/80'
                                }`}
                        >
                            📖 Sessions
                        </Link>
                        <Link
                            href="/dashboard/book/recurring"
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 ${isActive('/dashboard/book/recurring')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/80'
                                }`}
                        >
                            🔄 Récurrentes
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 ${isActive('/dashboard/settings')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/80'
                                }`}
                        >
                            ⚙️ Paramètres
                        </Link>
                    </nav>

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">
                                {displayName}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-all hover:bg-gray-100 rounded-full"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
