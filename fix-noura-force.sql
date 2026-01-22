-- FORCE FIX FOR NOURA - CASE INSENSITIVE EMAIL CHECK
-- Run this script in Supabase SQL Editor

BEGIN;

DO $$
DECLARE
    target_email TEXT := 'Noura.scharer@yahoo.fr';
    found_user_id UUID;
    existing_package_id UUID;
BEGIN
    -- 1. Find user by email (Case Insensitive)
    -- We use ILIKE to match 'noura.scharer@yahoo.fr' even if input is 'Noura...'
    SELECT id INTO found_user_id
    FROM auth.users
    WHERE email ILIKE target_email;

    IF found_user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Found user with ID: %', found_user_id;

        -- 2. Force Update Profile (Ensure Role is 'client')
        -- We insert if missing, or update if exists
        INSERT INTO public.profiles (id, email, role, first_name, last_name)
        VALUES (found_user_id, target_email, 'client', 'Noura', 'Scharer')
        ON CONFLICT (id) DO UPDATE
        SET role = 'client',
            first_name = COALESCE(public.profiles.first_name, 'Noura'),
            last_name = COALESCE(public.profiles.last_name, 'Scharer');

        RAISE NOTICE '✅ Profile updated/created for Noura.';

        -- 3. Check for existing package
        SELECT id INTO existing_package_id
        FROM public.packages
        WHERE user_id = found_user_id
        AND status = 'active'
        AND package_type = '1month';

        IF existing_package_id IS NULL THEN
            -- 4. Force Insert Package
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
                found_user_id,
                '1month',
                8,
                0,
                200.00,
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '1 month',
                'active'
            );
            RAISE NOTICE '✅ Inserted missing 1-month package for Noura.';
        ELSE
            RAISE NOTICE 'ℹ️ User already has an active package (ID: %).', existing_package_id;
        END IF;

    ELSE
        RAISE WARNING '❌ User % NOT FOUND in auth.users (even with case-insensitive check). Please verify the email address exactly.', target_email;
    END IF;
END $$;

COMMIT;
