-- Fix for Stripe Webhook issues - UPDATED
-- Run this in Supabase SQL Editor

-- 1. Add stripe_payment_intent column if it doesn't exist
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;

-- 2. Add price_chf column if it doesn't exist (User reported it missing)
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS price_chf DECIMAL(10,2);

-- 3. Make price_chf nullable (safer if webhook doesn't provide it immediately)
ALTER TABLE public.packages
ALTER COLUMN price_chf DROP NOT NULL;

-- 4. Add amount_paid_cents for raw Stripe amount
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS amount_paid_cents INT;

-- 5. Verify the columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'packages';
