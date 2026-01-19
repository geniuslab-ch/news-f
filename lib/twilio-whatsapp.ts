import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function sendSessionReminder(params: {
    to: string; // Format: +41791234567
    clientName: string;
    sessionDate: string;
    sessionTime: string;
    meetingLink: string;
}) {
    const { to, clientName, sessionDate, sessionTime, meetingLink } = params;

    const message = `Bonjour ${clientName} ! 👋

Rappel : votre session de coaching est prévue le ${sessionDate} à ${sessionTime}.

📅 Date : ${sessionDate}
🕐 Heure : ${sessionTime}
⏱️ Durée : 45 minutes

Lien de connexion : 
${meetingLink}

À très bientôt ! 💪
Fitbuddy`;

    try {
        const result = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM, // whatsapp:+14155238886
            to: `whatsapp:${to}`, // whatsapp:+41791234567
            body: message,
        });

        console.log('✅ WhatsApp sent:', result.sid);
        return { success: true, sid: result.sid };
    } catch (error: any) {
        console.error('❌ WhatsApp error:', error);
        return { success: false, error: error.message };
    }
}
