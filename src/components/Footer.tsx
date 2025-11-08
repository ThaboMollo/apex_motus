import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate/30 py-12">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br from-royal to-plum shadow-lg">
                <svg viewBox="0 0 64 64" fill="none" className="w-6 h-6">
                  <path
                    d="M10 28c8-12 20-18 33-14 6 2 9 6 9 10 0 8-7 12-15 12H30"
                    stroke="#e9edf3"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 36c-6 0-10 3-12 9"
                    stroke="#e9edf3"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="45" cy="22" r="3" fill="#22d3ee" />
                  <path
                    d="M20 50c10-8 24-8 34-2"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="28" cy="44" r="2" fill="#22d3ee" />
                  <circle cx="52" cy="48" r="2" fill="#22d3ee" />
                </svg>
              </span>
              <span className="font-heading font-bold text-xl">Apex Motus</span>
            </div>
            <p className="max-w-xs text-slate mb-4">
              Corporate holding company designing resilient, dominant ventures.
            </p>
            <small className="text-slate">© {currentYear} Apex Motus. All rights reserved.</small>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-slate">
              <li>
                <Link href="/" className="hover:text-cyan transition-colors">
                  Thesis
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-cyan transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan transition-colors">
                  Shared Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-3">Legal</h4>
            <ul className="space-y-2 text-slate">
              <li>
                <Link href="/privacy" className="hover:text-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-3">Contact</h4>
            <ul className="space-y-2 text-slate">
              <li>
                <Link href="/contact" className="hover:text-cyan transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
