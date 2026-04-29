"use client";

import { useEffect, useState } from "react";
import { FactsTextarea } from "./FactsTextarea";
import { SuggestionPills } from "./SuggestionPills";
import { CriticalProblem, DiagnosticResponse } from "./types";

const HEADLINE = "Give me 5 facts about your business, and I'll give you 5 potential problems.";
const TYPEWRITER_INTERVAL_MS = 38;

type HeroViewportProps = {
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string;
  diagnosticResult: DiagnosticResponse | null;
  onViewCompanyDetails: () => void;
};

function levelBadgeClass(level: "low" | "medium" | "high") {
  if (level === "high") return "border-red-300/40 bg-red-300/20 text-red-100";
  if (level === "medium") return "border-yellow-300/40 bg-yellow-300/20 text-yellow-100";
  return "border-emerald-300/40 bg-emerald-300/20 text-emerald-100";
}

function riskTypeBadgeClass(riskType: "execution" | "structural") {
  if (riskType === "structural") return "border-purple-300/40 bg-purple-300/10 text-purple-200";
  return "border-sky-300/40 bg-sky-300/10 text-sky-200";
}

function ProblemCard({ problem }: { problem: CriticalProblem }) {
  return (
    <article className="rounded-[4px] border border-white/20 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-heading text-[22px] text-white">{problem.title}</h4>
        <span className="rounded-[4px] border border-white/25 px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] text-white/75">
          {problem.category.replace("_", " ")}
        </span>
        <span
          className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${levelBadgeClass(problem.severity)}`}
        >
          {problem.severity} severity
        </span>
        <span
          className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${riskTypeBadgeClass(problem.risk_type)}`}
        >
          {problem.risk_type === "execution" ? "Execution Risk" : "Structural Risk"}
        </span>
      </div>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        The Exposure
      </p>
      <p className="mt-1 font-body text-[15px] leading-relaxed text-white/85">
        {problem.the_exposure}
      </p>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        CEO Perspective
      </p>
      <p className="mt-1 font-body text-[15px] italic leading-relaxed text-white/85">
        &ldquo;{problem.ceo_perspective}&rdquo;
      </p>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        Mitigating Move
      </p>
      <p className="mt-1 font-body text-[15px] leading-relaxed text-white/85">
        {problem.mitigating_move}
      </p>
    </article>
  );
}

export function HeroViewport({
  composerText,
  onComposerTextChange,
  onAnalyze,
  isAnalyzing,
  analysisError,
  diagnosticResult,
  onViewCompanyDetails,
}: HeroViewportProps) {
  const [displayedHeadline, setDisplayedHeadline] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayedHeadline(HEADLINE.slice(0, i));
      if (i >= HEADLINE.length) {
        clearInterval(interval);
      }
    }, TYPEWRITER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-body relative z-20 h-[calc(100%-72px)] overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-5 font-caption text-[10px] uppercase tracking-[0.18em] text-gold/72">
          Apex Motus &mdash; Business Growth Advisory &middot; South Africa
        </p>

        <h1 className="max-w-4xl text-balance text-center font-heading text-[clamp(30px,6vw,72px)] leading-tight text-white">
          {displayedHeadline}
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

        {diagnosticResult ? (
          <section className="mt-6 w-full max-w-4xl space-y-4 rounded-[4px] border border-gold/30 bg-navy/55 p-4 sm:p-6">
            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Business Context
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.business_context}
              </p>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Strategic Posture
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.strategic_posture}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                5 Critical Problems
              </h3>
              <div className="space-y-3">
                {diagnosticResult.critical_problems.map((problem, index) => (
                  <ProblemCard key={`${problem.title}-${index}`} problem={problem} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Closing Directive
              </h3>
              <p className="mt-2 font-body text-[15px] text-white/85">
                {diagnosticResult.closing_directive}
              </p>
            </div>
          </section>
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
