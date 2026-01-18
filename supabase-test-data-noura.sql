-- =============================================
-- DONNÉES DE TEST POUR NOURA
-- UUID: 1f854950-0f80-4555-a161-127e6e5cd7e2
-- =============================================

-- ÉTAPE 1 : Créer un forfait 3 mois actif
-- =============================================
INSERT INTO packages (
  user_id,
  package_type,
  total_sessions,
  sessions_used,
  price_chf,
  start_date,
  end_date,
  status
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  '3months',
  24,
  6,  -- 6 sessions déjà utilisées → 18 restantes
  555.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 months',
  'active'
)
RETURNING id, package_type, total_sessions, sessions_remaining;

-- COPIE L'ID DU PACKAGE QUI S'AFFICHE DANS LE RÉSULTAT !
-- Puis remplace PACKAGE_ID_HERE dans les requêtes suivantes


-- =============================================
-- ÉTAPE 2 : Créer des sessions de test
-- =============================================
-- IMPORTANT: Remplace PACKAGE_ID_HERE par l'ID du package de l'étape 1

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
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DU PACKAGE
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
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DU PACKAGE
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
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DU PACKAGE
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
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DU PACKAGE
  'Marc Laurent',
  'coaching',
  NOW() - INTERVAL '2 weeks',
  45,
  'completed'
);

-- Session découverte passée (il y a 1 mois - avant le forfait)
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
  NULL,  -- Pas de package (c'était avant)
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
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DU PACKAGE
  'Marc Laurent',
  'coaching',
  NOW() - INTERVAL '3 days',
  45,
  'cancelled',
  'Annulée par le client - reprogrammée'
);


-- =============================================
-- VÉRIFICATION
-- =============================================
-- Vérifier le forfait
SELECT 
  package_type,
  total_sessions,
  sessions_used,
  sessions_remaining,
  price_chf,
  start_date,
  end_date,
  status
FROM packages 
WHERE user_id = '1f854950-0f80-4555-a161-127e6e5cd7e2';

-- Vérifier les sessions
SELECT 
  session_type,
  session_date,
  duration_minutes,
  coach_name,
  status
FROM sessions 
WHERE user_id = '1f854950-0f80-4555-a161-127e6e5cd7e2'
ORDER BY session_date DESC;

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE 'Test data created successfully!';
  RAISE NOTICE 'Go to https://news-f-phi.vercel.app/dashboard to see your data!';
END $$;
