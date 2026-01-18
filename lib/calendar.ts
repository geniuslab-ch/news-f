import type { Session } from './supabase-helpers';

/**
 * Generate ICS (iCalendar) file content for a session
 * Compatible with iOS Calendar, Google Calendar, Outlook, etc.
 */
export function generateICS(session: Session): string {
    const startDate = new Date(session.session_date);
    const endDate = new Date(startDate.getTime() + session.duration_minutes * 60000);

    // Format dates to ICS format: YYYYMMDDTHHmmssZ
    const formatICSDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Fitbuddy//Session Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${session.id}@fitbuddy.ch`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:${session.session_type === 'discovery' ? 'Session Découverte' : 'Session Coaching'} Fitbuddy`,
        `DESCRIPTION:Session de ${session.duration_minutes} minutes avec ${session.coach_name || 'votre coach'}`,
        session.google_meet_link ? `LOCATION:${session.google_meet_link}` : '',
        'STATUS:CONFIRMED',
        session.google_meet_link ? `URL:${session.google_meet_link}` : '',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'DESCRIPTION:Rappel 15 minutes avant',
        'ACTION:DISPLAY',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ]
        .filter(Boolean) // Remove empty lines
        .join('\r\n');

    return icsContent;
}

/**
 * Download ICS file
 */
export function downloadICS(session: Session): void {
    const icsContent = generateICS(session);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `fitbuddy-session-${session.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Get calendar data URL for direct link
 */
export function getCalendarDataURL(session: Session): string {
    const icsContent = generateICS(session);
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}
