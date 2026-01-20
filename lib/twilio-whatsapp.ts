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

Lien de connexion Google Meet : 
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

// New function: Send reminder to BOTH client and coach
export async function sendSessionReminderToAll(params: {
    clientPhone: string;
    clientName: string;
    coachPhone: string; // Add coach's phone
    coachName: string;  // Add coach's name
    sessionDate: string;
    sessionTime: string;
    meetingLink: string;
}) {
    const { clientPhone, clientName, coachPhone, coachName, sessionDate, sessionTime, meetingLink } = params;

    const results = [];

    // Send to client
    if (clientPhone) {
        const clientResult = await sendSessionReminder({
            to: clientPhone,
            clientName,
            sessionDate,
            sessionTime,
            meetingLink
        });
        results.push({ recipient: 'client', ...clientResult });
    }

    // Send to coach
    if (coachPhone) {
        const coachMessage = `Bonjour ${coachName} ! 👋

Rappel : session de coaching avec ${clientName} prévue le ${sessionDate} à ${sessionTime}.

📅 Date : ${sessionDate}
🕐 Heure : ${sessionTime}
⏱️ Durée : 45 minutes
👤 Client : ${clientName}

Lien de connexion Google Meet : 
${meetingLink}

Bonne session ! 💪
Fitbuddy`;

        try {
            const result = await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: `whatsapp:${coachPhone}`,
                body: coachMessage,
            });

            console.log('✅ WhatsApp sent to coach:', result.sid);
            results.push({ recipient: 'coach', success: true, sid: result.sid });
        } catch (error: any) {
            console.error('❌ WhatsApp error (coach):', error);
            results.push({ recipient: 'coach', success: false, error: error.message });
        }
    }

    return results;
}
