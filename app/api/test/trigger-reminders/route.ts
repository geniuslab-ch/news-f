import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSessionReminder } from '@/lib/twilio-whatsapp';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Manual trigger endpoint for session reminders
 * Call this to send reminders immediately for testing
 * GET /api/test/trigger-reminders
 */
export async function GET(request: NextRequest) {
    try {
        const now = new Date();

        const { data: sessions } = await supabase
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
            .gte('session_date', now.toISOString().split('T')[0]);

        if (!sessions || sessions.length === 0) {
            return NextResponse.json({
                success: true,
                sent: 0,
                message: 'No pending sessions to remind'
            });
        }

        let sent = 0;
        const results = [];

        for (const session of sessions) {
            if (!session.profiles?.phone) {
                results.push({ sessionId: session.id, status: 'skipped', reason: 'no phone' });
                continue;
            }

            const sessionDateTime = new Date(`${session.session_date}T${session.scheduled_time || '10:00:00'}`);
            const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (hoursUntil >= 0.5 && hoursUntil <= 24) {
                const result = await sendSessionReminder({
                    to: session.profiles.phone,
                    clientName: session.profiles.first_name || 'Client',
                    sessionDate: new Date(session.session_date).toLocaleDateString('fr-CH'),
                    sessionTime: session.scheduled_time?.substring(0, 5) || '10:00',
                    meetingLink: session.meeting_link || session.google_meet_link || 'Lien à venir',
                    language: session.profiles.language || 'fr',
                });

                if (result.success) {
                    await supabase
                        .from('sessions')
                        .update({ reminder_sent: true })
                        .eq('id', session.id);

                    sent++;
                    results.push({
                        sessionId: session.id,
                        status: 'sent',
                        hoursUntil: hoursUntil.toFixed(1)
                    });
                } else {
                    results.push({
                        sessionId: session.id,
                        status: 'failed',
                        error: result.error
                    });
                }
            } else {
                results.push({
                    sessionId: session.id,
                    status: 'skipped',
                    reason: `timing (${hoursUntil.toFixed(1)}h)`
                });
            }
        }

        return NextResponse.json({
            success: true,
            sent,
            total: sessions.length,
            results
        });

    } catch (error: any) {
        console.error('❌ Manual trigger error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
