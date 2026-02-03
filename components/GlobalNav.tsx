'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function GlobalNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo (1)FITBUDDY.png"
                        alt="Fitbuddy"
                        width={140}
                        height={46}
                        className="h-10 w-auto"
                    />
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-700 hover:text-primary-600 transition"
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/#programmes"
                        className="text-sm font-medium text-gray-700 hover:text-primary-600 transition"
                    >
                        Programmes
                    </Link>
                    <Link
                        href="/entreprises"
                        className="text-sm font-medium text-gray-700 hover:text-primary-600 transition"
                    >
                        Entreprises
                    </Link>

                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="bg-gradient-fitbuddy text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
                        >
                            Mon Espace
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-gradient-fitbuddy text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
