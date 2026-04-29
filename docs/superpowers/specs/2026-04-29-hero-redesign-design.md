# Hero Redesign — Design Spec
_Date: 2026-04-29_

## Goal

Redesign the Apex Motus hero section to feel like landing on claude.ai — the user immediately senses they are talking to an AI, feels compelled to interact, and understands what the company does within 7 seconds.

---

## Decisions Made

| Dimension | Decision |
|---|---|
| Background | Animated aurora — 3 radial gradient blobs drifting slowly |
| Headline animation | Typewriter — characters type out on mount, ~38ms per char |
| Input | Auto-growing textarea (min 2 rows, max ~6 rows) with send button inside |
| Suggestion pills | 4 randomly sampled from 50-item pool on each mount; click appends to textarea |
| Brand anchor | Eyebrow line above headline: "Apex Motus — Business Growth Advisory · South Africa" |
| Tagline | Two lines below headline: company descriptor + coffee hook |

---

## Component Architecture

### 1. `HeroViewport` (existing — replace internals)

Owned by `HeroShell` which handles collapse/expand on scroll. No structural change to `HeroShell`.

Changes inside `HeroViewport`:
- Replace static headline `<h1>` with typewriter-animated version
- Replace `<ChatInput>` with new `<FactsTextarea>`
- Replace `<SuggestionChips>` with new `<SuggestionPills>`
- Add aurora background layer (CSS only, no JS)
- Update eyebrow line and tagline copy

### 2. `FactsTextarea` (new component — replaces `ChatInput`)

**File:** `src/components/hero/FactsTextarea.tsx`

**Props:**
```ts
type FactsTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};
```

**Behaviour:**
- `<textarea>` element, `rows={2}`, auto-grows on input via `scrollHeight`
- Max height: `200px` (overflow-y: auto above that)
- Send button lives inside the box, bottom-right corner
- Send button disabled when `value.trim().length < 8` or `isLoading`
- Pressing `Cmd/Ctrl + Enter` triggers submit
- Placeholder: `"Start with your first fact — e.g. We rely on referrals for most new clients…"`
- Fact counter below-left: counts sentence-like segments (split on `.`, `\n`, `,`, `;`, `!`, `?`) with length > 4 chars. Shows `"0 facts detected"` → `"N facts detected"` in gold when > 0.

**Styling:**
- Container: `rounded-2xl border border-gold/25 bg-white/[0.06] px-5 pt-4 pb-3`
- Focus state: `border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.07)]`
- Textarea: transparent bg, `text-white/88`, placeholder `text-white/25 italic`
- Footer separator: `border-t border-white/7`
- Send button: `bg-gold text-navy rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-widest shadow-[0_0_16px_rgba(212,175,55,0.35)]`

### 3. `SuggestionPills` (new component — replaces `SuggestionChips`)

**File:** `src/components/hero/SuggestionPills.tsx`

**Props:**
```ts
type SuggestionPillsProps = {
  onSelect: (text: string) => void;
};
```

**Behaviour:**
- On mount: sample 4 items from the 50-item pool using a Fisher-Yates shuffle on a copy of the array. Selection is stable for the component's lifetime (no re-shuffle on re-render).
- Clicking a pill appends the suggestion to the current textarea value:
  - If textarea is empty: set value to the suggestion text
  - If textarea ends with a sentence terminator (`. , ; \n`): append a space + suggestion
  - Otherwise: append `. ` + suggestion
- After appending, focus the textarea so the user can keep typing

**The 50-item pool** lives in `src/components/hero/suggestions.ts` as a plain exported array. Keeping it separate makes it easy to add/remove items.

**Styling:**
- Pills: `border border-white/15 rounded-full px-3.5 py-1.5 text-[12px] text-white/55`
- Hover: `border-gold/45 text-gold/90 bg-gold/5`

### 4. Aurora background

**Implementation:** Pure CSS in `globals.css` — three `<div class="blob blob-N">` elements inside the `hero-shell` that drift via a `@keyframes drift` animation.

No JS. No canvas. Three blobs:
- Blob 1: navy blue, top-left, 14s drift
- Blob 2: purple, bottom-right, 18s drift  
- Blob 3: faint gold, center-right, 22s drift

All blobs: `filter: blur(70px)`, `border-radius: 50%`, `position: absolute`, `pointer-events: none`.

`@media (prefers-reduced-motion: reduce)`: disable animation, keep blobs as static radial gradients.

### 5. Typewriter animation

**Implementation:** `useEffect` inside `HeroViewport` (client component). On mount, start an interval that appends one character of the headline string every `38ms`. After the full string is typed, stop the interval. A blinking `<span>` cursor (gold, `2px wide`) sits at the end of the text node and blinks via CSS `@keyframes blink`.

Headline string: `"Give me 5 facts about your business, and I'll give you 5 potential problems."`

The typewriter runs once. No loop. Cursor continues blinking after typing completes.

Cleanup: clear the interval in the `useEffect` return function to avoid state updates on unmounted component.

### 6. Copy changes in `HeroViewport`

**Eyebrow (above h1):**
```
Apex Motus — Business Growth Advisory · South Africa
```
Styling: `font-caption text-[10px] tracking-[0.18em] uppercase text-gold/72 mb-5`

**Tagline (below h1, above input):**
```
Line 1: We help South African businesses remove what's slowing them down.
Line 2 (gold): If none of our 5 problems are accurate — coffee's on us.
```

**Remove:** "This is a strategic diagnostic, not a generic chat." line (replaced by tagline above)

**Keep:** "View Company Details" button at bottom (unchanged)

---

## Files to Change

| File | Change |
|---|---|
| `src/components/hero/HeroViewport.tsx` | Typewriter, new eyebrow/tagline copy, swap ChatInput → FactsTextarea, swap SuggestionChips → SuggestionPills, add aurora blobs |
| `src/components/hero/FactsTextarea.tsx` | New file |
| `src/components/hero/SuggestionPills.tsx` | New file |
| `src/components/hero/suggestions.ts` | New file — the 50-item pool |
| `src/app/globals.css` | Add `.blob` keyframes and aurora styles |
| `src/components/hero/ChatInput.tsx` | Delete (replaced) |
| `src/components/hero/SuggestionChips.tsx` | Delete (replaced) |

---

## What Does Not Change

- `HeroShell` — collapse/scroll logic unchanged
- `HeroCollapsedNav` — navbar unchanged
- `HeroPhase` types — unchanged

---

## Diagnostic Prompt Redesign

### Input contract change

| | Old | New |
|---|---|---|
| Request body | `{ facts: string[] }` (exactly 5 pre-split strings) | `{ text: string }` (raw free-form textarea content) |
| Validation | Exactly 5 items, each ≥ 8 chars | `text.trim().length >= 20` |
| Client-side splitting | `HeroShell` splits on punctuation | Removed — AI extracts context from prose |

### New TypeScript types

```ts
type CriticalProblem = {
  title: string;
  category: "operations" | "sales" | "team" | "finance" | "technology" | "customer_experience" | "strategy" | "compliance";
  severity: "low" | "medium" | "high";
  risk_type: "execution" | "structural";
  the_exposure: string;
  ceo_perspective: string;
  mitigating_move: string;
};

type DiagnosticResponse = {
  business_context: string;
  strategic_posture: string;
  critical_problems: CriticalProblem[];
  closing_directive: string;
};
```

### System prompt (CEO persona)

```
You are a veteran Fortune 500 CEO and Strategic Consultant with 30 years of experience
scaling companies and navigating market disruptions. Your tone is clinical, decisive,
and focused on long-term enterprise value.

You will receive a free-form description of a business written by its owner or leadership
team. It may be a list of facts, a paragraph, or a mix. Extract all relevant context.

Analysis Framework:
1. Identify the Friction — where do these facts create immediate operational or financial bottlenecks?
2. Predict the Blind Spots — what second-order consequences are invisible to most founders
   but obvious to a seasoned enterprise leader?
3. Risk Mapping — classify each threat as either an Execution Risk (internal, within the
   business's control) or a Structural Risk (external — market, regulatory, or competitive forces).

Output exactly 5 Critical Problems — current vulnerabilities or near-term predicted threats.
For each problem provide:
- The Exposure: why this specific combination of business facts creates this vulnerability.
- The CEO Perspective: one sentence only — a hard, unfiltered truth about the problem.
- The Mitigating Move: one high-level strategic action to neutralize or contain the threat.

Be concrete. Do not hedge. Name the actual risk plainly.
Return valid JSON matching the provided schema exactly. No markdown, no prose outside the JSON.
```

### User prompt (assembled from textarea input)

```
Here is what I know about this business:

{text}

Perform the strategic audit. Identify the 5 most critical problems this business is either
facing now or will face within the next 12 months.
```

### New JSON schema (replaces existing)

Fields changed:
- `business_summary` → `business_context`
- `venture_capitalist_view` → `strategic_posture`
- `top_5_risks` → `critical_problems`
- Per-problem: `why_it_could_happen` → `the_exposure`, add `ceo_perspective`, `recommended_next_step` → `mitigating_move`
- Added `risk_type: "execution" | "structural"` per problem
- Removed: `current_warning_signs`, `likelihood_currently_happening`, `impact_if_ignored`
- `final_assessment` + `call_to_action` → merged into `closing_directive`

### HeroViewport result rendering changes

| Old field | New field | Display label |
|---|---|---|
| `business_summary` | `business_context` | Business Context |
| `venture_capitalist_view` | `strategic_posture` | Strategic Posture |
| `top_5_risks[].title` | `critical_problems[].title` | Problem title |
| `top_5_risks[].why_it_could_happen` | `critical_problems[].the_exposure` | The Exposure |
| _(new)_ | `critical_problems[].ceo_perspective` | CEO Perspective |
| `top_5_risks[].recommended_next_step` | `critical_problems[].mitigating_move` | Mitigating Move |
| `final_assessment` + `call_to_action` | `closing_directive` | Closing Directive |

Keep: `category` badge, `severity` badge, `risk_type` badge (new — shows "Execution Risk" or "Structural Risk").

### Files affected by prompt redesign

| File | Change |
|---|---|
| `src/app/api/diagnostic/route.ts` | New prompts, new schema, new input validation (`text` not `facts`) |
| `src/components/hero/HeroShell.tsx` | Send `{ text: composerText }`, remove fact-splitting logic, update types |
| `src/components/hero/HeroViewport.tsx` | Update result rendering to new field names + new `risk_type` badge |

---

## Suggestions Pool

Stored in `src/components/hero/suggestions.ts`:

```ts
export const HERO_SUGGESTIONS: string[] = [
  "We rely on referrals",
  "We are a consultancy firm",
  "We stock in bulk and resell",
  "We develop software solutions based on client requirements",
  "We provide 24/7 personalised support",
  "We offer white-glove delivery and installation",
  "We provide on-site technical training",
  "We act as an outsourced department",
  "We offer emergency rapid-response times",
  "We provide bespoke tailoring for specialised equipment",
  "We facilitate networking and industry connections",
  "We offer concierge-level project management",
  "We manufacture in small batches for high quality",
  "We source exclusively from local producers",
  "We provide try-before-you-buy sample programs",
  "We offer subscription-based inventory replenishment",
  "We curate best-in-class product bundles",
  "We use 100% eco-friendly and compostable packaging",
  "We offer lifetime warranties on all craftsmanship",
  "We refurbish and resell high-end electronics",
  "We provide white-label manufacturing for other brands",
  "We provide API integrations between disparate systems",
  "We offer rapid prototyping and 3D modelling",
  "We provide creative direction and brand strategy",
  "We perform deep-dive technical security audits",
  "We offer fractional C-suite leadership talent",
  "We specialise in legacy system maintenance and repair",
  "We provide interactive data visualisation and analytics",
  "We offer UX/UI optimisation for digital platforms",
  "We conduct hyper-local market research",
  "We operate a low-overhead model to reduce client costs",
  "We offer flexible pay-as-you-grow payment plans",
  "We have no minimum order quantities",
  "We offer geographic exclusivity to our partners",
  "We provide turnkey solutions for retail franchises",
  "We leverage family-owned heritage and stability",
  "We offer risk-free performance-based trials",
  "We pivot service offerings based on real-time trends",
  "We provide navigation through complex regulatory red tape",
  "We offer unbundled services to prevent overpaying",
  "We specialise in sourcing hard-to-find or obsolete parts",
  "We provide linguistic and cultural localisation",
  "We cater to high-net-worth individuals requiring privacy",
  "We operate as an artisan workshop for handmade goods",
  "We provide 24-hour disaster recovery services",
  "We offer pop-up retail and temporary storefront solutions",
  "We focus on inclusive and accessible design standards",
  "We provide just-in-time inventory management",
  "We offer exclusive community membership access",
  "We provide radical transparency in the supply chain",
];
```
