-- Fix missing client in dashboard
-- Use this script to verify and fix the user account for "Noura.scharer@yahoo.fr"

DO $$
DECLARE
    target_email TEXT := 'Noura.scharer@yahoo.fr';
    target_user_id UUID;
BEGIN
    -- 1. Find the user ID from auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE NOTICE '❌ User % not found in auth.users', target_email;
        RETURN;
    ELSE
        RAISE NOTICE '✅ User found: % (ID: %)', target_email, target_user_id;
    END IF;

    -- 2. Check if profile exists and update it
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
        -- Profile exists, update role to 'client'
        UPDATE public.profiles
        SET
            role = 'client',
            first_name = COALESCE(first_name, 'Noura'),
            last_name = COALESCE(last_name, 'Scharer')
        WHERE id = target_user_id;

        RAISE NOTICE '✅ Profile updated to role=client for user %', target_email;
    ELSE
        -- Profile missing, insert it
        INSERT INTO public.profiles (id, email, role, first_name, last_name, created_at)
        VALUES (
            target_user_id,
            target_email,
            'client',
            'Noura',
            'Scharer',
            NOW()
        );

        RAISE NOTICE '✅ Created missing profile for user %', target_email;
    END IF;

END $$;
