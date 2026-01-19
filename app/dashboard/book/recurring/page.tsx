'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserPackages, type Package } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';

type Frequency = 'weekly' | 'biweekly' | 'monthly';
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function RecurringBookingPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activePackage, setActivePackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [frequency, setFrequency] = useState<Frequency>('weekly');
    const [sessionCount, setSessionCount] = useState(4);
    const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(1); // Monday
    const [hour, setHour] = useState('10:00');
    const [previewDates, setPreviewDates] = useState<Date[]>([]);

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (dayOfWeek !== null && hour && sessionCount) {
            generatePreviewDates();
        }
    }, [frequency, sessionCount, dayOfWeek, hour]);

    const loadUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            const { data: packages } = await getUserPackages(user.id);
            const active = packages?.find(p => p.status === 'active');
            setActivePackage(active || null);

        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNextDayOfWeek = (targetDay: DayOfWeek): Date => {
        const today = new Date();
        const currentDay = today.getDay();
        let daysUntilTarget = targetDay - currentDay;

        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7;
        }

        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntilTarget);
        return nextDate;
    };

    const generatePreviewDates = () => {
        const dates: Date[] = [];
        let currentDate = getNextDayOfWeek(dayOfWeek);

        const [hours, minutes] = hour.split(':').map(Number);
        currentDate.setHours(hours, minutes, 0, 0);

        for (let i = 0; i < sessionCount; i++) {
            dates.push(new Date(currentDate));

            // Add interval based on frequency
            switch (frequency) {
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'biweekly':
                    currentDate.setDate(currentDate.getDate() + 14);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
        }

        setPreviewDates(dates);
    };

    const handleCreate = async () => {
        if (!user || !activePackage) return;

        const sessionsRemaining = activePackage.total_sessions - (activePackage.sessions_used || 0);

        if (sessionCount > sessionsRemaining) {
            alert(`Vous avez seulement ${sessionsRemaining} session(s) disponible(s).`);
            return;
        }

        setCreating(true);

        try {
            const response = await fetch('/api/sessions/recurring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    packageId: activePackage.id,
                    dates: previewDates.map(d => d.toISOString()),
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Erreur: ${data.error}`);
                return;
            }

            alert(`${data.created} session(s) créée(s) avec succès !`);
            router.push('/dashboard/sessions');

        } catch (error) {
            console.error('Error creating sessions:', error);
            alert('Erreur lors de la création. Veuillez réessayer.');
        } finally {
            setCreating(false);
        }
    };

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!activePackage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun forfait actif</h2>
                    <p className="text-gray-600 mb-6">Vous devez avoir un forfait actif pour réserver des sessions récurrentes.</p>
                    <Link href="/dashboard/checkout" className="bg-gradient-fitbuddy text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all inline-block">
                        Acheter un forfait
                    </Link>
                </div>
            </div>
        );
    }

    const sessionsRemaining = activePackage.total_sessions - (activePackage.sessions_used || 0);
    const sessionsAfterCreation = sessionsRemaining - sessionCount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-4">
            <div className="container mx-auto max-w-3xl py-8">
                {/* Header */}
                <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    ← Retour au dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📅 Réserver des sessions récurrentes
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Planifiez plusieurs sessions de coaching en une seule fois.
                    </p>

                    {/* Frequency Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">Fréquence</label>
                        <div className="space-y-2">
                            {[
                                { value: 'weekly' as Frequency, label: 'Hebdomadaire (toutes les semaines)' },
                                { value: 'biweekly' as Frequency, label: 'Bimensuel (toutes les 2 semaines)' },
                                { value: 'monthly' as Frequency, label: 'Mensuel (tous les mois)' },
                            ].map((option) => (
                                <label key={option.value} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${frequency === option.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={option.value}
                                        checked={frequency === option.value}
                                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                                        className="w-5 h-5"
                                    />
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Session Count */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">Nombre de sessions</label>
                        <select
                            value={sessionCount}
                            onChange={(e) => setSessionCount(Number(e.target.value))}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 transition"
                        >
                            {[2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                <option key={num} value={num}>{num} sessions</option>
                            ))}
                        </select>
                    </div>

                    {/* Day and Time */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">Jour de la semaine</label>
                            <select
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 transition"
                            >
                                {dayNames.map((name, idx) => (
                                    <option key={idx} value={idx}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">Heure</label>
                            <input
                                type="time"
                                value={hour}
                                onChange={(e) => setHour(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 transition"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-4">📝 Aperçu des sessions</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {previewDates.map((date, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span className="text-gray-900">
                                        {dayNames[date.getDay()]} {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()} à {date.toTimeString().substring(0, 5)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Package Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Sessions disponibles :</span>
                            <span className="font-bold text-gray-900">{sessionsRemaining}/{activePackage.total_sessions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Après création :</span>
                            <span className={`font-bold ${sessionsAfterCreation < 0 ? 'text-red-600' : 'text-primary-600'}`}>
                                {sessionsAfterCreation}/{activePackage.total_sessions}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard"
                            className="flex-1 text-center bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                        >
                            Annuler
                        </Link>
                        <button
                            onClick={handleCreate}
                            disabled={creating || sessionCount > sessionsRemaining}
                            className="flex-1 bg-gradient-fitbuddy text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {creating ? 'Création...' : `Créer ${sessionCount} session${sessionCount > 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
