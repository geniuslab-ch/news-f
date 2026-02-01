import Stripe from 'stripe';

// Don't throw at build time if key is missing
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build';

export const stripe = new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});
