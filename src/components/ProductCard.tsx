type ProductLink = {
  href: string;
  label: string;
};

type ProductCardProps = {
  name: string;
  description: string;
  primaryLink: ProductLink;
  secondaryLink?: ProductLink;
  delayMs?: number;
};

export function ProductCard({
  name,
  description,
  primaryLink,
  secondaryLink,
  delayMs = 0,
}: ProductCardProps) {
  return (
    <article
      className="group flex h-full flex-col justify-between rounded-[4px] border border-navy/15 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div>
        <h3 className="font-heading text-[30px] font-semibold leading-tight text-fg-primary">{name}</h3>
        <p className="mt-4 max-w-[38ch] font-body text-[16px] leading-relaxed text-fg-secondary">
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <a
          href={primaryLink.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-[4px] border border-navy bg-navy px-4 font-caption text-[11px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-royal"
        >
          View Product
        </a>
        {secondaryLink ? (
          <a
            href={secondaryLink.href}
            target="_blank"
            rel="noreferrer"
            className="font-caption text-[11px] uppercase tracking-[0.12em] text-navy transition-colors hover:text-royal"
          >
            {secondaryLink.label}
          </a>
        ) : null}
      </div>
    </article>
  );
}
