import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSessionReminder } from '@/lib/twilio-whatsapp';

export async function GET() {
    // Initialize Supabase inside the handler to prevent build-time errors
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        console.log('🔔 Checking for session reminders...');

        // Get sessions in next 2-24 hours
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        console.log('📅 Current time:', now.toISOString());
        console.log('📅 Today date:', today);

        const { data: sessions, error: sessionsError } = await supabase
            .from('sessions')
            .select(`
        *,
        profiles!sessions_user_id_fkey (
          first_name,
          phone,
          language
        )
      `)
            .eq('status', 'scheduled')
            .eq('reminder_sent', false)
            .gte('session_date', today);

        if (sessionsError) {
            console.error('❌ Error fetching sessions:', sessionsError);
            return NextResponse.json({ error: sessionsError.message }, { status: 500 });
        }

        console.log(`📊 Found ${sessions?.length || 0} sessions matching criteria`);
        console.log('Sessions details:', sessions?.map(s => ({
            id: s.id,
            date: s.session_date,
            time: s.scheduled_time,
            status: s.status,
            reminder_sent: s.reminder_sent,
            has_phone: !!s.profiles?.phone
        })));

        if (!sessions || sessions.length === 0) {
            return NextResponse.json({ sent: 0, message: 'No sessions to remind' });
        }

        let sent = 0;

        for (const session of sessions) {
            if (!session.profiles?.phone) {
                console.log(`⚠️ No phone for session ${session.id}`);
                continue;
            }

            // Combine date + time
            const sessionDateTime = new Date(`${session.session_date}T${session.scheduled_time || '10:00:00'}`);
            const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            console.log(`📍 Session ${session.id}: ${session.session_date} ${session.scheduled_time} (in ${hoursUntil.toFixed(1)}h)`);

            // Send reminder 30 minutes to 24 hours before
            if (hoursUntil >= 0.5 && hoursUntil <= 24) {
                const result = await sendSessionReminder({
                    to: session.profiles.phone,
                    clientName: session.profiles.first_name || 'Client',
                    sessionDate: new Date(session.session_date).toLocaleDateString('fr-CH'),
                    sessionTime: session.scheduled_time?.substring(0, 5) || '10:00',
                    meetingLink: session.meeting_link || session.google_meet_link || 'Lien à venir',
                    language: session.profiles.language || 'fr', // Use client's language preference
                });

                if (result.success) {
                    // Mark as sent
                    await supabase
                        .from('sessions')
                        .update({ reminder_sent: true })
                        .eq('id', session.id);

                    sent++;
                    console.log(`✅ Reminder sent for session ${session.id} in ${session.profiles.language || 'fr'}`);
                } else {
                    console.error(`❌ Failed to send reminder for session ${session.id}:`, result.error);
                }
            } else {
                console.log(`⏭️ Session ${session.id} outside window (${hoursUntil.toFixed(1)}h)`);
            }
        }

        return NextResponse.json({
            sent,
            checked: sessions.length,
            message: `Sent ${sent} reminders`
        });
    } catch (error: any) {
        console.error('❌ Cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
