-- FIX NOURA, MISSING PACKAGE, AND ADMIN DASHBOARD VISIBILITY
-- Run this script in the Supabase SQL Editor.

BEGIN;

-- =============================================
-- 1. SCHEMA REPAIR (Ensure columns exist)
-- =============================================

-- Ensure 'role' exists in profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT CHECK (role IN ('admin', 'coach', 'client'));
        RAISE NOTICE 'Added role column to profiles.';
    END IF;
END $$;

-- Ensure package columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'price_chf') THEN
        ALTER TABLE public.packages ADD COLUMN price_chf DECIMAL(10,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'stripe_payment_intent') THEN
        ALTER TABLE public.packages ADD COLUMN stripe_payment_intent TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'amount_paid_cents') THEN
        ALTER TABLE public.packages ADD COLUMN amount_paid_cents INT;
    END IF;
END $$;

-- =============================================
-- 2. RLS POLICIES (Fix Admin Visibility)
-- =============================================

-- Drop existing admin policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;

-- Create robust Admin policies
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    (auth.uid() = id) OR -- User sees themselves
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) -- Admin sees everyone
);

CREATE POLICY "Admins can view all packages"
ON public.packages FOR SELECT
TO authenticated
USING (
    (auth.uid() = user_id) OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admins can view all sessions"
ON public.sessions FOR SELECT
TO authenticated
USING (
    (auth.uid() = user_id) OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

DO $$
BEGIN
    RAISE NOTICE 'RLS policies for Admins updated.';
END $$;

-- =============================================
-- 3. DATA REPAIR: ADMIN USER
-- =============================================

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'contact@fitbuddy.ch';

DO $$
BEGIN
    RAISE NOTICE 'Ensured contact@fitbuddy.ch is admin.';
END $$;

-- =============================================
-- 4. DATA REPAIR: NOURA (Profile & Package)
-- =============================================

DO $$
DECLARE
    target_email TEXT := 'Noura.scharer@yahoo.fr';
    target_user_id UUID;
    existing_package_id UUID;
BEGIN
    -- Find the user in auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

    IF target_user_id IS NOT NULL THEN
        RAISE NOTICE 'Found user % with ID %', target_email, target_user_id;

        -- 1. Ensure Profile Exists & is Client
        INSERT INTO public.profiles (id, email, role, first_name, last_name)
        VALUES (target_user_id, target_email, 'client', 'Noura', 'Scharer')
        ON CONFLICT (id) DO UPDATE
        SET role = 'client',
            first_name = COALESCE(public.profiles.first_name, 'Noura'),
            last_name = COALESCE(public.profiles.last_name, 'Scharer');

        RAISE NOTICE 'Ensured profile for % exists.', target_email;

        -- 2. Check for existing active package
        SELECT id INTO existing_package_id
        FROM public.packages
        WHERE user_id = target_user_id
        AND status = 'active'
        AND package_type = '1month';

        IF existing_package_id IS NULL THEN
            -- Insert the missing package (200 CHF = 1month / 8 sessions)
            INSERT INTO public.packages (
                user_id,
                package_type,
                total_sessions,
                sessions_used,
                price_chf,
                start_date,
                end_date,
                status
            ) VALUES (
                target_user_id,
                '1month',
                8,
                0,
                200.00,
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '1 month',
                'active'
            );
            RAISE NOTICE 'Inserted missing 1-month package for %.', target_email;
        ELSE
            RAISE NOTICE 'User % already has an active package (ID: %). Skipping insertion.', target_email, existing_package_id;
        END IF;

    ELSE
        RAISE WARNING 'User % NOT FOUND in auth.users. Cannot fix profile or package.', target_email;
    END IF;
END $$;

COMMIT;
