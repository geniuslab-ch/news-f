import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

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
      <head>
        {/* Google Ads (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17895357907"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17895357907');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
