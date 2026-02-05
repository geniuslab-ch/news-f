import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProduct, type PackageType } from '@/lib/stripe-config';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { priceId, packageType, userId } = body as {
            priceId: string;
            packageType: PackageType;
            userId: string;
        };

        console.log('🔍 Checkout request:', { priceId, packageType, userId });

        if (!priceId || !packageType || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get user email from Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Try to get email from profiles first
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .single();

        let userEmail = profile?.email;

        // If not in profiles, get from auth.users (for OAuth users)
        if (!userEmail) {
            const { data: { user } } = await supabase.auth.admin.getUserById(userId);
            userEmail = user?.email;
            console.log('📧 Email from auth.users:', userEmail);
        } else {
            console.log('📧 Email from profiles:', userEmail);
        }

        const product = getProduct(packageType);
        const origin = request.headers.get('origin') || 'https://news-f-phi.vercel.app';

        console.log('📦 Product:', product);
        console.log('🔑 Creating Stripe session with priceId:', priceId);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/dashboard/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/checkout/cancel`,
            subscription_data: {
                metadata: {
                    userId,
                    packageType,
                    sessions: product.sessions.toString(),
                    duration: product.duration.toString(),
                },
            },
            customer_email: userEmail, // Pre-fill with user's email
            allow_promotion_codes: true,
        });

        console.log('✅ Session created:', session.id);

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
