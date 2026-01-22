-- Fix for Stripe Webhook issues
-- 1. Add stripe_payment_intent column to packages table
-- 2. Make price_chf nullable (optional, but safer if webhook misses it) or we ensure webhook sends it.
--    We'll keep it NOT NULL but handle it in code, or make it nullable to be safe.
--    Let's make it nullable to prevent failures if amount is missing.

ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;

ALTER TABLE public.packages
ALTER COLUMN price_chf DROP NOT NULL;

-- Optional: Add a column for the raw amount if we want to store it exactly as from Stripe
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS amount_paid_cents INT;

-- Verify the columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'packages';
