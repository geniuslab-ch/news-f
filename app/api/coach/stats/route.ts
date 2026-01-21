import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/coach/stats
 * 
 * Get dashboard statistics for authenticated coach
 */
export async function GET(request: NextRequest) {
    try {
        // Get authenticated user
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

        // Get total clients (users who have sessions with this coach)
        const { count: totalClients } = await supabase
            .from('sessions')
            .select('user_id', { count: 'exact', head: true })
            .eq('coach_id', user.id);

        // Get sessions this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: sessionsThisWeek } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('coach_id', user.id)
            .gte('session_date', oneWeekAgo.toISOString());

        // Get unread WhatsApp messages
        const { count: unreadMessages } = await supabase
            .from('whatsapp_messages')
            .select('id', { count: 'exact', head: true })
            .eq('direction', 'inbound')
            .is('read_at', null)
            .in('conversation_id', 
                supabase
                    .from('whatsapp_conversations')
                    .select('id')
                    .eq('coach_id', user.id)
            );

        // Get active packages count
        const { count: activePackages } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gte('end_date', new Date().toISOString())
            .in('user_id',
                supabase
                    .from('sessions')
                    .select('user_id')
                    .eq('coach_id', user.id)
            );

        // Get upcoming sessions (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const { data: upcomingSessions } = await supabase
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
            .gte('session_date', new Date().toISOString())
            .lte('session_date', nextWeek.toISOString())
            .in('status', ['scheduled', 'rescheduled'])
            .order('session_date', { ascending: true })
            .limit(5);

        return NextResponse.json({
            stats: {
                totalClients: totalClients || 0,
                sessionsThisWeek: sessionsThisWeek || 0,
                unreadMessages: unreadMessages || 0,
                activePackages: activePackages || 0,
            },
            upcomingSessions: upcomingSessions || [],
        });

    } catch (error: any) {
        console.error('💥 Coach stats error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
