'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Package } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

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

            const { data: packages } = await supabase
                .from('packages')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            const active = packages?.[0] || null;
            setActivePackage(active);

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

        const sessionsRemaining = activePackage.sessions_remaining || 0;

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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-transparent mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!activePackage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <DashboardHeader />
                <div className="flex items-center justify-center p-8 min-h-[80vh]">
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-md text-center border border-white/50">
                        <div className="text-8xl mb-6">📦</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun forfait actif</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Vous devez avoir un forfait actif pour réserver des sessions récurrentes.
                        </p>
                        <Link
                            href="/dashboard/checkout"
                            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110"
                        >
                            Acheter un forfait ✨
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const sessionsRemaining = activePackage.sessions_remaining || 0;
    const sessionsAfterCreation = sessionsRemaining - sessionCount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <DashboardHeader />

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-2xl">
                        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            🔄 Sessions Récurrentes
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Planifiez plusieurs sessions à l'avance pour une routine régulière
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
                        {/* Frequency Selection */}
                        <div className="mb-6">
                            <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📅</span> Fréquence
                            </label>
                            <div className="space-y-3">
                                {[
                                    { value: 'weekly' as Frequency, label: 'Hebdomadaire', desc: 'Toutes les semaines' },
                                    { value: 'biweekly' as Frequency, label: 'Bimensuel', desc: 'Toutes les 2 semaines' },
                                    { value: 'monthly' as Frequency, label: 'Mensuel', desc: 'Tous les mois' },
                                ].map((option) => (
                                    <label key={option.value} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${frequency === option.value
                                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-purple-300 hover:scale-102'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="frequency"
                                            value={option.value}
                                            checked={frequency === option.value}
                                            onChange={(e) => setFrequency(e.target.value as Frequency)}
                                            className="w-5 h-5 accent-purple-500"
                                        />
                                        <div>
                                            <span className="font-bold text-gray-900 block">{option.label}</span>
                                            <span className="text-sm text-gray-600">{option.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Session Count */}
                        <div className="mb-6">
                            <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">🔢</span> Nombre de sessions
                            </label>
                            <select
                                value={sessionCount}
                                onChange={(e) => setSessionCount(Number(e.target.value))}
                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 transition-all font-semibold bg-white"
                            >
                                {[2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                    <option key={num} value={num}>{num} sessions</option>
                                ))}
                            </select>
                        </div>

                        {/* Day and Time */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📆</span> Jour
                                </label>
                                <select
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 transition-all font-semibold bg-white"
                                >
                                    {dayNames.map((name, idx) => (
                                        <option key={idx} value={idx}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🕐</span> Heure
                                </label>
                                <input
                                    type="time"
                                    value={hour}
                                    onChange={(e) => setHour(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 transition-all font-semibold bg-white"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <span className="text-2xl">📝</span> Aperçu
                                </h3>
                                <span className="text-sm font-semibold text-purple-600 bg-white px-3 py-1 rounded-full">
                                    {previewDates.length} session{previewDates.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {previewDates.map((date, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-green-500 font-bold text-xl">✓</span>
                                        <span className="text-gray-900 font-medium">
                                            {dayNames[date.getDay()]} {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()} à {date.toTimeString().substring(0, 5)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Package Info */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Sessions disponibles:</span>
                                <span className="font-bold text-gray-900">{sessionsRemaining}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Après création:</span>
                                <span className={`font-bold ${sessionsAfterCreation < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {sessionsAfterCreation}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard"
                                className="flex-1 text-center bg-gray-200 text-gray-700 font-bold px-6 py-4 rounded-full hover:bg-gray-300 transition-all hover:scale-105"
                            >
                                Annuler
                            </Link>
                            <button
                                onClick={handleCreate}
                                disabled={creating || sessionCount > sessionsRemaining}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {creating ? '⏳ Création...' : `Créer ${sessionCount} session${sessionCount > 1 ? 's' : ''} ✨`}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
