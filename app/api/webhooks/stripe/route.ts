import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    // Admin client for bypassing RLS - initialized inside handler for build safety
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log('✅ Checkout session completed:', session.id);
            console.log('Metadata:', session.metadata);

            let userId = session.metadata?.userId;
            let packageType = session.metadata?.packageType;
            let sessions = session.metadata?.sessions;
            let duration = session.metadata?.duration;

            // Fallback: Check subscription metadata if session metadata is missing
            if ((!userId || !packageType) && session.subscription) {
                console.log('⚠️ Metadata missing in session, checking subscription...');
                try {
                    const subscriptionId = typeof session.subscription === 'string'
                        ? session.subscription
                        : session.subscription.id;

                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    if (subscription.metadata) {
                         console.log('✅ Found subscription metadata:', subscription.metadata);
                         userId = userId || subscription.metadata.userId;
                         packageType = packageType || subscription.metadata.packageType;
                         sessions = sessions || subscription.metadata.sessions;
                         duration = duration || subscription.metadata.duration;
                    }
                } catch (subError) {
                    console.error('❌ Error retrieving subscription:', subError);
                }
            }

            if (!userId || !packageType) {
                console.error('❌ Missing metadata in session and subscription');
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            // Create package in database
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + parseInt(duration || '30'));

            // Calculate price from Stripe session
            const amountTotal = session.amount_total || 0;
            const priceChf = amountTotal / 100;

            const packageData = {
                user_id: userId,
                package_type: packageType,
                total_sessions: parseInt(sessions || '8'),
                sessions_used: 0,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                status: 'active',
                stripe_payment_intent: session.payment_intent as string,
                price_chf: priceChf,
                amount_paid_cents: amountTotal,
            };

            console.log('📦 Creating package:', packageData);

            const { data, error } = await supabaseAdmin
                .from('packages')
                .insert([packageData])
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating package:', error);
                return NextResponse.json(
                    { error: 'Database error' },
                    { status: 500 }
                );
            }

            console.log('✅ Package created successfully:', data);

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.error('❌ Payment failed:', paymentIntent.id);
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
