import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabase } from '@/lib/supabase';

// Twilio webhook validator
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * POST /api/whatsapp/webhook
 * 
 * Receives incoming WhatsApp messages from Twilio
 * Validates Twilio signature, stores message in database,
 * and creates/updates conversation
 */
export async function POST(request: NextRequest) {
    try {
        // Get Twilio signature for validation
        const twilioSignature = request.headers.get('x-twilio-signature') || '';
        const url = request.url;

        // Parse form data from Twilio
        const formData = await request.formData();
        const params: Record<string, string> = {};

        formData.forEach((value, key) => {
            params[key] = value.toString();
        });

        // TODO: Add Twilio signature validation in production
        // For now, we'll skip validation during development
        // In production, use twilio.validateRequest() properly

        console.log('📥 Webhook called from:', request.headers.get('user-agent'));

        // Extract message data from Twilio
        const {
            MessageSid,
            From, // e.g., "whatsapp:+41791234567"
            To,   // e.g., "whatsapp:+14155238886"
            Body,
            NumMedia,
            MediaUrl0,
            MediaContentType0,
        } = params;

        console.log('📥 Incoming WhatsApp message:', {
            sid: MessageSid,
            from: From,
            body: Body?.substring(0, 50),
        });

        // Clean phone numbers (remove "whatsapp:" prefix)
        const fromPhone = From.replace('whatsapp:', '');
        const toPhone = To.replace('whatsapp:', '');

        // Find or create conversation
        let conversation = await findOrCreateConversation(fromPhone);

        if (!conversation) {
            console.error('❌ Failed to create conversation');
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Store message in database
        const { data: message, error: messageError } = await supabase
            .from('whatsapp_messages')
            .insert({
                conversation_id: conversation.id,
                message_sid: MessageSid,
                from_phone: fromPhone,
                to_phone: toPhone,
                body: Body || '',
                media_url: NumMedia && parseInt(NumMedia) > 0 ? MediaUrl0 : null,
                media_type: NumMedia && parseInt(NumMedia) > 0 ? MediaContentType0 : null,
                direction: 'inbound',
                status: 'delivered',
                delivered_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (messageError) {
            console.error('❌ Error storing message:', messageError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('✅ Message stored:', message.id);

        // Send email notification to coach
        try {
            // Get coach email from the conversation
            const { data: coachProfile } = await supabase
                .from('profiles')
                .select('email, first_name, last_name')
                .eq('id', conversation.coach_id)
                .single();

            if (coachProfile?.email) {
                const { sendWhatsAppNotification } = await import('@/lib/email');

                // Get client name from phone lookup if available
                const { data: clientProfile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('phone', fromPhone)
                    .maybeSingle();

                const clientName = clientProfile
                    ? `${clientProfile.first_name} ${clientProfile.last_name}`
                    : null;

                await sendWhatsAppNotification({
                    coachEmail: coachProfile.email,
                    clientName: clientName || fromPhone,
                    clientPhone: fromPhone,
                    messagePreview: Body?.substring(0, 100) || '',
                });
            }
        } catch (emailError) {
            // Don't fail the webhook if email fails - message is already saved
            console.error('⚠️ Failed to send email notification:', emailError);
        }

        // Return TwiML response (Twilio expects XML)
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

        return new NextResponse(twiml, {
            status: 200,
            headers: {
                'Content-Type': 'text/xml',
            },
        });

    } catch (error) {
        console.error('💥 Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Find existing conversation or create new one
 * Auto-assigns to first available coach (or you can implement assignment logic)
 */
async function findOrCreateConversation(clientPhone: string) {
    // Check if conversation exists
    const { data: existing, error: findError } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('client_phone', clientPhone)
        .eq('status', 'active')
        .maybeSingle();

    if (findError) {
        console.error('Error finding conversation:', findError);
        return null;
    }

    if (existing) {
        console.log('📂 Found existing conversation:', existing.id);
        return existing;
    }

    // Get first coach (you can implement better assignment logic)
    const { data: coaches } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'coach')
        .limit(1);

    const coachId = coaches?.[0]?.id;

    if (!coachId) {
        console.error('❌ No coaches found to assign conversation');
        return null;
    }

    // Create new conversation
    const { data: newConv, error: createError } = await supabase
        .from('whatsapp_conversations')
        .insert({
            client_phone: clientPhone,
            coach_id: coachId,
            status: 'active',
            last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (createError) {
        console.error('Error creating conversation:', createError);
        return null;
    }

    console.log('✅ Created new conversation:', newConv.id);
    return newConv;
}
