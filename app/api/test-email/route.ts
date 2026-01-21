import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Simple test endpoint to verify Resend configuration
 * GET /api/test-email
 */
export async function GET(request: NextRequest) {
    try {
        const resendKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'contact@fitbuddy.ch';
        const toEmail = process.env.NOTIFICATION_TO_EMAIL || 'contact@fitbuddy.ch';

        // Check if API key is configured
        if (!resendKey) {
            return NextResponse.json({
                success: false,
                error: '❌ RESEND_API_KEY not configured in Vercel',
                help: 'Go to Vercel → Settings → Environment Variables and add RESEND_API_KEY'
            }, { status: 500 });
        }

        // Try to send test email
        const resend = new Resend(resendKey);

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: '✅ Test Email - Fitbuddy Notifications',
            html: `
                <h2>🎉 Ça marche!</h2>
                <p>Les notifications email WhatsApp sont correctement configurées.</p>
                <p><strong>From:</strong> ${fromEmail}</p>
                <p><strong>To:</strong> ${toEmail}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            `,
        });

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                details: error,
                config: {
                    fromEmail,
                    toEmail,
                    hasApiKey: !!resendKey
                }
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: '✅ Email envoyé avec succès!',
            emailId: data?.id,
            config: {
                from: fromEmail,
                to: toEmail,
            },
            note: 'Vérifiez votre boîte email (et les spams)'
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
