import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    // Initialize Supabase inside handler for build safety
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
                await handleBookingCreated(payload, supabaseAdmin);
                break;

            case 'BOOKING_CANCELLED':
                await handleBookingCancelled(payload, supabaseAdmin);
                break;

            case 'BOOKING_RESCHEDULED':
                await handleBookingRescheduled(payload, supabaseAdmin);
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

async function handleBookingCreated(booking: CalComBooking, supabaseAdmin: SupabaseClient) {
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

    // Extract Google Meet Link correctly
    // Cal.com sends the actual link in metadata.videoCallUrl for Google Meet integrations
    let meetingLink = booking.metadata?.videoCallUrl;

    // Fallback: Check if location is a URL (e.g. custom link)
    if (!meetingLink && typeof booking.responses?.location === 'string' && booking.responses.location.startsWith('http')) {
        meetingLink = booking.responses.location;
    }

    // If we still have object/JSON in location, do NOT save it as the link
    if (!meetingLink) {
        console.log('⚠️ No direct meeting link found in metadata or location');
    }

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
        meeting_link: meetingLink || null,
        google_meet_link: meetingLink && meetingLink.includes('meet.google') ? meetingLink : null
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


    // Update package: increment sessions_used AND decrement sessions_remaining
    if (activePackage && sessionType !== 'discovery') {
        const { error: updateError } = await supabaseAdmin
            .from('packages')
            .update({
                sessions_used: (activePackage.sessions_used || 0) + 1,
                sessions_remaining: Math.max(0, (activePackage.sessions_remaining || 0) - 1)
            })
            .eq('id', activePackage.id);

        if (updateError) {
            console.error('❌ Error updating package:', updateError);
        } else {
            const newRemaining = Math.max(0, (activePackage.sessions_remaining || 0) - 1);
            const newUsed = (activePackage.sessions_used || 0) + 1;
            console.log(`✅ Package updated: ${newUsed} used, ${newRemaining} remaining`);
        }
    } else if (!activePackage) {
        console.warn('⚠️ No active package - sessions not updated');
    } else {
        console.log('ℹ️ Discovery session - sessions not updated');
    }

}

async function handleBookingCancelled(booking: CalComBooking, supabaseAdmin: SupabaseClient) {
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

    // Decrement sessions_used AND increment sessions_remaining
    if (session.package_id && session.session_type !== 'discovery') {
        const { data: pkg } = await supabaseAdmin
            .from('packages')
            .select('sessions_used, sessions_remaining')
            .eq('id', session.package_id)
            .single();

        if (pkg && pkg.sessions_used > 0) {
            await supabaseAdmin
                .from('packages')
                .update({
                    sessions_used: pkg.sessions_used - 1,
                    sessions_remaining: (pkg.sessions_remaining || 0) + 1
                })
                .eq('id', session.package_id);

            console.log('✅ Package updated: sessions restored');
        }
    }
}

async function handleBookingRescheduled(booking: CalComBooking, supabaseAdmin: SupabaseClient) {
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
