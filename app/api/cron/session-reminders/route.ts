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

        // Fetch sessions WITHOUT the relationship syntax (which requires foreign key)
        const { data: sessions, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .eq('status', 'scheduled')
            .eq('reminder_sent', false)
            .gte('session_date', today);

        if (sessionsError) {
            console.error('❌ Error fetching sessions:', sessionsError);
            return NextResponse.json({ error: sessionsError.message }, { status: 500 });
        }

        console.log(`📊 Found ${sessions?.length || 0} sessions matching criteria`);

        if (!sessions || sessions.length === 0) {
            return NextResponse.json({ sent: 0, message: 'No sessions to remind' });
        }

        // Fetch profiles for all user_ids
        const userIds = sessions.map(s => s.user_id);
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, phone, language')
            .in('id', userIds);

        if (profilesError) {
            console.error('❌ Error fetching profiles:', profilesError);
        }

        // Create a map for quick lookup
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        console.log('Sessions details:', sessions.map(s => {
            const profile = profileMap.get(s.user_id);
            return {
                id: s.id,
                date: s.session_date,
                time: s.scheduled_time,
                status: s.status,
                reminder_sent: s.reminder_sent,
                has_phone: !!profile?.phone,
                has_profile: !!profile
            };
        }));

        let sent = 0;

        for (const session of sessions) {
            const profile = profileMap.get(session.user_id);

            if (!profile) {
                console.log(`⚠️ No profile for session ${session.id}, user_id: ${session.user_id}`);
                continue;
            }

            if (!profile.phone) {
                console.log(`⚠️ No phone for session ${session.id}`);
                continue;
            }

            // Combine date + time
            const sessionDateTime = new Date(`${session.session_date}T${session.scheduled_time || '10:00:00'}`);
            const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            console.log(`📍 Session ${session.id}: ${session.session_date} ${session.scheduled_time} (in ${hoursUntil.toFixed(1)}h)`);

            // Send reminder 30 minutes to 24 hours before
            if (hoursUntil >= 0.5 && hoursUntil <= 24) {
                const meetingLink = session.google_meet_link || session.meeting_link || 'Lien à venir';
                console.log(`🔗 Meeting link: ${meetingLink}`);

                const result = await sendSessionReminder({
                    to: profile.phone,
                    clientName: profile.first_name || 'Client',
                    sessionDate: new Date(session.session_date).toLocaleDateString('fr-CH'),
                    sessionTime: session.scheduled_time?.substring(0, 5) || '10:00',
                    meetingLink,
                    language: profile.language || 'fr',
                });

                if (result.success) {
                    // Mark as sent
                    await supabase
                        .from('sessions')
                        .update({ reminder_sent: true })
                        .eq('id', session.id);

                    sent++;
                    console.log(`✅ Reminder sent for session ${session.id} in ${profile.language || 'fr'}`);
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
