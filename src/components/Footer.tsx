import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative min-h-[300px] w-full overflow-hidden bg-navy">
      <div className="absolute left-0 right-0 top-0 h-px bg-gold/30" />
      <div
        className="absolute right-6 top-10 h-16 w-16 rounded-full md:right-20 md:top-16 md:h-20 md:w-20"
        style={{ background: "radial-gradient(circle, rgba(28,44,163,0.4) 0%, transparent 70%)" }}
      />

      <div className="px-6 pb-20 pt-12 md:px-10 md:pb-20 md:pt-[60px] lg:px-20">
        <p className="font-caption text-[18px] font-bold tracking-widest2 text-gold">APEX MOTUS</p>
        <p className="mt-2 font-body text-[14px] text-white/50">
          Corporate holding company designing resilient, dominant ventures.
        </p>

        <nav className="mt-10 flex flex-wrap gap-x-12 gap-y-3">
          <Link href="/" className="font-caption text-[12px] tracking-[0.15em] text-white/60">
            Home
          </Link>
          <Link href="/portfolio" className="font-caption text-[12px] tracking-[0.15em] text-white/60">
            Portfolio
          </Link>
          <Link href="/services" className="font-caption text-[12px] tracking-[0.15em] text-white/60">
            Shared Services
          </Link>
          <Link href="/contact" className="font-caption text-[12px] tracking-[0.15em] text-white/60">
            Contact Form
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-6 h-px bg-white/10 md:mx-10 lg:mx-20" />
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 md:px-10 lg:px-20">
          <span className="font-caption text-[11px] tracking-[0.1em] text-white/35">
            © {currentYear} Apex Motus. All rights reserved.
          </span>
          <span className="font-caption text-[11px] tracking-[0.1em] text-white/35">
            Privacy · Terms
          </span>
        </div>
      </div>
    </footer>
  );
}
