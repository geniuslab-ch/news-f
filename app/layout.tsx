import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitbuddy - Coaching Sport & Santé en Visio",
  description: "Transformez votre vie avec un coaching sport et santé personnalisé en visio. Programmes adaptés : Déclic Durable, Système Apex, Élan Senior, Renaissance.",
  keywords: "coaching sport, coaching santé, visio, Google Meet, fitness, bien-être, personnalisé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
