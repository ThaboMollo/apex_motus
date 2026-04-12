type HeroCollapsedNavProps = {
  onTalkToUs: () => void;
};

export function HeroCollapsedNav({ onTalkToUs }: HeroCollapsedNavProps) {
  return (
    <div className="relative z-20 mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 md:px-10 lg:px-20">
      <span className="font-caption text-[15px] font-bold tracking-widest2 text-gold sm:text-[18px]">
        APEX MOTUS
      </span>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-10">
        <nav className="hidden items-center gap-3 md:flex md:gap-8">
          <a
            href="#about"
            className="font-caption text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            About
          </a>
          <a
            href="#features"
            className="font-caption text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#contact"
            className="font-caption text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            Contact
          </a>
        </nav>
        <button
          type="button"
          onClick={onTalkToUs}
          className="rounded-[4px] border border-gold/45 px-2.5 py-1.5 font-caption text-[10px] uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold/10 sm:px-3 sm:text-[11px]"
        >
          Talk to Us
        </button>
      </div>
    </div>
  );
}
