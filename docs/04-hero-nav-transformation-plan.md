# Hero-to-Nav Transformation Plan

Source: `ApexMotus_Hero_update.md`

## Goal

Implement a full-screen, chat-style hero that transforms into a persistent top navigation bar on first downward scroll, with a delayed two-stage animation and clear component separation.

## Gap Review Against Current Code

Current implementation file: `src/components/HeroFlowSection.tsx`

1. Delay mismatch:
   - Current delay is `220ms`.
   - Spec asks for about `100ms`.

2. Trigger mismatch:
   - Current collapse trigger waits until user has scrolled near/past the hero height.
   - Spec says transformation should initiate on first scroll.

3. Component architecture mismatch:
   - Hero and collapsed nav are implemented inside one component.
   - Spec asks for separate Hero and Nav components with shared transition state.

4. Animation mismatch:
   - Current transition is single smooth CSS transition.
   - Spec asks for slight clunky feel then clean snap.

## Proposed Implementation

### 1) Component Split

Create:

- `src/components/hero/HeroViewport.tsx`
  - Full-screen chat-style hero content and composer UI.
- `src/components/hero/HeroCollapsedNav.tsx`
  - Sticky top bar shown after transformation.
- `src/components/hero/HeroShell.tsx`
  - Orchestrator that owns transition state and scroll listeners.

Then update `src/app/page.tsx` to render `HeroShell` instead of direct hero markup.

### 2) Shared Transition State

In `HeroShell`, manage:

- `phase: "expanded" | "precollapse" | "collapsed"`
- `hasUserTriggeredCollapse: boolean`
- `composerText: string` (pass to expanded hero)

Behavior:

- On first downward scroll from top (small threshold, e.g. > 6px), set `precollapse`.
- Wait `100ms`.
- Move to `collapsed`.
- Keep collapsed while user is below hero.

### 3) Animation Design

Two-stage effect:

- Stage A (`precollapse`, ~120-160ms): slight rough/clunky shift (small translate + tiny scale or skew).
- Stage B (`collapsed`, ~180-220ms): snap into clean sticky nav position.

Implementation detail:

- Prefer CSS keyframes on container class, then settle to stable nav styles.
- Respect `prefers-reduced-motion` by using direct state switch with minimal animation.

### 4) Scroll and Restore Logic

- Expanded hero occupies `100vh`.
- User can scroll naturally into content below.
- Collapsed nav is fixed and persistent.
- Clicking `Talk to Us` while collapsed restores hero and scrolls to top/hero anchor.

### 5) Accessibility and UX

- Keep interactive elements keyboard reachable in both states.
- Preserve focus outline in dark theme.
- Ensure text remains readable at small mobile widths.
- Keep nav height stable at `64px` to avoid layout jitter.

### 6) Verification

- Type check (`tsc --noEmit`)
- Build (`npm run build`)
- Manual checks:
  - Desktop + mobile viewport
  - First-scroll collapse timing
  - Restore via `Talk to Us`
  - Smooth scrolling to Contact from expanded hero state

## Questions To Lock Before Coding

1. First-scroll trigger:
   - Should collapse start on any downward scroll (`> 0px`) or use a tiny threshold (`6-12px`) to avoid accidental touch jitter?

2. Collapsed-state restore policy:
   - Keep current behavior: while collapsed, `Talk to Us` restores hero.
   - Confirm: no auto-expand when user scrolls back to top.

3. Clunky effect strength:
   - Subtle (small bump) or obvious (clear jolt then snap)?

4. Component folder:
   - I recommend `src/components/hero/` for clean separation. Confirm this structure.
