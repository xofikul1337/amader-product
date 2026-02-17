import type { Metadata, Viewport } from "next";
import { Outfit, Sora } from "next/font/google";
import { Suspense } from "react";
import BottomNav from "@/components/BottomNav";
import CategoryDrawer from "@/components/CategoryDrawer";
import PwaRegister from "@/components/PwaRegister";
import SiteFooter from "@/components/SiteFooter";
import TagManager from "@/components/TagManager";
import TrackingEvents from "@/components/TrackingEvents";
import { getGtmContainerId } from "@/lib/tracking.server";
import "./globals.css";

const bodyFont = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amader Product",
    template: "%s | Amader Product",
  },
  applicationName: "Amader Product",
  manifest: "/manifest.webmanifest",
  description:
    "Amader Product brings premium Bangladeshi pantry staples and artisan foods to your door — honey, ghee, oils, dates, and more.",
  keywords: [
    "Amader Product",
    "Bangladeshi grocery",
    "honey",
    "ghee",
    "mustard oil",
    "dates",
    "organic food",
  ],
  openGraph: {
    title: "Amader Product",
    description:
      "Premium Bangladeshi pantry staples and artisan foods — curated for purity and taste.",
    type: "website",
    locale: "bn_BD",
    siteName: "Amader Product",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Amader Product",
  },
  formatDetection: {
    telephone: false,
  },
  twitter: {
    card: "summary_large_image",
    title: "Amader Product",
    description:
      "Premium Bangladeshi pantry staples and artisan foods — curated for purity and taste.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#e07a4f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = await getGtmContainerId();

  return (
    <html lang="bn">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <TagManager gtmId={gtmId} />
        <Suspense fallback={null}>
          <TrackingEvents />
        </Suspense>
        <PwaRegister />
        {children}
        <SiteFooter />
        <CategoryDrawer />
        <BottomNav />
      </body>
    </html>
  );
}
