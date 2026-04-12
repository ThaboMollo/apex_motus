import type { Metadata, Viewport } from "next";
import { Newsreader, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  title: "Apex Motus",
  description: "Apex Motus landing page",
  authors: [{ name: "Apex Motus" }],
  keywords: ["apex motus", "business solutions", "ai insights"],
  openGraph: {
    title: "Apex Motus",
    description: "Apex Motus landing page",
    type: "website",
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
