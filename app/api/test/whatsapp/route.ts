import { NextRequest, NextResponse } from 'next/server';
import { sendSessionReminder } from '@/lib/twilio-whatsapp';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = await sendSessionReminder({
            to: body.to || '+41791234567',
            clientName: body.clientName || 'Test Client',
            sessionDate: body.sessionDate || '20 janvier 2026',
            sessionTime: body.sessionTime || '10:00',
            meetingLink: body.meetingLink || 'https://meet.google.com/test',
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
