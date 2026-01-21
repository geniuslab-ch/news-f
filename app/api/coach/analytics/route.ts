import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/coach/analytics
 * 
 * Get analytics data for coach dashboard
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

        // Get all sessions for this coach
        const { data: allSessions } = await supabase
            .from('sessions')
            .select('*')
            .eq('coach_id', user.id);

        const totalSessions = allSessions?.length || 0;
        const completedSessions = allSessions?.filter(s => s.status === 'completed').length || 0;
        const cancelledSessions = allSessions?.filter(s => s.status === 'cancelled').length || 0;
        const completionRate = totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : '0';

        // Get sessions by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: recentSessions } = await supabase
            .from('sessions')
            .select('session_date, status')
            .eq('coach_id', user.id)
            .gte('session_date', sixMonthsAgo.toISOString());

        // Group by month
        const sessionsByMonth: { [key: string]: number } = {};
        recentSessions?.forEach(session => {
            const date = new Date(session.session_date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            sessionsByMonth[monthKey] = (sessionsByMonth[monthKey] || 0) + 1;
        });

        // Get clients growth (unique clients per month)
        const { data: sessionUsers } = await supabase
            .from('sessions')
            .select('user_id, created_at')
            .eq('coach_id', user.id)
            .gte('created_at', sixMonthsAgo.toISOString());

        const clientsByMonth: { [key: string]: Set<string> } = {};
        sessionUsers?.forEach(session => {
            const date = new Date(session.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!clientsByMonth[monthKey]) {
                clientsByMonth[monthKey] = new Set();
            }
            clientsByMonth[monthKey].add(session.user_id);
        });

        const clientGrowth = Object.entries(clientsByMonth).map(([month, clients]) => ({
            month,
            count: clients.size
        }));

        // Get active conversations
        const { count: activeConversations } = await supabase
            .from('whatsapp_conversations')
            .select('*', { count: 'exact', head: true })
            .eq('coach_id', user.id)
            .eq('status', 'active');

        const { count: totalMessages } = await supabase
            .from('whatsapp_messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id',
                (await supabase
                    .from('whatsapp_conversations')
                    .select('id')
                    .eq('coach_id', user.id)
                ).data?.map(c => c.id) || []
            );

        return NextResponse.json({
            overview: {
                totalSessions,
                completedSessions,
                cancelledSessions,
                completionRate: parseFloat(completionRate),
            },
            sessionsByMonth: Object.entries(sessionsByMonth).map(([month, count]) => ({
                month,
                count
            })),
            clientGrowth,
            messaging: {
                activeConversations: activeConversations || 0,
                totalMessages: totalMessages || 0,
            }
        });

    } catch (error: any) {
        console.error('💥 Coach analytics error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
