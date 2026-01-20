import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/whatsapp/conversations/[id]/messages
 * 
 * Get all messages in a specific conversation
 * Marks unread messages as read
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const conversationId = params.id;

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

        // Verify user owns this conversation
        const { data: conversation, error: convError } = await supabase
            .from('whatsapp_conversations')
            .select('*')
            .eq('id', conversationId)
            .eq('coach_id', user.id)
            .single();

        if (convError || !conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Get messages
        const { data: messages, error: messagesError } = await supabase
            .from('whatsapp_messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Mark inbound messages as read
        const unreadIds = messages
            .filter(m => m.direction === 'inbound' && !m.read_at)
            .map(m => m.id);

        if (unreadIds.length > 0) {
            await supabase
                .from('whatsapp_messages')
                .update({ read_at: new Date().toISOString() })
                .in('id', unreadIds);

            console.log(`✅ Marked ${unreadIds.length} messages as read`);
        }

        return NextResponse.json({ messages });

    } catch (error: any) {
        console.error('💥 Get messages error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
