"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/*
 * Scroll reveal. Content is fully visible on the server and without JS.
 *
 * Two shared IntersectionObservers (no per-element layout reads):
 *  1. `first` classifies each node once: already on screen → leave visible;
 *     below the fold → mark pending (hidden) and hand to `reveal`.
 *  2. `reveal` flips pending → in the first time the node scrolls into view.
 * Reduced-motion users never see the hidden state (CSS-gated).
 */
let first: IntersectionObserver | null = null;
let reveal: IntersectionObserver | null = null;

function observers() {
  if (!reveal) {
    reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          reveal?.unobserve(el);
          requestAnimationFrame(() => {
            el.dataset.reveal = "in";
          });
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    first = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          first?.unobserve(el);
          if (entry.isIntersecting) continue;
          // Only hide nodes that are below the viewport, never ones already scrolled past.
          if (entry.boundingClientRect.top < 0) continue;
          el.dataset.reveal = "pending";
          reveal?.observe(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
  }
  return { first: first!, reveal: reveal! };
}

export function Reveal({
  as: Tag = "div",
  id,
  index = 0,
  className,
  children,
}: {
  as?: ElementType;
  id?: string;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { first: f } = observers();
    f.observe(el);
    return () => {
      first?.unobserve(el);
      reveal?.unobserve(el);
    };
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
