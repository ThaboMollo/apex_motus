import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/content/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "Apex Motus — Turning ambition into motion";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: "%s — Apex Motus" },
  description: SITE.description,
  applicationName: SITE.name,
  creator: SITE.name,
  publisher: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
    locale: "en_ZA",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE.description },
  // Holding pages override this with `index: false` — see their own metadata.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F5ED",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${manrope.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-ink focus:bg-lime focus:px-4 focus:py-3 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SiteJsonLd />
      </body>
    </html>
  );
}
