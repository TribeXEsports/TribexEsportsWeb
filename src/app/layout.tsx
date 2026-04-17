import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { cache } from "react";

// Using standard CSS injection for fonts because next/font/google is failing
// to reach Google's servers during the build phase on the user's network.
const fontVariables = "--font-inter inter-fallback --font-heading saira-fallback --font-outfit outfit-fallback";


// Cache DB calls for Request Memoization to optimize TTFB
const getSettings = cache(async () => {
  return await prisma.siteSettings.findFirst();
});

// Static Metadata for fallback
const staticMetadata: Metadata = {
  metadataBase: new URL('https://tribex-esports.vercel.app'),
  title: {
    default: "Tribex eSports | Dominating the Digital Arena",
    template: "%s | Tribex eSports"
  },
  description: "Tribex eSports — the premier esports organization. Performance, precision, and dominance in global competition.",
  keywords: ["Esports", "Tournaments", "Scrims", "Gaming", "Competitive", "Tribex"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

// Dynamic Metadata Generator for SEO
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  if (!settings) return staticMetadata;

  const siteTitle = settings.siteName && settings.siteSubtitle 
    ? `${settings.siteName} ${settings.siteSubtitle}` 
    : "Tribex eSports";

  return {
    title: {
      default: `${siteTitle} | Dominating the Digital Arena`,
      template: `%s | ${siteTitle}`
    },
    description: settings.footerDescription || staticMetadata.description,
    openGraph: {
      title: `${siteTitle} | Dominating the Digital Arena`,
      description: settings.heroTagline || staticMetadata.description,
    }
  };
}

// Static Optimization Enabled: force-dynamic removed to allow LCP/FCP caching.

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { GlobalAuthObserver } from "@/components/auth/GlobalAuthObserver";
import { Header } from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { ClientLayoutComponents } from "@/components/layout/ClientLayoutComponents";
import { prisma } from "@/lib/prisma";

const Footer = dynamic(() => import("@/components/layout/Footer").then(m => m.Footer));

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@100..900&family=Saira+Condensed:wght@400;500;600;700;800;900&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@100..900&family=Saira+Condensed:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      </head>
      <body
        className="antialiased bg-black min-h-screen text-white relative font-sans"
      >
        <AuthProvider>
          <SettingsProvider initialSettings={JSON.parse(JSON.stringify(settings))}>
              <Suspense fallback={null}>
                  <ClientLayoutComponents />
              </Suspense>
              <GlobalAuthObserver />
              <div className="relative z-10 flex flex-col min-h-screen">
                  <Suspense fallback={<div className="h-20" />}>
                      <Header initialSettings={settings} />
                  </Suspense>
                  <main className="grow">
                      {children}
                  </main>
                  <Suspense fallback={null}>
                      <Footer initialSettings={settings} />
                  </Suspense>
              </div>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
