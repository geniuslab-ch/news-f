'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            // Get the current session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (!session) {
                router.push('/login');
                return;
            }

            // Check if user has a role assigned
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            console.log('🔍 Profile data:', profile);
            console.log('🔍 Profile role:', profile?.role);

            // If no role or role is null, redirect to choose-role page
            if (!profile?.role) {
                console.log('➡️ No role found, redirecting to choose-role');
                router.push('/choose-role');
                return;
            }

            console.log('✅ Role found:', profile.role);

            // Redirect based on role
            if (profile.role === 'admin') {
                router.push('/dashboard-admin');
            } else if (profile.role === 'coach') {
                router.push('/dashboard-coach');
            } else {
                router.push('/dashboard');
            }

        } catch (error) {
            console.error('Error in auth callback:', error);
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Connexion en cours...</p>
            </div>
        </div>
    );
}
