import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabase } from '@/lib/supabase';

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * POST /api/whatsapp/send-public
 * 
 * Public endpoint for sending initial WhatsApp message from widget
 * Does NOT require authentication (used by website visitors)
 * Creates conversation assigned to first available coach
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, name, message } = body;

        if (!to || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, message' },
                { status: 400 }
            );
        }

        console.log('📤 Public send - WhatsApp message:', {
            to,
            name: name || 'Unknown',
            message: message.substring(0, 50),
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

        // Get first available coach for assignment
        const { data: coaches } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'coach')
            .limit(1);

        const coachId = coaches?.[0]?.id;

        if (!coachId) {
            console.error('⚠️ No coaches found - message sent but no conversation created');
            return NextResponse.json({
                success: true,
                messageSid: twilioMessage.sid,
                warning: 'Message sent but no coach available for assignment',
            });
        }

        // Find or create conversation
        let conversation;
        const { data: existing } = await supabase
            .from('whatsapp_conversations')
            .select('*')
            .eq('client_phone', toPhone)
            .eq('coach_id', coachId)
            .maybeSingle();

        if (existing) {
            conversation = existing;
            console.log('📂 Using existing conversation:', conversation.id);
        } else {
            // Create new conversation
            const { data: newConv } = await supabase
                .from('whatsapp_conversations')
                .insert({
                    client_phone: toPhone,
                    client_name: name || null,
                    coach_id: coachId,
                    status: 'active',
                    last_message_at: new Date().toISOString(),
                })
                .select()
                .single();

            conversation = newConv;
            console.log('✅ Created new conversation:', conversation.id);
        }

        if (!conversation) {
            console.error('❌ Failed to create conversation');
            return NextResponse.json({
                success: true,
                messageSid: twilioMessage.sid,
                warning: 'Message sent but conversation not stored',
            });
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
        } else {
            console.log('✅ Message stored in database');
        }

        return NextResponse.json({
            success: true,
            messageSid: twilioMessage.sid,
            conversationId: conversation.id,
        });

    } catch (error: any) {
        console.error('💥 Send message error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}
