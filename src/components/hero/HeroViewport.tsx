import { ChatInput } from "./ChatInput";
import { SuggestionChips } from "./SuggestionChips";

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

type HeroViewportProps = {
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string;
  diagnosticResult: DiagnosticResponse | null;
  onViewCompanyDetails: () => void;
};

const starterPrompts = [
  "We rely on referrals for most new customers.",
  "Sales cycles are getting longer in the last two quarters.",
  "We have repeat customers, but churn is rising in one segment.",
  "Our team spends too much time on manual operations.",
];

function levelBadgeClass(level: "low" | "medium" | "high") {
  if (level === "high") {
    return "border-red-300/40 bg-red-300/20 text-red-100";
  }
  if (level === "medium") {
    return "border-yellow-300/40 bg-yellow-300/20 text-yellow-100";
  }
  return "border-emerald-300/40 bg-emerald-300/20 text-emerald-100";
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
  return (
    <div className="hero-body relative z-20 h-[calc(100%-72px)] overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="max-w-4xl text-balance text-center font-heading text-[clamp(30px,6vw,72px)] leading-tight text-white">
          Give me 5 facts about your business, and I will give you 5 potential problems.
        </h1>
        <p className="mt-4 max-w-2xl text-center font-body text-[16px] leading-relaxed text-white/65 sm:mt-5 sm:text-[18px]">
          If none are accurate, I owe you a cup of coffee.
        </p>
        <p className="mt-2 max-w-2xl text-center font-body text-[15px] leading-relaxed text-white/60">
          This is a strategic diagnostic, not a generic chat.
        </p>

        <div className="mt-6 w-full sm:mt-8">
          <ChatInput
            value={composerText}
            onChange={onComposerTextChange}
            placeholder="Type 5 facts about your business..."
            onSubmit={onAnalyze}
            isLoading={isAnalyzing}
          />
        </div>
        <SuggestionChips chips={starterPrompts} onSelect={onComposerTextChange} />

        {isAnalyzing ? (
          <p className="mt-3 text-center font-body text-[15px] text-gold">
            Analyzing operational, strategic, and scaling risks...
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
                Business Summary
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.business_summary}
              </p>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Venture Capitalist View
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.venture_capitalist_view}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Top 5 Predicted Risks
              </h3>
              <div className="space-y-3">
                {diagnosticResult.top_5_risks.map((risk, index) => (
                  <article
                    key={`${risk.title}-${index}`}
                    className="rounded-[4px] border border-white/20 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading text-[22px] text-white">{risk.title}</h4>
                      <span className="rounded-[4px] border border-white/25 px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] text-white/75">
                        {risk.category.replace("_", " ")}
                      </span>
                      <span
                        className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${levelBadgeClass(risk.severity)}`}
                      >
                        Severity {risk.severity}
                      </span>
                      <span
                        className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${levelBadgeClass(risk.likelihood_currently_happening)}`}
                      >
                        Current likelihood {risk.likelihood_currently_happening}
                      </span>
                    </div>

                    <p className="mt-3 font-body text-[15px] leading-relaxed text-white/85">
                      {risk.why_it_could_happen}
                    </p>

                    <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                      Current Warning Signs
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 font-body text-[14px] text-white/80">
                      {risk.current_warning_signs.map((sign) => (
                        <li key={sign}>{sign}</li>
                      ))}
                    </ul>

                    <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                      Impact If Ignored
                    </p>
                    <p className="mt-1 font-body text-[15px] text-white/85">{risk.impact_if_ignored}</p>

                    <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                      Recommended Next Step
                    </p>
                    <p className="mt-1 font-body text-[15px] text-white/85">
                      {risk.recommended_next_step}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Final Assessment
              </h3>
              <p className="mt-2 font-body text-[15px] text-white/85">
                {diagnosticResult.final_assessment}
              </p>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Next Conversation
              </h3>
              <p className="mt-2 font-body text-[15px] text-white/85">
                {diagnosticResult.call_to_action}
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
