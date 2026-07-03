"use client";

import { FactsTextarea } from "./FactsTextarea";
import { SuggestionPills } from "./SuggestionPills";

const HEADLINE = "Give me 5 facts about your business, and I'll give you 5 potential problems.";
const CHAR_REVEAL_STEP_MS = 14;

type HeroViewportProps = {
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string;
  onViewCompanyDetails: () => void;
};

export function HeroViewport({
  composerText,
  onComposerTextChange,
  onAnalyze,
  isAnalyzing,
  analysisError,
  onViewCompanyDetails,
}: HeroViewportProps) {
  return (
    <div className="hero-body relative z-20 h-[calc(100%-72px)] overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-5 font-caption text-[12px] uppercase tracking-[0.18em] text-gold/90">
          Apex Motus &mdash; Business Growth Advisory &middot; South Africa
        </p>

        <h1 className="max-w-4xl text-balance text-center font-heading text-[clamp(30px,6vw,72px)] leading-tight text-white">
          {HEADLINE.split("").map((char, i) => (
            <span
              key={i}
              className="headline-char"
              style={{ animationDelay: `${i * CHAR_REVEAL_STEP_MS}ms` }}
            >
              {char}
            </span>
          ))}
          <span
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-gold align-middle"
            style={{ animation: "blink 0.9s step-end infinite" }}
          />
        </h1>

        <div className="mt-4 max-w-2xl text-center">
          <p className="font-body text-[16px] leading-relaxed text-white/65 sm:text-[18px]">
            We help South African businesses remove what&rsquo;s slowing them down.
          </p>
          <p className="mt-1 font-body text-[15px] leading-relaxed text-gold/80">
            If none of our 5 problems are accurate &mdash; coffee&rsquo;s on us.
          </p>
        </div>

        <div className="mt-6 w-full sm:mt-8">
          <FactsTextarea
            value={composerText}
            onChange={onComposerTextChange}
            onSubmit={onAnalyze}
            isLoading={isAnalyzing}
          />
        </div>

        <SuggestionPills currentValue={composerText} onSelect={onComposerTextChange} />

        {isAnalyzing ? (
          <p className="mt-3 text-center font-body text-[15px] text-gold">
            Analysing operational, strategic, and scaling risks…
          </p>
        ) : null}

        {analysisError ? (
          <p className="mt-3 max-w-3xl text-center font-body text-[15px] text-red-200">
            {analysisError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onViewCompanyDetails}
          className="mt-6 rounded-[4px] border border-gold/50 bg-gold/10 px-4 py-2 font-caption text-[10px] font-semibold uppercase tracking-widest2 text-gold transition-colors hover:bg-gold/20 sm:mt-8 sm:px-5 sm:text-[11px]"
        >
          View Company Details
        </button>
      </div>
    </div>
  );
}
