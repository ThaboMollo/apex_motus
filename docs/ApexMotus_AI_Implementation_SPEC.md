# Apex Motus Hero Diagnostic Chat — 5 Facts → 5 Risks Feature Spec

## Objective

Turn the hero section into a guided business diagnostic experience.

The hero's primary function is NOT general chat.

Its primary function is:

- collect exactly 5 facts about the client's business
- analyze those facts using OpenAI
- return exactly 5 things that could go wrong in that business
- predict which of those problems may already be happening
- structure the output so the UI can render it cleanly and consistently

---

## Feature Summary

The hero screen should behave like a premium AI diagnostic assistant for businesses.

### User Journey

1. User lands on hero chat screen
2. Assistant asks for 5 facts about the business
3. User submits the facts
4. Frontend sends the facts to backend API
5. Backend sends a structured prompt to OpenAI
6. OpenAI returns a structured JSON response
7. Frontend renders:
   - summary of business
   - 5 predicted risks/problems
   - why each problem may happen
   - likelihood of it already happening
   - recommended next conversation step

---

## Functional Requirements

### 1. Input Constraint

The feature must collect exactly 5 business facts.

### Accepted Input Formats

Allow either:

- one large textarea where the user writes 5 facts
- or 5 separate input rows

### Recommended UI

Use 5 separate fact inputs for better control.

Example labels:

- Fact 1
- Fact 2
- Fact 3
- Fact 4
- Fact 5

### Validation Rules

- all 5 facts are required
- each fact must have a minimum of 8 characters
- trim whitespace
- prevent submission unless all 5 are present

---

## UX Copy

### Initial Assistant Message

"Give me 5 facts about your business, and I’ll identify 5 things that could go wrong — including problems you may already be facing."

### Supporting Line

"This is a strategic diagnostic, not a generic chat."

### CTA Button

- Text: "Analyze My Business"

### Loading State

- Text: "Analyzing operational, strategic, and scaling risks..."

---

## Frontend Behavior

### Main Component

`HeroBusinessDiagnostic.tsx`

### Responsibilities

- render the hero chat shell
- render 5 fact inputs
- validate inputs
- submit facts to backend
- render structured results

### Suggested State

```ts
type DiagnosticFact = {
  id: number;
  value: string;
};

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
```
