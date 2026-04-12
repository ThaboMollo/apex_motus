import type { Metadata, Viewport } from "next";
import { Newsreader, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { DEFAULT_OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Apex Motus | Business Growth Tools and Advisory",
    template: "%s | Apex Motus",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  keywords: [
    "Apex Motus",
    "business growth",
    "business restructuring",
    "operations consulting",
    "business tools",
    "strategic advisory",
  ],
  alternates: {
    canonical: "/",
  },
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
  openGraph: {
    title: "Apex Motus | Business Growth Tools and Advisory",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_ZA",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        alt: "Apex Motus logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Motus | Business Growth Tools and Advisory",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  icons: {
    icon: [{ url: "/apex_motus_icon.ico" }],
    shortcut: ["/apex_motus_icon.ico"],
    apple: [{ url: "/apex_motus_icon_no_bg.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1028",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${newsreader.variable}`}>
      <body className="font-body" data-theme="dark">
        <Providers>
          <main id="top">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
