import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWhatsAppNotificationParams {
    coachEmail: string;
    clientName: string;
    clientPhone: string;
    messagePreview: string;
}

/**
 * Sends an email notification when a new WhatsApp message is received
 */
export async function sendWhatsAppNotification({
    coachEmail,
    clientName,
    clientPhone,
    messagePreview,
}: SendWhatsAppNotificationParams): Promise<boolean> {
    try {
        const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'notifications@fitbuddy.ch';

        await resend.emails.send({
            from: fromEmail,
            to: coachEmail,
            subject: `Nouveau message WhatsApp de ${clientName || clientPhone}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">💬 Nouveau Message WhatsApp</h1>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #25D366;">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                <strong>De:</strong> ${clientName || 'Client'}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
                                <strong>Téléphone:</strong> ${clientPhone}
                            </p>
                            <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.5;">
                                "${messagePreview}${messagePreview.length > 100 ? '...' : ''}"
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://fitbuddy.ch/dashboard-coach/messages" 
                               style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                                Voir la conversation
                            </a>
                        </div>
                        
                        <p style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                            Cet email a été envoyé automatiquement par Fitbuddy<br>
                            <a href="https://fitbuddy.ch" style="color: #667eea; text-decoration: none;">fitbuddy.ch</a>
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('✅ WhatsApp notification email sent to:', coachEmail);
        return true;
    } catch (error) {
        console.error('❌ Failed to send WhatsApp notification email:', error);
        return false;
    }
}
