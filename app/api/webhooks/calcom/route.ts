import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for bypassing RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface CalComAttendee {
    email: string;
    name?: string;
}

interface CalComBooking {
    uid: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: CalComAttendee[];
    metadata?: Record<string, any>;
    responses?: Record<string, any>;
}

interface CalComWebhookPayload {
    triggerEvent: 'BOOKING_CREATED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED';
    payload: CalComBooking;
}

export async function POST(request: NextRequest) {
    try {
        const body: CalComWebhookPayload = await request.json();

        console.log('📅 Cal.com webhook received:', body.triggerEvent);
        console.log('Booking UID:', body.payload.uid);

        // Verify webhook signature if secret is configured
        if (process.env.CALCOM_WEBHOOK_SECRET) {
            const signature = request.headers.get('x-cal-signature-256');
            // TODO: Implement signature verification if needed
        }

        const { triggerEvent, payload } = body;

        switch (triggerEvent) {
            case 'BOOKING_CREATED':
                await handleBookingCreated(payload);
                break;

            case 'BOOKING_CANCELLED':
                await handleBookingCancelled(payload);
                break;

            case 'BOOKING_RESCHEDULED':
                await handleBookingRescheduled(payload);
                break;

            default:
                console.log('Unhandled event:', triggerEvent);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('❌ Cal.com webhook error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleBookingCreated(booking: CalComBooking) {
    console.log('📝 Creating session from booking:', booking.uid);

    // Find user by email
    const attendeeEmail = booking.attendees[0]?.email;
    if (!attendeeEmail) {
        console.warn('⚠️ No attendee email found');
        return;
    }

    // Get user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users:', userError);
        return;
    }

    const user = userData.users.find(u => u.email === attendeeEmail);

    if (!user) {
        console.warn(`⚠️ User not found for email: ${attendeeEmail}`);
        return;
    }

    console.log('✅ User found:', user.id);

    // Get active package for user
    const { data: packages, error: packageError } = await supabaseAdmin
        .from('packages')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

    if (packageError || !packages || packages.length === 0) {
        console.warn('⚠️ No active package found for user:', user.id);
        // Still create session without package
    }

    const activePackage = packages?.[0];

    // Check if session already exists
    const { data: existingSession } = await supabaseAdmin
        .from('sessions')
        .select('id')
        .eq('calcom_booking_id', booking.uid)
        .single();

    if (existingSession) {
        console.log('ℹ️ Session already exists, skipping');
        return;
    }

    // Determine session type from title
    let sessionType: 'discovery' | 'coaching' | 'coaching_followup' = 'coaching_followup';
    const title = booking.title.toLowerCase();

    if (title.includes('découverte') || title.includes('15min') || title.includes('15 min')) {
        sessionType = 'discovery';
    } else if (title.includes('suivi')) {
        sessionType = 'coaching_followup';
    } else if (title.includes('coaching')) {
        sessionType = 'coaching';
    }

    // Calculate duration
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    // Create session
    const sessionData = {
        user_id: user.id,
        package_id: activePackage?.id || null,
        session_type: sessionType,
        session_date: start.toISOString().split('T')[0],
        scheduled_time: start.toTimeString().split(' ')[0], // HH:MM:SS
        duration_minutes: durationMinutes,
        status: 'scheduled' as const,
        calcom_booking_id: booking.uid,
        meeting_link: booking.responses?.location || null,
    };

    console.log('📦 Creating session:', sessionData);

    const { data: newSession, error: sessionError } = await supabaseAdmin
        .from('sessions')
        .insert([sessionData])
        .select()
        .single();

    if (sessionError) {
        console.error('❌ Error creating session:', sessionError);
        return;
    }

    console.log('✅ Session created successfully:', newSession.id);

    // Increment sessions_used if package exists and not discovery
    if (activePackage && sessionType !== 'discovery') {
        const { error: updateError } = await supabaseAdmin
            .from('packages')
            .update({
                sessions_used: (activePackage.sessions_used || 0) + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', activePackage.id);

        if (updateError) {
            console.error('❌ Error updating package sessions_used:', updateError);
        } else {
            console.log(`✅ Package sessions_used incremented: ${(activePackage.sessions_used || 0) + 1}/${activePackage.total_sessions}`);
        }
    } else if (!activePackage) {
        console.warn('⚠️ No active package - sessions_used not incremented');
    } else {
        console.log('ℹ️ Discovery session - sessions_used not incremented');
    }
}

async function handleBookingCancelled(booking: CalComBooking) {
    console.log('❌ Cancelling session for booking:', booking.uid);

    const { data: session, error } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('calcom_booking_id', booking.uid)
        .single();

    if (error || !session) {
        console.warn('⚠️ Session not found for booking:', booking.uid);
        return;
    }

    await supabaseAdmin
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', session.id);

    console.log('✅ Session cancelled');

    // Decrement sessions_used if applicable
    if (session.package_id && session.session_type !== 'discovery') {
        const { data: pkg } = await supabaseAdmin
            .from('packages')
            .select('sessions_used')
            .eq('id', session.package_id)
            .single();

        if (pkg && pkg.sessions_used > 0) {
            await supabaseAdmin
                .from('packages')
                .update({ sessions_used: pkg.sessions_used - 1 })
                .eq('id', session.package_id);

            console.log('✅ Package sessions_used decremented');
        }
    }
}

async function handleBookingRescheduled(booking: CalComBooking) {
    console.log('🔄 Rescheduling session for booking:', booking.uid);

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    await supabaseAdmin
        .from('sessions')
        .update({
            session_date: start.toISOString().split('T')[0],
            duration_minutes: durationMinutes,
        })
        .eq('calcom_booking_id', booking.uid);

    console.log('✅ Session rescheduled');
}
