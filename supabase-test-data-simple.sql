-- =============================================
-- DONNÉES DE TEST POUR NOURA - VERSION SIMPLIFIÉE
-- UUID: 1f854950-0f80-4555-a161-127e6e5cd7e2
-- =============================================

-- ÉTAPE 1 : Créer un forfait 3 mois actif (SANS price_chf)
-- =============================================
INSERT INTO packages (
  user_id,
  package_type,
  total_sessions,
  sessions_used,
  start_date,
  end_date,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  '3months',
  24,
  6,  -- 6 sessions déjà utilisées → 18 restantes
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 months',
  'active'
)
RETURNING id, package_type, total_sessions, sessions_remaining;

-- ⬇️ COPIE L'ID QUI S'AFFICHE ICI ⬇️
-- Exemple: c21e4567-e89b-12d3-a456-426614174000


-- =============================================
-- ÉTAPE 2 : Créer des sessions de test
-- REMPLACE "PACKAGE_ID_HERE" PAR L'ID CI-DESSUS
-- =============================================

-- Session future programmée (dans 3 jours)
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  google_meet_link,
  status,
  notes
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',
  'Marie Dupont',
  'coaching',
  NOW() + INTERVAL '3 days',
  45,
  'https://meet.google.com/abc-defg-hij',
  'scheduled',
  'Objectif: Renforcement musculaire'
);

-- Session future 2 (dans 1 semaine)
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  google_meet_link,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',
  'Marc Laurent',
  'coaching',
  NOW() + INTERVAL '1 week',
  45,
  'https://meet.google.com/xyz-test-123',
  'scheduled'
);

-- Session passée complétée (il y a 1 semaine)
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  status,
  notes
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',
  'Marie Dupont',
  'coaching',
  NOW() - INTERVAL '1 week',
  45,
  'completed',
  'Excellente progression !'
);

-- Session passée complétée (il y a 2 semaines)
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',
  'Marc Laurent',
  'coaching',
  NOW() - INTERVAL '2 weeks',
  45,
  'completed'
);

-- Session découverte passée (il y a 1 mois - avant le forfait)
INSERT INTO sessions (
  user_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'Marie Dupont',
  'discovery',
  NOW() - INTERVAL '1 month',
  15,
  'completed'
);

-- Session annulée (il y a 3 jours)
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  status,
  notes
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',
  'Marc Laurent',
  'coaching',
  NOW() - INTERVAL '3 days',
  45,
  'cancelled',
  'Annulée par le client - reprogrammée'
);

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE 'Sessions created successfully!';
  RAISE NOTICE 'Total: 6 sessions (2 upcoming, 4 past)';
END $$;
