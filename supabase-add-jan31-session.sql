-- =============================================
-- Session du 31 janvier pour Noura
-- UUID: 1f854950-0f80-4555-a161-127e6e5cd7e2
-- =============================================

-- IMPORTANT: Remplace PACKAGE_ID_HERE par l'ID de ton package
-- (Tu peux le trouver avec: SELECT id FROM packages WHERE user_id = '1f854950-0f80-4555-a161-127e6e5cd7e2')

-- Session réservée via Cal.com pour le 31 janvier 2026
INSERT INTO sessions (
  user_id,
  package_id,
  coach_name,
  session_type,
  session_date,
  duration_minutes,
  google_meet_link,
  status,
  cal_com_booking_id,
  notes
) VALUES (
  '1f854950-0f80-4555-a161-127e6e5cd7e2',
  'PACKAGE_ID_HERE',  -- ⬅️ REMPLACE PAR L'ID DE TON PACKAGE
  'Marie Dupont',  -- Change si tu as réservé avec un autre coach
  'coaching',
  '2026-01-31 10:00:00+00',  -- 31 janvier 2026 à 10h00 UTC (Change l'heure si besoin)
  45,
  'https://meet.google.com/abc-xyz-def',  -- Met le vrai lien Google Meet si tu l'as
  'scheduled',
  NULL,  -- ID de réservation Cal.com (si tu l'as, mets-le)
  'Session réservée via Cal.com'
);

-- Vérifier que la session a bien été ajoutée
SELECT 
  id,
  session_date,
  session_type,
  duration_minutes,
  status,
  coach_name
FROM sessions 
WHERE user_id = '1f854950-0f80-4555-a161-127e6e5cd7e2'
AND session_date >= '2026-01-31'
ORDER BY session_date;

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE 'Session du 31 janvier ajoutée !';
  RAISE NOTICE 'Va sur https://news-f-phi.vercel.app/dashboard pour la voir';
END $$;
