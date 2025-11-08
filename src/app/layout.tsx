import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apex Motus — Corporate Holding Company",
  description: "Apex Motus is a corporate holding company building dominant, future‑ready ventures, products, and services.",
  authors: [{ name: "Apex Motus" }],
  themeColor: "#0a1028",
  keywords: ["corporate holding", "ventures", "technology", "hrtech", "tseboIQ"],
  openGraph: {
    title: "Apex Motus — Corporate Holding Company",
    description: "Building dominant, future‑ready ventures, products, and services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body" data-theme="dark">
        <Providers>
          <Navbar />
          <main id="top">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
