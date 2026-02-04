import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnterpriseContactRequest {
    company: string;
    name: string;
    email: string;
    phone: string;
    employees: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: EnterpriseContactRequest = await request.json();
        const { company, name, email, phone, employees, message } = body;

        // Validation
        if (!company || !name || !email || !phone) {
            return NextResponse.json(
                { error: 'Tous les champs obligatoires doivent être remplis' },
                { status: 400 }
            );
        }

        // Email configuration
        const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'contact@fitbuddy.ch';
        const toEmail = process.env.NOTIFICATION_TO_EMAIL || 'contact@fitbuddy.ch';

        // Send notification email to Fitbuddy
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            replyTo: email,
            subject: `🏢 Nouvelle demande entreprise - ${company}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🏢 Nouvelle Demande Entreprise</h1>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                            <h2 style="color: #f59e0b; margin-top: 0;">Informations de l'entreprise</h2>
                            
                            <p style="margin: 10px 0;">
                                <strong>Entreprise:</strong> ${company}
                            </p>
                            
                            <p style="margin: 10px 0;">
                                <strong>Nom du contact:</strong> ${name}
                            </p>
                            
                            <p style="margin: 10px 0;">
                                <strong>Email:</strong> <a href="mailto:${email}" style="color: #f59e0b; text-decoration: none;">${email}</a>
                            </p>
                            
                            <p style="margin: 10px 0;">
                                <strong>Téléphone:</strong> <a href="tel:${phone}" style="color: #f59e0b; text-decoration: none;">${phone}</a>
                            </p>
                            
                            ${employees ? `
                            <p style="margin: 10px 0;">
                                <strong>Nombre d'employés:</strong> ${employees}
                            </p>
                            ` : ''}
                        </div>
                        
                        ${message ? `
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #333; margin-top: 0;">Message</h3>
                            <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
                        </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="mailto:${email}?subject=Re: Demande de réunion de découverte - Fitbuddy" 
                               style="display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                                Répondre par email
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Bonjour ${name}, merci pour votre demande de réunion de découverte pour ${company}." 
                               style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                                📱 Contacter sur WhatsApp
                            </a>
                        </div>
                        
                        <p style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                            Demande reçue via fitbuddy.ch/entreprises<br>
                            <a href="https://fitbuddy.ch" style="color: #f59e0b; text-decoration: none;">fitbuddy.ch</a>
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('❌ Failed to send enterprise contact email:', error);
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi de l\'email' },
                { status: 500 }
            );
        }

        console.log('✅ Enterprise contact email sent:', data);

        // Optionally, send a confirmation email to the visitor
        try {
            await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: 'Merci pour votre demande - Fitbuddy',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">Merci ${name} !</h1>
                        </div>
                        
                        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0 0 15px 0; font-size: 16px;">
                                    Votre demande de réunion de découverte a bien été reçue.
                                </p>
                                
                                <p style="margin: 15px 0; color: #666;">
                                    Notre équipe prendra contact avec vous très prochainement pour planifier un échange et discuter de vos besoins en matière de bien-être pour vos collaborateurs.
                                </p>
                                
                                <p style="margin: 15px 0; color: #666;">
                                    En attendant, n'hésitez pas à nous joindre :
                                </p>
                                
                                <ul style="list-style: none; padding: 0; margin: 20px 0;">
                                    <li style="margin: 10px 0;">
                                        📧 <a href="mailto:contact@fitbuddy.ch" style="color: #f59e0b; text-decoration: none;">contact@fitbuddy.ch</a>
                                    </li>
                                    <li style="margin: 10px 0;">
                                        📱 <a href="https://wa.me/41765928806" style="color: #f59e0b; text-decoration: none;">+41 76 592 88 06</a>
                                    </li>
                                </ul>
                            </div>
                            
                            <p style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                                À très bientôt,<br>
                                L'équipe Fitbuddy<br>
                                <a href="https://fitbuddy.ch" style="color: #f59e0b; text-decoration: none;">fitbuddy.ch</a>
                            </p>
                        </div>
                    </body>
                    </html>
                `,
            });
            console.log('✅ Confirmation email sent to visitor:', email);
        } catch (confirmError) {
            console.error('⚠️ Could not send confirmation email to visitor:', confirmError);
            // Don't fail the request if confirmation email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Votre demande a été envoyée avec succès',
        });
    } catch (error) {
        console.error('❌ Enterprise contact API error:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}
