"use client";

import { useEffect, useRef } from "react";

type FactsTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

function countFacts(text: string): number {
  return text
    .split(/[.\n,;!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4).length;
}

export function FactsTextarea({ value, onChange, onSubmit, isLoading }: FactsTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const canSubmit = value.trim().length >= 20 && !isLoading;
  const factCount = countFacts(value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="rounded-2xl border border-gold/25 bg-white/[0.06] px-5 pb-3 pt-4 transition-shadow focus-within:border-gold/50 focus-within:shadow-[0_0_30px_rgba(212,175,55,0.07)]">
      <textarea
        ref={textareaRef}
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start with your first fact — e.g. We rely on referrals for most new clients…"
        className="w-full resize-none overflow-y-auto bg-transparent font-body text-[15px] leading-relaxed text-gold placeholder:italic placeholder:text-white/25 focus:outline-none"
        style={{ maxHeight: "200px" }}
        disabled={isLoading}
      />
      <div className="mt-2 flex items-center justify-between border-t border-white/[0.07] pt-2">
        <span
          className={`font-caption text-[11px] ${factCount > 0 ? "text-gold" : "text-white/30"}`}
        >
          {factCount === 0 ? "0 facts detected" : `${factCount} fact${factCount === 1 ? "" : "s"} detected`}
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded-lg bg-gold px-4 py-1.5 font-caption text-[11px] font-bold tracking-widest text-navy shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-opacity disabled:opacity-35"
        >
          {isLoading ? "Analysing…" : "Analyse →"}
        </button>
      </div>
    </div>
  );
}
