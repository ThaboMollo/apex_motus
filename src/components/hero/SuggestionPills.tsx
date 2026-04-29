"use client";

import { useMemo, useRef } from "react";
import { HERO_SUGGESTIONS } from "./suggestions";

type SuggestionPillsProps = {
  currentValue: string;
  onSelect: (appendedValue: string) => void;
};

function sampleFour(pool: string[]): string[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 4);
}

export function SuggestionPills({ currentValue, onSelect }: SuggestionPillsProps) {
  const pills = useMemo(() => sampleFour(HERO_SUGGESTIONS), []);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleClick = (suggestion: string) => {
    let next: string;
    const trimmed = currentValue.trimEnd();
    if (trimmed.length === 0) {
      next = suggestion;
    } else if (/[.,;\n]$/.test(trimmed)) {
      next = `${trimmed} ${suggestion}`;
    } else {
      next = `${trimmed}. ${suggestion}`;
    }
    onSelect(next);

    // focus the textarea after appending
    if (!textareaRef.current) {
      textareaRef.current = document.querySelector<HTMLTextAreaElement>("textarea");
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill}
          type="button"
          onClick={() => handleClick(pill)}
          className="rounded-full border border-white/15 px-3.5 py-1.5 font-body text-[12px] text-white/55 transition-colors hover:border-gold/45 hover:bg-gold/5 hover:text-gold/90"
        >
          {pill}
        </button>
      ))}
    </div>
  );
}
