"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCollapsedNav } from "./HeroCollapsedNav";
import { HeroViewport } from "./HeroViewport";
import { DiagnosisModal } from "./DiagnosisModal";
import { HeroPhase } from "./types";

const COLLAPSE_DELAY_MS = 100;
const COLLAPSE_TRIGGER_PX = 10;
const MIN_TEXT_CHARS = 20;

export function HeroShell() {
  const [phase, setPhase] = useState<HeroPhase>("expanded");
  const [composerText, setComposerText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [diagnosticContent, setDiagnosticContent] = useState("");
  const [diagnosticTitle, setDiagnosticTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const buildDiagnosticPrompt = (facts: string): string => {
    return `You are acting as a veteran Fortune 500 CEO and Strategic Consultant with 30 years of experience in scaling companies and navigating market disruptions. Your tone is clinical, decisive, and focused on long-term enterprise value.

Task: I am going to provide you with 5 specific facts about my business. Based on these inputs, perform a high-level strategic audit.

Analysis Framework:
1. Identify the Friction: Where do these facts create immediate operational or financial bottlenecks?
2. Predict the Blind Spots: What "second-order" consequences are invisible to most founders but obvious to an enterprise leader?
3. Risk Mapping: Classify threats as either "Execution Risks" (internal) or "Structural Risks" (external).

Output Requirements:
Provide a summary of 5 Critical Problems (Current or Predicted). For each problem, include:

The Exposure: Why this specific combination of my business facts creates a vulnerability.

The CEO Perspective: A one-sentence "hard truth" regarding this problem.

The Mitigating Move: One high-level strategic action to neutralize the threat.

Here's the facts about the company: ${facts}`;
  };

  const handleAnalyzeBusiness = async () => {
    const facts = composerText.trim();
    if (facts.length < MIN_TEXT_CHARS) {
      setAnalysisError("Please describe your business a bit more before analysing.");
      return;
    }

    const text = buildDiagnosticPrompt(facts);

    const FALLBACK_MESSAGE =
      "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly.";

    setAnalysisError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as
        | { markdown?: string }
        | { error?: string };

      if (!response.ok || !("markdown" in payload) || typeof payload.markdown !== "string") {
        const message =
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : FALLBACK_MESSAGE;
        setDiagnosticTitle("Enquiry Received");
        setDiagnosticContent(message);
        setIsModalOpen(true);
        return;
      }

      setDiagnosticTitle("Strategic Audit Diagnosis");
      setDiagnosticContent(payload.markdown);
      setIsModalOpen(true);
    } catch {
      setDiagnosticTitle("Enquiry Received");
      setDiagnosticContent(FALLBACK_MESSAGE);
      setIsModalOpen(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className={`hero-shell hero-${phase}`} aria-label="Hero">
      <div className="absolute inset-0 bg-surface-dark" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <HeroCollapsedNav onTalkToUs={handleTalkToUs} />
      <HeroViewport
        composerText={composerText}
        onComposerTextChange={setComposerText}
        onAnalyze={handleAnalyzeBusiness}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        onViewCompanyDetails={handleViewCompanyDetails}
      />
      <DiagnosisModal
        isOpen={isModalOpen}
        title={diagnosticTitle}
        content={diagnosticContent}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
