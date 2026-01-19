import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProduct, type PackageType } from '@/lib/stripe-config';

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

        const product = getProduct(packageType);
        const origin = request.headers.get('origin') || 'https://news-f-phi.vercel.app';

        console.log('📦 Product:', product);
        console.log('🔑 Creating Stripe session with priceId:', priceId);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/dashboard/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/checkout/cancel`,
            metadata: {
                userId,
                packageType,
                sessions: product.sessions.toString(),
                duration: product.duration.toString(),
            },
            customer_email: undefined, // Will be filled by Stripe from user input
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
