import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for bypassing RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, packageId, dates } = body as {
            userId: string;
            packageId: string;
            dates: string[]; // ISO strings
        };

        console.log('📅 Creating recurring sessions:', { userId, packageId, count: dates.length });

        if (!userId || !packageId || !dates || dates.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify package exists and has enough sessions
        const { data: pkg, error: pkgError } = await supabaseAdmin
            .from('packages')
            .select('*')
            .eq('id', packageId)
            .eq('user_id', userId)
            .single();

        if (pkgError || !pkg) {
            return NextResponse.json(
                { error: 'Package not found' },
                { status: 404 }
            );
        }

        const sessionsRemaining = pkg.sessions_remaining || 0;

        if (dates.length > sessionsRemaining) {
            return NextResponse.json(
                { error: `Not enough sessions remaining. Available: ${sessionsRemaining}, Requested: ${dates.length}` },
                { status: 400 }
            );
        }

        // Create session records
        const sessions = dates.map(dateStr => {
            const date = new Date(dateStr);
            return {
                user_id: userId,
                package_id: packageId,
                session_type: 'coaching_followup' as const,
                session_date: date.toISOString().split('T')[0],
                scheduled_time: date.toTimeString().split(' ')[0], // HH:MM:SS
                duration_minutes: 45,
                status: 'scheduled' as const,
            };
        });

        const { data: createdSessions, error: sessionError } = await supabaseAdmin
            .from('sessions')
            .insert(sessions)
            .select();

        if (sessionError) {
            console.error('Error creating sessions:', sessionError);
            console.error('Session data:', sessions);
            return NextResponse.json(
                { error: `Failed to create sessions: ${sessionError.message || sessionError.code}` },
                { status: 500 }
            );
        }

        // Update package: increment sessions_used AND decrement sessions_remaining
        const { error: updateError } = await supabaseAdmin
            .from('packages')
            .update({
                sessions_used: (pkg.sessions_used || 0) + dates.length,
                sessions_remaining: Math.max(0, (pkg.sessions_remaining || 0) - dates.length)
            })
            .eq('id', packageId);

        if (updateError) {
            console.error('Error updating package:', updateError);
            // Continue even if this fails
        }

        console.log(`✅ Created ${createdSessions.length} recurring sessions`);

        return NextResponse.json({
            created: createdSessions.length,
            sessions: createdSessions,
        });

    } catch (error: any) {
        console.error('Error in recurring sessions API:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
