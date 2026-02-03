/**
 * Sanitize and format phone number for WhatsApp/Twilio
 * 
 * Handles common formats:
 * - Swiss: +41 78 637 25 53 → +41786372553
 * - French: +33 6 12 34 56 78 → +33612345678
 * - US: (415) 555-1234 → +14155551234
 * - International: +1-415-555-1234 → +14155551234
 * 
 * @param phone - Phone number in any format
 * @returns Sanitized phone number in E.164 format (+41786372553)
 */
export function sanitizePhoneNumber(phone: string): string {
    if (!phone) {
        throw new Error('Phone number is required');
    }

    // Remove all spaces, dashes, parentheses, dots
    let sanitized = phone.replace(/[\s\-\(\)\.]/g, '');

    // Ensure it starts with +
    if (!sanitized.startsWith('+')) {
        sanitized = `+${sanitized}`;
    }

    // Validate: must be + followed by 7-15 digits (E.164 format)
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    if (!e164Regex.test(sanitized)) {
        throw new Error(`Invalid phone number format: ${phone}. Expected E.164 format (e.g., +41786372553)`);
    }

    return sanitized;
}

/**
 * Format phone number for Twilio WhatsApp
 * @param phone - Phone number in any format
 * @returns Formatted for WhatsApp API (whatsapp:+41786372553)
 */
export function formatWhatsAppNumber(phone: string): string {
    const sanitized = sanitizePhoneNumber(phone);
    return `whatsapp:${sanitized}`;
}
