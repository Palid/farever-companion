import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { OfficialSourceRibbon } from "@/app/_components/OfficialSourceRibbon";
import { NavBar } from "@/app/_components/NavBar";
import { KofiFloatingButton } from "@/app/_components/KofiFloatingButton";
import { SiteFooter } from "@/app/_components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Read-only DPS, healing, and shielding meter`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "A passive, read-only overlay for Farever. Tracks damage, healing, and shielding. Not affiliated with Shiro Games.",
  applicationName: SITE_NAME,
  keywords: ["Farever", "DPS meter", "healing meter", "Farever Companion", "overlay", "Shiro Games"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Read-only DPS, healing, and shielding meter`,
    description:
      "A passive, read-only overlay for Farever. Tracks damage, healing, and shielding. Not affiliated with Shiro Games.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Read-only DPS, healing, and shielding meter`,
    description:
      "A passive, read-only overlay for Farever. Tracks damage, healing, and shielding. Not affiliated with Shiro Games.",
  },
  robots: { index: true, follow: true },
};

// themeColor and colorScheme belong on viewport, not metadata (deprecated since Next.js 14)
export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col bg-background text-foreground font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
      >
        <OfficialSourceRibbon />
        <NavBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <KofiFloatingButton />
      </body>
    </html>
  );
}
