"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { METHOD } from "@/content/site";
import { cn } from "@/lib/cn";

const STEPS = METHOD.stages.length;

/*
 * Disclosure-pattern stepper. One structure for every breakpoint:
 *  - mobile: vertical rail, stages stacked, tap to open
 *  - desktop: three columns on a horizontal track; the lime chevron travels
 *    to the active stage and the progress line follows it.
 * Native <button aria-expanded>: keyboard + screen-reader behaviour for free.
 */
export function MethodologyExplorer() {
  const [active, setActive] = useState(0);
  const pct = (active / STEPS) * 100;

  return (
    <div>
      {/* Desktop track */}
      <div aria-hidden="true" className="relative mb-10 hidden h-8 lg:block">
        <div className="absolute inset-x-0 top-1/2 h-px bg-rule" />
        <div
          className="absolute left-0 top-1/2 h-px bg-ink transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-quart)]"
          style={{ width: `${pct}%` }}
        />
        {METHOD.stages.map((s, i) => (
          <span
            key={s.n}
            className={cn(
              "absolute top-1/2 size-2.5 -translate-y-1/2 border border-ink transition-colors duration-[var(--duration-base)]",
              i <= active ? "bg-ink" : "bg-paper",
            )}
            style={{ left: `${(i / STEPS) * 100}%` }}
          />
        ))}
        <svg
          viewBox="0 0 28 32"
          className="absolute top-0 h-8 w-7 transition-[left] duration-[var(--duration-slow)] ease-[var(--ease-out-quart)]"
          style={{ left: `calc(${pct}% + 1.25rem)` }}
        >
          <path d="M4 2 H12 L24 16 L12 30 H4 L16 16 Z" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="1.5" />
        </svg>
      </div>

      <ol className="grid gap-0 lg:grid-cols-3 lg:gap-x-8">
        {METHOD.stages.map((s, i) => {
          const open = i === active;
          const panelId = `method-panel-${i}`;
          const next = METHOD.stages[i + 1];
          return (
            <li
              key={s.n}
              className={cn(
                "relative border-l pb-10 pl-8 transition-colors duration-[var(--duration-base)] lg:border-l-0 lg:pb-0 lg:pl-0",
                i <= active ? "border-ink" : "border-rule",
              )}
            >
              {/* mobile rail node */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[0.4375rem] top-2 size-3.5 border border-ink transition-colors duration-[var(--duration-base)] lg:hidden",
                  open ? "bg-lime" : i < active ? "bg-ink" : "bg-paper",
                )}
              />

              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(i)}
                className="group w-full text-left"
              >
                <span className="label flex items-center gap-3 text-ink-soft">
                  <span className={open ? "text-ink" : ""}>Stage {s.n}</span>
                </span>
                <span
                  className={cn(
                    "display mt-3 block text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-none transition-colors duration-[var(--duration-base)]",
                    open ? "text-ink" : "text-ink-soft group-hover:text-ink",
                  )}
                >
                  {s.name}
                </span>
                <span className="mt-4 block max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
                  {s.summary}
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-label={`${s.name} detail`}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out-quart)]",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
                inert={!open}
              >
                <div className="overflow-hidden">
                  <ul className="mt-8 space-y-3 border-t border-rule pt-6">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-ink" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 flex items-start gap-3 bg-lime px-4 py-3 text-[0.9375rem] font-medium leading-snug">
                    <span className="label shrink-0 pt-0.5">Result</span>
                    {s.outcome}
                  </p>
                  {next && (
                    <button
                      type="button"
                      onClick={() => setActive(i + 1)}
                      className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
                    >
                      <span className="link-draw pb-0.5">Next: {next.name}</span>
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
