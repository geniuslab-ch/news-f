import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/coach/clients
 * 
 * Get all clients for authenticated coach
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

        // Get all clients who have sessions with this coach
        const { data: clients, error: clientsError } = await supabase
            .from('profiles')
            .select(`
                id,
                email,
                first_name,
                last_name,
                phone,
                created_at,
                packages!inner (
                    id,
                    package_type,
                    sessions_remaining,
                    status,
                    end_date
                )
            `)
            .eq('role', 'client')
            .in('id',
                supabase
                    .from('sessions')
                    .select('user_id')
                    .eq('coach_id', user.id)
            );

        if (clientsError) {
            console.error('Error fetching clients:', clientsError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Get last session for each client
        const clientsWithSessions = await Promise.all(
            (clients || []).map(async (client) => {
                const { data: lastSession } = await supabase
                    .from('sessions')
                    .select('session_date, status')
                    .eq('user_id', client.id)
                    .eq('coach_id', user.id)
                    .order('session_date', { ascending: false })
                    .limit(1)
                    .single();

                return {
                    ...client,
                    lastSession,
                };
            })
        );

        return NextResponse.json({ clients: clientsWithSessions });

    } catch (error: any) {
        console.error('💥 Coach clients error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
