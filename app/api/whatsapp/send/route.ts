import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * POST /api/whatsapp/send
 * 
 * Send WhatsApp message via Twilio
 * Creates conversation if it doesn't exist
 * Stores message in database
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, message, conversationId } = body;

        if (!to || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, message' },
                { status: 400 }
            );
        }

        // Get authenticated user from token
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create Supabase client with user's token
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

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is a coach
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'coach' && profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Only coaches can send messages' },
                { status: 403 }
            );
        }

        console.log('📤 Sending WhatsApp message:', {
            to,
            message: message.substring(0, 50),
            coachId: user.id,
        });

        // Format phone number for Twilio
        const toPhone = to.startsWith('+') ? to : `+${to}`;
        const fromPhone = process.env.TWILIO_WHATSAPP_FROM!;

        // Send message via Twilio
        const twilioMessage = await twilioClient.messages.create({
            from: fromPhone,
            to: `whatsapp:${toPhone}`,
            body: message,
        });

        console.log('✅ Twilio message sent:', twilioMessage.sid);

        // Find or create conversation
        let conversation;
        if (conversationId) {
            // Use existing conversation
            // Use existing conversation
            let query = supabase
                .from('whatsapp_conversations')
                .select('*')
                .eq('id', conversationId);

            // Only restrict by coach_id if not admin
            if (profile.role !== 'admin') {
                query = query.eq('coach_id', user.id);
            }

            const { data } = await query.single();

            conversation = data;
        } else {
            // Find or create conversation
            // Find or create conversation
            let query = supabase
                .from('whatsapp_conversations')
                .select('*')
                .eq('client_phone', toPhone);

            if (profile.role !== 'admin') {
                query = query.eq('coach_id', user.id);
            }
            
            const { data: existing } = await query.maybeSingle();

            if (existing) {
                conversation = existing;
            } else {
                // Create new conversation
                const { data: newConv } = await supabase
                    .from('whatsapp_conversations')
                    .insert({
                        client_phone: toPhone,
                        coach_id: user.id,
                        status: 'active',
                        last_message_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                conversation = newConv;
            }
        }

        if (!conversation) {
            return NextResponse.json(
                { error: 'Failed to create conversation' },
                { status: 500 }
            );
        }

        // Store message in database
        const { data: dbMessage, error: messageError } = await supabase
            .from('whatsapp_messages')
            .insert({
                conversation_id: conversation.id,
                message_sid: twilioMessage.sid,
                from_phone: fromPhone.replace('whatsapp:', ''),
                to_phone: toPhone,
                body: message,
                direction: 'outbound',
                status: 'sent',
                sent_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (messageError) {
            console.error('❌ Error storing message:', messageError);
            // Message was sent but not stored - log for debugging
        }

        console.log('✅ Message stored in database');

        return NextResponse.json({
            success: true,
            messageSid: twilioMessage.sid,
            conversationId: conversation.id,
            message: dbMessage,
        });

    } catch (error: any) {
        console.error('💥 Send message error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}
