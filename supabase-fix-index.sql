-- FIX POUR L'INDEX QUI POSE PROBLÈME
-- Exécute juste cette requête dans Supabase SQL Editor

-- Supprimer l'index existant s'il existe
DROP INDEX IF EXISTS public.packages_stripe_sub_idx;

-- Recréer l'index correctement
CREATE INDEX packages_stripe_sub_idx ON public.packages(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE 'Index fixed successfully!';
END $$;
