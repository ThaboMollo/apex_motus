"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCollapsedNav } from "./HeroCollapsedNav";
import { HeroViewport } from "./HeroViewport";
import { HeroPhase } from "./types";

const COLLAPSE_DELAY_MS = 100;
const COLLAPSE_TRIGGER_PX = 10;
const FACT_COUNT = 5;
const MIN_FACT_CHARS = 8;

type DiagnosticRisk = {
  title: string;
  category:
    | "operations"
    | "sales"
    | "team"
    | "finance"
    | "technology"
    | "customer_experience"
    | "strategy"
    | "compliance";
  severity: "low" | "medium" | "high";
  likelihood_currently_happening: "low" | "medium" | "high";
  why_it_could_happen: string;
  current_warning_signs: string[];
  impact_if_ignored: string;
  recommended_next_step: string;
};

type DiagnosticResponse = {
  business_summary: string;
  venture_capitalist_view: string;
  top_5_risks: DiagnosticRisk[];
  final_assessment: string;
  call_to_action: string;
};

export function HeroShell() {
  const [phase, setPhase] = useState<HeroPhase>("expanded");
  const [composerText, setComposerText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResponse | null>(null);
  const timerRef = useRef<number | null>(null);
  const phaseRef = useRef<HeroPhase>("expanded");

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const setPhaseSafe = (nextPhase: HeroPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  const collapseToSection = (targetId?: string) => {
    if (phaseRef.current !== "expanded") {
      if (phaseRef.current === "collapsed" && targetId) {
        const section = document.getElementById(targetId);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    clearTimer();
    setPhaseSafe("precollapse");
    timerRef.current = window.setTimeout(() => {
      setPhaseSafe("collapsed");
      timerRef.current = null;
      if (targetId) {
        window.requestAnimationFrame(() => {
          const section = document.getElementById(targetId);
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }, COLLAPSE_DELAY_MS);
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY <= COLLAPSE_TRIGGER_PX) {
        clearTimer();
        if (phaseRef.current !== "expanded") {
          setPhaseSafe("expanded");
        }
        return;
      }

      if (phaseRef.current === "expanded") {
        collapseToSection();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimer();
    };
  }, []);

  const handleTalkToUs = () => {
    if (phaseRef.current === "expanded") {
      collapseToSection("contact");
      return;
    }
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewCompanyDetails = () => {
    collapseToSection("about");
  };

  const normalizeFact = (fact: string, index: number) => {
    const trimmed = fact.trim();
    if (trimmed.length >= MIN_FACT_CHARS) {
      return trimmed;
    }
    if (trimmed.length > 0) {
      return `Fact ${index + 1}: ${trimmed}`;
    }
    return `Fact ${index + 1}: Additional context was not provided.`;
  };

  const handleAnalyzeBusiness = async () => {
    const input = composerText.trim();
    if (!input) {
      setAnalysisError("Please add your business facts before analyzing.");
      setDiagnosticResult(null);
      return;
    }

    const chunks = input
      .split(/\r?\n|;|,|\.(?=\s|$)|\?(?=\s|$)|!(?=\s|$)/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    const normalizedFacts = Array.from({ length: FACT_COUNT }, (_, index) =>
      normalizeFact(chunks[index] ?? "", index),
    );

    setAnalysisError("");
    setIsAnalyzing(true);
    setDiagnosticResult(null);

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts: normalizedFacts }),
      });

      const payload = (await response.json()) as
        | DiagnosticResponse
        | { error?: string; details?: unknown };

      if (!response.ok) {
        setAnalysisError(
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "Unable to analyze the business right now.",
        );
        return;
      }

      setDiagnosticResult(payload as DiagnosticResponse);
    } catch {
      setAnalysisError("Network error while analyzing your business facts.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className={`hero-shell hero-${phase}`} aria-label="Hero">
      <div className="absolute inset-0 bg-surface-dark" />

      <HeroCollapsedNav onTalkToUs={handleTalkToUs} />
      <HeroViewport
        composerText={composerText}
        onComposerTextChange={setComposerText}
        onAnalyze={handleAnalyzeBusiness}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        diagnosticResult={diagnosticResult}
        onViewCompanyDetails={handleViewCompanyDetails}
      />
    </section>
  );
}
