export type HeroPhase = "expanded" | "precollapse" | "collapsed";

export type RiskCategory =
  | "operations"
  | "sales"
  | "team"
  | "finance"
  | "technology"
  | "customer_experience"
  | "strategy"
  | "compliance";

export type SeverityLevel = "low" | "medium" | "high";
export type RiskType = "execution" | "structural";

export type CriticalProblem = {
  title: string;
  category: RiskCategory;
  severity: SeverityLevel;
  risk_type: RiskType;
  the_exposure: string;
  ceo_perspective: string;
  mitigating_move: string;
};

export type DiagnosticResponse = {
  business_context: string;
  strategic_posture: string;
  critical_problems: CriticalProblem[];
  closing_directive: string;
};
