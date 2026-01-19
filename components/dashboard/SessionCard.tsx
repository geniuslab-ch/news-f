import type { Session } from '@/lib/supabase-helpers';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/supabase-helpers';

interface SessionCardProps {
    session: Session;
    onCancel?: (sessionId: string) => void;
    cancelling?: boolean;
}

export default function SessionCard({ session, onCancel, cancelling }: SessionCardProps) {
    const isPast = new Date(session.session_date) < new Date();
    const isFuture = !isPast;
    const canCancel = isFuture && session.status === 'scheduled';

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    {/* Date & Time */}
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                            {formatDate(session.session_date)}
                        </span>
                        <span className="text-sm text-gray-600">
                            à {session.scheduled_time ? session.scheduled_time.substring(0, 5) : formatTime(session.session_date)}
                        </span>
                    </div>

                    {/* Session Type & Duration */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-700">
                            {session.session_type === 'discovery' && '🎁 Découverte'}
                            {session.session_type === 'coaching' && '💪 Coaching'}
                            {session.session_type === 'coaching_followup' && '🔄 Coaching Suivi'}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{session.duration_minutes} min</span>
                    </div>

                    {/* Coach */}
                    {session.coach_name && (
                        <p className="text-sm text-gray-600">
                            Coach: <span className="font-semibold">{session.coach_name}</span>
                        </p>
                    )}
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {getStatusLabel(session.status)}
                </span>
            </div>

            {/* Google Meet Link */}
            {isFuture && session.google_meet_link && session.status === 'scheduled' && (
                <a
                    href={session.google_meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-500 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition mb-2"
                >
                    🎥 Rejoindre la session
                </a>
            )}

            {/* Add to Calendar Button */}
            {isFuture && session.status === 'scheduled' && (
                <button
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            const { downloadICS } = require('@/lib/calendar');
                            downloadICS(session);
                        }
                    }}
                    className="block w-full bg-green-500 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition mb-2"
                >
                    📅 Ajouter au calendrier
                </button>
            )}

            {/* Actions */}
            {canCancel && onCancel && (
                <button
                    onClick={() => onCancel(session.id)}
                    disabled={cancelling}
                    className="w-full text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {cancelling ? 'Annulation...' : 'Annuler cette session'}
                </button>
            )}

            {/* Notes */}
            {session.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">{session.notes}</p>
                </div>
            )}
        </div>
    );
}
