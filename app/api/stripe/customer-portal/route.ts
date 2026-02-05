import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user's active package with stripe subscription ID
        const { data: packageData, error: packageError } = await supabase
            .from('packages')
            .select('stripe_subscription_id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (packageError || !packageData || !packageData.stripe_subscription_id) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Retrieve the subscription to get the customer ID
        const subscription = await stripe.subscriptions.retrieve(
            packageData.stripe_subscription_id
        );

        const customerId = subscription.customer as string;

        // Create billing portal session
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://fitbuddy.ch';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/dashboard`,
        });

        return NextResponse.json({
            url: portalSession.url,
        });
    } catch (error: any) {
        console.error('Error creating customer portal session:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
