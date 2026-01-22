import { NextRequest, NextResponse } from 'next/server';
import { sendSessionReminder } from '@/lib/twilio-whatsapp';

/**
 * Test endpoint for session reminder WhatsApp templates
 * GET /api/test/reminder?phone=+41791234567&lang=fr
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const lang = searchParams.get('lang') || 'fr';

        if (!phone) {
            return NextResponse.json({
                error: 'Missing phone parameter',
                usage: '/api/test/reminder?phone=+41791234567&lang=fr'
            }, { status: 400 });
        }

        // Ensure phone starts with +
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

        // Test data
        const testDate = new Date();
        testDate.setHours(testDate.getHours() + 24); // Tomorrow at same time

        const result = await sendSessionReminder({
            to: formattedPhone,
            clientName: 'Test Client',
            sessionDate: testDate.toLocaleDateString('fr-CH'),
            sessionTime: '14:00',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            language: lang as 'fr' | 'en',
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `✅ Test reminder sent to ${formattedPhone}`,
                language: lang,
                template: lang === 'fr' ? 'HX3671de98cf154963cce7c2696b5f7461' : 'HXb97ca9778836a6c03f34f7a7589b70d4',
                sid: result.sid,
                testData: {
                    clientName: 'Test Client',
                    sessionDate: testDate.toLocaleDateString('fr-CH'),
                    sessionTime: '14:00',
                    meetingLink: 'https://meet.google.com/abc-defg-hij',
                }
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error,
            }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
