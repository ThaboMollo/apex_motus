"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, IconButton } from "@material-tailwind/react";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("am_theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.body.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("am_theme", newTheme);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-88 border-b border-slate/30">
      <div className="container mx-auto px-5 max-w-7xl">
        <nav className="flex items-center justify-between h-18 py-4">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-wide">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br from-royal to-plum shadow-lg">
              <img src="/apex_motus_icon_no_bg.png" alt="Apex Motus Logo" className="w-8 h-8" />
            </span>
            <span className="font-heading text-xl">Apex Motus</span>
          </Link>

          <ul className="hidden md:flex gap-6 items-center font-semibold">
            <li>
              <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">
                Home
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="opacity-90 hover:opacity-100 transition-opacity">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/services" className="opacity-90 hover:opacity-100 transition-opacity">
                Services
              </Link>
            </li>
            <li>
              <Link href="/subsidiary-tseboiq" className="opacity-90 hover:opacity-100 transition-opacity">
                tseboIQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="opacity-90 hover:opacity-100 transition-opacity">
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <IconButton
              variant="outlined"
              size="sm"
              onClick={toggleTheme}
              className="border-slate/30 text-current"
            >
              {theme === "dark" ? "🌓" : "☀️"}
            </IconButton>
            <IconButton
              variant="outlined"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden border-slate/30 text-current"
            >
              ☰
            </IconButton>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col gap-3 font-semibold">
              <li>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/subsidiary-tseboiq" onClick={() => setMobileMenuOpen(false)}>
                  tseboIQ
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
