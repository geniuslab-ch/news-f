import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/admin/create-client
 * Create a new client user (requires admin authentication)
 */
export async function POST(request: NextRequest) {
    // Initialize Supabase admin client inside the handler
    // This prevents build-time errors when env vars are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the requesting user is an admin
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Get request body
        const body = await request.json();
        const { email, password, first_name, last_name, phone } = body;

        if (!email || !password || !first_name || !last_name) {
            return NextResponse.json({
                error: 'Missing required fields: email, password, first_name, last_name'
            }, { status: 400 });
        }

        // Create auth user with admin API
        const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (createError) {
            console.error('Error creating user:', createError);
            return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // Update profile with client role, names, and phone
        const updateData: any = {
            id: authData.user.id,
            email: authData.user.email,
            role: 'client',
            first_name,
            last_name,
        };

        // Add phone if provided
        if (phone) {
            updateData.phone = phone;
        }

        // Use upsert instead of update to handle case where trigger hasn't run or doesn't exist
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert(updateData);

        if (profileError) {
            console.error('Error updating profile:', profileError);
            // User is created but profile update failed
            return NextResponse.json({
                error: 'User created but profile update failed',
                userId: authData.user.id
            }, { status: 500 });
        }

        console.log('✅ Client created:', authData.user.email);

        return NextResponse.json({
            success: true,
            user: {
                id: authData.user.id,
                email: authData.user.email,
                first_name,
                last_name,
            }
        });

    } catch (error: any) {
        console.error('❌ Create client error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
