import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/dashboard
 * 
 * Get global dashboard statistics for admin (super-coach)
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

        // Verify admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        // Get total coaches
        const { count: totalCoaches } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'coach');

        // Get total clients
        const { count: totalClients } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'client');

        // Get total sessions
        const { count: totalSessions } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true });

        // Get sessions this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { count: sessionsThisWeek } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .gte('session_date', oneWeekAgo.toISOString());

        // Get active packages
        const { count: activePackages } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gte('end_date', new Date().toISOString());

        // Get WhatsApp conversations
        const { count: totalConversations } = await supabase
            .from('whatsapp_conversations')
            .select('*', { count: 'exact', head: true });

        // Get all coaches with their client counts
        const { data: coaches } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, created_at')
            .eq('role', 'coach')
            .order('created_at', { ascending: false });

        // For each coach, get their client count
        const coachesWithStats = await Promise.all(
            (coaches || []).map(async (coach) => {
                const { count: clientCount } = await supabase
                    .from('sessions')
                    .select('user_id', { count: 'exact', head: true })
                    .eq('coach_id', coach.id);

                const { count: sessionCount } = await supabase
                    .from('sessions')
                    .select('*', { count: 'exact', head: true })
                    .eq('coach_id', coach.id);

                return {
                    ...coach,
                    clientCount: clientCount || 0,
                    sessionCount: sessionCount || 0,
                };
            })
        );

        return NextResponse.json({
            stats: {
                totalCoaches: totalCoaches || 0,
                totalClients: totalClients || 0,
                totalSessions: totalSessions || 0,
                sessionsThisWeek: sessionsThisWeek || 0,
                activePackages: activePackages || 0,
                totalConversations: totalConversations || 0,
            },
            coaches: coachesWithStats,
        });

    } catch (error: any) {
        console.error('💥 Admin dashboard error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
