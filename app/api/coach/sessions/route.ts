import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/coach/sessions
 * 
 * Get all sessions for authenticated coach
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'upcoming'; // upcoming, past, all

        let query = supabase
            .from('sessions')
            .select(`
                *,
                profiles:user_id (
                    first_name,
                    last_name,
                    email
                )
            `)
            .eq('coach_id', user.id)
            .order('session_date', { ascending: false });

        // Apply filters
        const now = new Date().toISOString();
        if (filter === 'upcoming') {
            query = query.gte('session_date', now).in('status', ['scheduled', 'rescheduled']);
        } else if (filter === 'past') {
            query = query.lt('session_date', now);
        }

        const { data: sessions, error: sessionsError } = await query;

        if (sessionsError) {
            console.error('Error fetching sessions:', sessionsError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ sessions: sessions || [] });

    } catch (error: any) {
        console.error('💥 Coach sessions error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
