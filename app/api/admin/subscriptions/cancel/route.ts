import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        // Admin client for bypassing RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { userId, packageId } = await request.json();

        if (!userId || !packageId) {
            return NextResponse.json(
                { error: 'User ID and Package ID are required' },
                { status: 400 }
            );
        }

        // Verify the requesting user is an admin
        const { data: { user } } = await supabaseAdmin.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        // Get package with stripe subscription ID
        const { data: packageData, error: packageError } = await supabaseAdmin
            .from('packages')
            .select('stripe_subscription_id, user_id, status')
            .eq('id', packageId)
            .eq('user_id', userId)
            .single();

        if (packageError || !packageData) {
            return NextResponse.json(
                { error: 'Package not found' },
                { status: 404 }
            );
        }

        if (packageData.status === 'cancelled') {
            return NextResponse.json(
                { error: 'Subscription already cancelled' },
                { status: 400 }
            );
        }

        if (!packageData.stripe_subscription_id) {
            return NextResponse.json(
                { error: 'No Stripe subscription found for this package' },
                { status: 400 }
            );
        }

        // Cancel the Stripe subscription
        const subscription = await stripe.subscriptions.cancel(
            packageData.stripe_subscription_id
        );

        console.log('✅ Stripe subscription cancelled:', subscription.id);

        // Update package status in database
        const { error: updateError } = await supabaseAdmin
            .from('packages')
            .update({ status: 'cancelled' })
            .eq('id', packageId);

        if (updateError) {
            console.error('❌ Error updating package status:', updateError);
            return NextResponse.json(
                { error: 'Failed to update package status' },
                { status: 500 }
            );
        }

        console.log('✅ Package status updated to cancelled');

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully',
        });
    } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
