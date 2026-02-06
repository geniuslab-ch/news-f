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

        // ... existing code ...

        // Create a debug log array to return in response
        const debugLogs: any[] = [];
        let sent = 0;

        for (const session of sessions) {
            const profile = profileMap.get(session.user_id);
            const logEntry: any = { sessionId: session.id, userId: session.user_id };

            if (!profile) {
                console.log(`⚠️ No profile for session ${session.id}, user_id: ${session.user_id}`);
                logEntry.error = 'No profile found';
                debugLogs.push(logEntry);
                continue;
            }

            if (!profile.phone) {
                console.log(`⚠️ No phone for session ${session.id}`);
                logEntry.error = 'No phone in profile';
                debugLogs.push(logEntry);
                continue;
            }

            let hoursUntil = -999;

            try {
                // Robust date cleaning + parsing
                let dateStr = session.session_date;
                if (!dateStr) throw new Error('No session_date');

                // If date is "YYYY-MM-DDT00:00:00", take just the date part
                if (dateStr.includes('T')) {
                    dateStr = dateStr.split('T')[0];
                }

                let timeStr = session.scheduled_time || '10:00:00';
                // Ensure time is HH:MM:SS
                if (timeStr.length === 5) timeStr += ':00';

                const dateTimeString = `${dateStr}T${timeStr}`;
                const sessionDateTime = new Date(dateTimeString);

                // Check if date is valid
                if (isNaN(sessionDateTime.getTime())) {
                    throw new Error(`Invalid date object created from ${dateTimeString}`);
                }

                hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

                logEntry.sessionTime = sessionDateTime.toISOString();
                logEntry.dateTimeString = dateTimeString;
                logEntry.currentTime = now.toISOString();
                logEntry.hoursUntil = hoursUntil;
                logEntry.window = '0.5 to 24 hours';
                logEntry.profile = { phone: profile.phone, lang: profile.language };

                console.log(`📍 Session ${session.id}: ${dateTimeString} (in ${hoursUntil.toFixed(1)}h)`);
            } catch (dateError: any) {
                console.error(`❌ Date error for session ${session.id}:`, dateError);
                logEntry.error = `Date error: ${dateError.message}`;
                logEntry.rawDate = session.session_date;
                logEntry.rawTime = session.scheduled_time;
                debugLogs.push(logEntry);
                continue;
            }

            // Send reminder 30 minutes to 24 hours before
            if (hoursUntil >= 0.5 && hoursUntil <= 24) {
                const meetingLink = session.google_meet_link || session.meeting_link || 'Lien à venir';
                console.log(`🔗 Meeting link: ${meetingLink}`);

                // Format friendly date (e.g. 06.02.2026)
                let friendlyDate = session.session_date;
                try {
                    friendlyDate = new Date(session.session_date).toLocaleDateString('fr-CH');
                } catch (e) {
                    console.error('Error formatting friendly date', e);
                }

                const result = await sendSessionReminder({
                    to: profile.phone,
                    clientName: profile.first_name || 'Client',
                    sessionDate: friendlyDate,
                    sessionTime: (session.scheduled_time || '10:00').substring(0, 5),
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
