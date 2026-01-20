import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/whatsapp/conversations
 * 
 * Get all conversations for authenticated coach
 * Returns conversations with latest message preview and unread count
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

        // Get conversations for this coach
        const { data: conversations, error } = await supabase
            .from('whatsapp_conversations')
            .select(`
                *,
                messages:whatsapp_messages (
                    id,
                    body,
                    created_at,
                    direction,
                    read_at
                )
            `)
            .eq('coach_id', user.id)
            .order('last_message_at', { ascending: false });

        if (error) {
            console.error('Error fetching conversations:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Format response with unread count and last message
        const formatted = conversations.map((conv: any) => {
            const messages = conv.messages || [];
            const lastMessage = messages[0];
            const unreadCount = messages.filter(
                (m: any) => m.direction === 'inbound' && !m.read_at
            ).length;

            return {
                id: conv.id,
                clientPhone: conv.client_phone,
                clientName: conv.client_name,
                status: conv.status,
                lastMessage: lastMessage?.body || '',
                lastMessageAt: conv.last_message_at,
                unreadCount,
                createdAt: conv.created_at,
            };
        });

        return NextResponse.json({ conversations: formatted });

    } catch (error: any) {
        console.error('💥 Get conversations error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
