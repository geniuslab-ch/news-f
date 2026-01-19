import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSessionReminder } from '@/lib/twilio-whatsapp';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('🔔 Checking for session reminders...');

        // Get sessions in next 2-24 hours
        const now = new Date();

        const { data: sessions } = await supabase
            .from('sessions')
            .select(`
        *,
        profiles!sessions_user_id_fkey (
          first_name,
          phone
        )
      `)
            .eq('status', 'scheduled')
            .eq('reminder_sent', false)
            .gte('session_date', now.toISOString().split('T')[0]);

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

            console.log(`Session ${session.id} in ${hoursUntil.toFixed(1)}h`);

            // Send reminder 2 hours before (but not more than 24h)
            if (hoursUntil >= 2 && hoursUntil <= 24) {
                const result = await sendSessionReminder({
                    to: session.profiles.phone,
                    clientName: session.profiles.first_name || 'Client',
                    sessionDate: new Date(session.session_date).toLocaleDateString('fr-CH'),
                    sessionTime: session.scheduled_time?.substring(0, 5) || '10:00',
                    meetingLink: session.meeting_link || session.google_meet_link || 'Lien à venir',
                });

                if (result.success) {
                    // Mark as sent
                    await supabase
                        .from('sessions')
                        .update({ reminder_sent: true })
                        .eq('id', session.id);

                    sent++;
                    console.log(`✅ Reminder sent for session ${session.id}`);
                }
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
