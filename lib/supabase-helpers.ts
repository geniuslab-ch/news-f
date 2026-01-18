import { supabase } from './supabase';

// Types
export interface Package {
    id: string;
    user_id: string;
    package_type: '1month' | '3months' | '6months' | '12months';
    total_sessions: number;
    sessions_used: number;
    sessions_remaining: number;
    price_chf: number;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled' | 'paused';
    stripe_subscription_id?: string;
    created_at: string;
}

export interface Session {
    id: string;
    user_id: string;
    package_id?: string;
    coach_name?: string;
    session_type: 'discovery' | 'coaching' | 'coaching_followup';
    session_date: string;
    duration_minutes: number;
    google_meet_link?: string;
    cal_com_booking_id?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
    notes?: string;
    created_at: string;
}

/**
 * Get the active package for a user
 */
export async function getActivePackage(userId: string) {
    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

    return { data: data as Package | null, error };
}

/**
 * Get all sessions for a user with optional filtering
 */
export async function getUserSessions(
    userId: string,
    filter?: 'upcoming' | 'past' | 'all'
) {
    let query = supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId);

    const now = new Date().toISOString();

    if (filter === 'upcoming') {
        query = query
            .gte('session_date', now)
            .in('status', ['scheduled', 'rescheduled']);
    } else if (filter === 'past') {
        query = query.lt('session_date', now);
    }

    const { data, error } = await query.order('session_date', {
        ascending: filter !== 'past'
    });

    return { data: data as Session[] | null, error };
}

/**
 * Get next upcoming session for a user
 */
export async function getNextSession(userId: string) {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('session_date', new Date().toISOString())
        .in('status', ['scheduled', 'rescheduled'])
        .order('session_date', { ascending: true })
        .limit(1)
        .single();

    return { data: data as Session | null, error };
}

/**
 * Cancel a session
 */
export async function cancelSession(sessionId: string, userId: string) {
    const { data, error } = await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId)
        .eq('user_id', userId) // Security check
        .select()
        .single();

    return { data: data as Session | null, error };
}

/**
 * Get package type details
 */
export function getPackageDetails(packageType: Package['package_type']) {
    const details = {
        '1month': { name: 'Formule 1 mois', sessions: 8, color: 'blue' },
        '3months': { name: 'Formule 3 mois', sessions: 24, color: 'green' },
        '6months': { name: 'Formule 6 mois', sessions: 48, color: 'purple' },
        '12months': { name: 'Formule 12 mois', sessions: 98, color: 'orange' },
    };

    return details[packageType];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: 'fr' | 'en' = 'fr') {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format time for display
 */
export function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get session status badge color
 */
export function getStatusColor(status: Session['status']) {
    const colors = {
        scheduled: 'bg-blue-100 text-blue-800',
        rescheduled: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        no_show: 'bg-gray-100 text-gray-800',
    };

    return colors[status];
}

/**
 * Get session status label
 */
export function getStatusLabel(status: Session['status'], lang: 'fr' | 'en' = 'fr') {
    const labels = {
        fr: {
            scheduled: 'Planifiée',
            rescheduled: 'Reportée',
            completed: 'Complétée',
            cancelled: 'Annulée',
            no_show: 'Absent',
        },
        en: {
            scheduled: 'Scheduled',
            rescheduled: 'Rescheduled',
            completed: 'Completed',
            cancelled: 'Cancelled',
            no_show: 'No Show',
        },
    };

    return labels[lang][status];
}
