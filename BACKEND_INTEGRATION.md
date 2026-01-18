/**
 * EXEMPLE D'INTÉGRATION BACKEND
 * 
 * Ce fichier montre comment connecter le formulaire à un vrai backend.
 * Actuellement, le formulaire fait un mock de l'envoi.
 * 
 * Options d'intégration :
 * 1. Supabase (recommandé pour MVP)
 * 2. Firebase
 * 3. API custom Next.js (Route Handlers)
 */

// ============================================
// OPTION 1 : SUPABASE
// ============================================

/*
// 1. Installer Supabase
npm install @supabase/supabase-js

// 2. Créer lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Créer la table 'leads' dans Supabase
-- SQL à exécuter dans Supabase Dashboard
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  language TEXT NOT NULL,
  program TEXT NOT NULL,
  goal TEXT NOT NULL,
  availability TEXT NOT NULL,
  assigned_coach TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

// 4. Modifier SignupForm.tsx
import { supabase } from '@/lib/supabase';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const coach = assignCoach(formData.language, programSlug);
  
  // Enregistrer dans Supabase
  const { data, error } = await supabase
    .from('leads')
    .insert({
      first_name: formData.firstName,
      email: formData.email,
      language: formData.language,
      program: programSlug,
      goal: formData.goal,
      availability: formData.availability,
      assigned_coach: coach?.name || null,
    })
    .select();
  
  if (error) {
    console.error('Error saving lead:', error);
    return;
  }
  
  setAssignedCoach(coach?.name || null);
  setSubmitted(true);
  
  // Envoyer un email au coach (via Supabase Edge Function ou SendGrid)
  await sendEmailToCoach(data[0], coach);
};
*/

// ============================================
// OPTION 2 : API ROUTE NEXT.JS
// ============================================

/*
// 1. Créer app/api/submit-lead/route.ts
import { NextResponse } from 'next/server';
import { assignCoach } from '@/lib/coachAssignment';

export async function POST(request: Request) {
  const body = await request.json();
  
  const coach = assignCoach(body.language, body.program);
  
  if (!coach) {
    return NextResponse.json(
      { error: 'No coach available' },
      { status: 404 }
    );
  }
  
  // Sauvegarder dans votre DB (Prisma, MongoDB, etc.)
  // await db.lead.create({ data: { ...body, coachId: coach.id } });
  
  // Envoyer email de confirmation
  // await sendEmail({ to: body.email, coach: coach.name });
  
  return NextResponse.json({ 
    success: true, 
    coach: coach.name 
  });
}

// 2. Modifier SignupForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/submit-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.firstName,
      email: formData.email,
      language: formData.language,
      program: programSlug,
      goal: formData.goal,
      availability: formData.availability,
    }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    setAssignedCoach(data.coach);
    setSubmitted(true);
  }
};
*/

// ============================================
// OPTION 3 : ENVOI D'EMAIL AVEC RESEND
// ============================================

/*
// 1. Installer Resend
npm install resend

// 2. Créer app/api/send-email/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, firstName, coach, program } = await request.json();
  
  await resend.emails.send({
    from: 'Fitbuddy <onboarding@fitbuddy.com>',
    to: email,
    subject: `Bienvenue chez Fitbuddy - Programme ${program}`,
    html: `
      <h1>Bienvenue ${firstName} !</h1>
      <p>Votre coach ${coach} vous contactera sous 24-48h.</p>
    `,
  });
  
  // Email au coach
  await resend.emails.send({
    from: 'Fitbuddy <notifications@fitbuddy.com>',
    to: 'coach@fitbuddy.com',
    subject: `Nouveau lead : ${program}`,
    html: `
      <h2>Nouveau lead reçu</h2>
      <p>Nom : ${firstName}</p>
      <p>Email : ${email}</p>
      <p>Programme : ${program}</p>
    `,
  });
  
  return Response.json({ success: true });
}
*/

// ============================================
// OPTION 4 : GOOGLE SHEETS (SIMPLE MVP)
// ============================================

/*
// Pour un MVP très simple, vous pouvez envoyer à Google Sheets via API

// 1. Créer un Google Apps Script Web App qui reçoit les données POST
// 2. Appeler depuis le formulaire

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const coach = assignCoach(formData.language, programSlug);
  
  await fetch('VOTRE_GOOGLE_APPS_SCRIPT_URL', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      program: programSlug,
      coach: coach?.name,
      timestamp: new Date().toISOString(),
    }),
  });
  
  setSubmitted(true);
};
*/

export {}; // Make this a module
