# Apex Motus — Full Design Implementation Spec

> **Style:** Monumental Editorial · Parchment Gold palette · Hospitality Interior Photography
> **Accent palette:** `navy: #0a1028` · `royal: #1c2ca3` · `gold: #d4af37`
> **Generated from Pencil design — nodes `wQ1Mq` (Hero + About) & `BnH79` (Features → Footer)**

---

## 1. Tech Stack

| Concern      | Choice                                                   |
| ------------ | -------------------------------------------------------- |
| Framework    | **Next.js 14** (App Router, SSR for SEO)                 |
| Styling      | **Tailwind CSS v4** + CSS custom properties              |
| Fonts        | Google Fonts — Playfair Display, Newsreader, Funnel Sans |
| Animation    | **Framer Motion** (scroll-triggered hero→nav transition) |
| Images       | **Next/Image** with `fill` + blur placeholder            |
| Stock Photos | Unsplash API (hotel lobby, lounge, boutique hotel)       |
| Contact Form | **Resend** (email API) + React Hook Form + Zod           |
| AI Chat      | **OpenAI API** (gpt-4o) via Next.js Route Handler        |
| Hosting      | **Vercel**                                               |
| Analytics    | Vercel Analytics                                         |

---

## 2. Design System Tokens

### 2.1 CSS Custom Properties

Add to `src/app/globals.css`:

```css
:root {
  /* Surface */
  --surface-primary: #f4f2ef;
  --surface-dark: #0a1028;

  /* Foreground */
  --fg-primary: #1a1a1a;
  --fg-secondary: #4a4a4a;
  --fg-inverse: #ffffff;

  /* Brand accents */
  --navy: #0a1028;
  --royal: #1c2ca3;
  --gold: #d4af37;

  /* Roundness — Monumental Editorial = 0 radius on layout elements */
  --radius-none: 0px;
  --radius-sm: 4px; /* buttons only */

  /* Spacing scale */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;
  --space-2xl: 120px;

  /* Typography scale */
  --text-caption: 11px;
  --text-body-sm: 14px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subhead: 20px;
  --text-h3: 26px;
  --text-h2: 42px;
  --text-display: clamp(120px, 13vw, 190px); /* monumental bleeding heading */
}
```

### 2.2 Tailwind Config Additions (`tailwind.config.ts`)

```ts
theme: {
  extend: {
    fontFamily: {
      heading:  ['Playfair Display', 'serif'],
      body:     ['Newsreader', 'serif'],
      caption:  ['Funnel Sans', 'sans-serif'],
    },
    colors: {
      surface:  { primary: '#F4F2EF', dark: '#0a1028' },
      fg:       { primary: '#1A1A1A', secondary: '#4A4A4A', inverse: '#FFFFFF' },
      navy:     '#0a1028',
      royal:    '#1c2ca3',
      gold:     '#d4af37',
    },
    letterSpacing: {
      widest2: '0.2em',
      widest3: '0.25em',
    },
  },
},
```

### 2.3 Font Loading (`src/app/layout.tsx`)

```tsx
import { Playfair_Display, Newsreader, Funnel_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-caption",
  display: "swap",
});
```

---

## 3. Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx           ← fonts, metadata, global providers
│   ├── page.tsx             ← root page, composes all sections
│   └── api/
│       ├── chat/route.ts    ← OpenAI proxy for hero AI chat
│       └── contact/route.ts ← Resend email handler
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx  ← full-screen ChatGPT-style hero
│   │   ├── ChatInput.tsx    ← pill-shaped AI input bar
│   │   ├── SuggestionChips.tsx
│   │   └── useHeroScroll.ts ← scroll-trigger hook
│   ├── NavBar.tsx           ← condensed nav (post-scroll state)
│   ├── AboutSection.tsx
│   ├── FeaturesSection.tsx
│   ├── ProductShowcaseSection.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── hooks/
│   └── useScrollTrigger.ts
└── lib/
    └── resend.ts
```

---

## 4. Section 1 — Hero (ChatGPT-style, Full Viewport)

### 4.1 Visual Spec

| Property          | Value                                                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Size              | `100vw × 100vh`, `position: fixed` initially                                                                                                                                            |
| Background        | Hospitality interior photo (hotel lobby, wide-angle), full-bleed, `object-fit: cover`                                                                                                   |
| Overlay           | `linear-gradient(180deg, rgba(10,16,40,0.75) 0%, rgba(10,16,40,0.45) 50%, rgba(10,16,40,0.85) 100%)`                                                                                    |
| Logo              | `APEX MOTUS` — Funnel Sans, 18px, `letter-spacing: 0.2em`, color `#d4af37`, top-left at `padding: 28px 80px`                                                                            |
| Nav links         | `About · Features · Contact` — Funnel Sans, 12px, `letter-spacing: 0.12em`, color `#FFFFFF`, opacity 0.7, top-right                                                                     |
| Main heading      | `"Talk to Your AI Partner"` — Playfair Display, `clamp(40px, 5vw, 72px)`, color `#FFFFFF`, centered                                                                                     |
| Subheading        | Newsreader 18px, `#FFFFFF` opacity 0.65, centered, below heading                                                                                                                        |
| Chat input bar    | Pill shape, `border-radius: 999px`, `background: #F4F2EF`, `width: min(680px, 90vw)`, `height: 60px`, centered                                                                          |
| Input placeholder | `"Ask me anything…"` — Newsreader 16px, `#4A4A4A`                                                                                                                                       |
| Submit button     | Inside input, right side — dark navy circle `48px`, arrow icon `#d4af37`                                                                                                                |
| Suggestion chips  | 3 chips below input, `gap: 12px`, `background: rgba(255,255,255,0.12)`, `border: 1px solid rgba(255,255,255,0.2)`, `border-radius: 999px`, `padding: 8px 20px`, Funnel Sans 11px, white |
| Chip labels       | `"Analyze my data"` · `"Draft a proposal"` · `"Summarize insights"`                                                                                                                     |

### 4.2 Component Implementation

```tsx
// src/components/hero/HeroSection.tsx
"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ChatInput from "./ChatInput";
import SuggestionChips from "./SuggestionChips";
import { useHeroScroll } from "./useHeroScroll";

export default function HeroSection() {
  const { isCollapsed } = useHeroScroll();

  return (
    <motion.section
      className="fixed inset-0 w-full h-screen z-50 overflow-hidden"
      animate={isCollapsed ? "nav" : "hero"}
      variants={{
        hero: { height: "100vh", top: 0 },
        nav: {
          height: "72px",
          top: 0,
          transition: {
            delay: 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-hotel-lobby.jpg"
          fill
          alt=""
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(10,16,40,.75) 0%,rgba(10,16,40,.45) 50%,rgba(10,16,40,.85) 100%)",
          }}
        />
      </div>

      {/* Nav row — always visible */}
      <div className="relative z-10 flex items-center justify-between px-20 pt-7">
        <span className="font-caption text-[18px] tracking-[.2em] font-bold text-gold">
          APEX MOTUS
        </span>
        <nav className="flex gap-10">
          {["About", "Features", "Contact"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-caption text-[12px] tracking-[.12em] text-white/70 hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>
      </div>

      {/* Hero content — fades out on collapse */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-6 -mt-16"
        animate={
          isCollapsed ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }
        }
        transition={{ duration: 0.25 }}
      >
        <h1 className="font-heading text-[clamp(40px,5vw,72px)] text-white text-center leading-tight max-w-3xl">
          Talk to Your AI Partner
        </h1>
        <p className="font-body text-[18px] text-white/65 text-center max-w-xl leading-relaxed">
          Describe your challenge. Let intelligence do the rest.
        </p>
        <ChatInput />
        <SuggestionChips />
      </motion.div>
    </motion.section>
  );
}
```

### 4.3 Scroll Hook

```ts
// src/components/hero/useHeroScroll.ts
"use client";
import { useEffect, useState } from "react";

export function useHeroScroll() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsCollapsed(window.scrollY > 10);
      }, 100); // 100ms delay before triggering
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return { isCollapsed };
}
```

### 4.4 ChatInput Component

```tsx
// src/components/hero/ChatInput.tsx
"use client";
import { useState } from "react";

export default function ChatInput() {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!value.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: { "Content-Type": "application/json" },
    });
    // handle streaming response
  };

  return (
    <div className="flex items-center w-full max-w-[680px] h-[60px] rounded-full bg-[#F4F2EF] px-6 shadow-xl">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Ask me anything…"
        className="flex-1 bg-transparent font-body text-[16px] text-[#4A4A4A] placeholder:text-[#4A4A4A]/50 outline-none"
      />
      <button
        onClick={handleSubmit}
        className="w-12 h-12 rounded-full bg-navy flex items-center justify-center ml-2 flex-shrink-0 hover:bg-royal transition-colors"
      >
        <ArrowRightIcon className="text-gold w-5 h-5" />
      </button>
    </div>
  );
}
```

### 4.5 Suggestion Chips

```tsx
// src/components/hero/SuggestionChips.tsx
const chips = ["Analyze my data", "Draft a proposal", "Summarize insights"];

export default function SuggestionChips() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {chips.map((chip) => (
        <button
          key={chip}
          className="font-caption text-[11px] tracking-[.1em] text-white px-5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
```

### 4.6 Collapsed Nav State

When `isCollapsed = true`, the hero shrinks to `height: 72px`. The nav row (logo + links) remains visible. All hero body content fades to `opacity: 0`. The section becomes `position: sticky top-0` with `backdrop-filter: blur(12px)` + `background: rgba(10,16,40,0.92)` applied.

```tsx
// Additional styles applied when collapsed
style={isCollapsed ? {
  backdropFilter: 'blur(12px)',
  background: 'rgba(10,16,40,0.92)',
  borderBottom: '1px solid rgba(212,175,55,0.2)',
} : {}}
```

### 4.7 Page Layout Offset

Because the hero is `position: fixed`, the page content needs a spacer:

```tsx
// src/app/page.tsx
<>
  <HeroSection />
  <div className="h-screen" /> {/* spacer matching hero height */}
  <main>
    <AboutSection />
    <FeaturesSection />
    <ProductShowcaseSection />
    <ContactSection />
    <Footer />
  </main>
</>
```

---

## 5. Section 2 — About

### 5.1 Visual Spec

| Property           | Value                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Background         | `#F4F2EF`                                                                                                                            |
| Height             | `min-height: 900px`                                                                                                                  |
| Section label      | `"02 / WHAT WE DO"` — Funnel Sans 11px, `letter-spacing: 0.25em`, `#4A4A4A`, `padding-left: 80px`, `padding-top: 64px`               |
| Monumental heading | `"WHAT WE DO"` — Playfair Display, ~180px, `font-weight: 700`, `#1A1A1A`, overflows container both sides (see bleed technique below) |
| Gold accent        | `56px × 2px` rect, `#d4af37`, appears between heading and grid                                                                       |
| Editorial grid     | 3 columns at `padding: 0 80px`, `gap: 56px`                                                                                          |
| Left col           | Label: `"Our Mission"` — Funnel Sans 10px, `letter-spacing: 0.3em`, `#1c2ca3`                                                        |
| Center col         | Body paragraph — Newsreader 17px, `line-height: 1.8`, `#4A4A4A`                                                                      |
| Right col          | `"Learn More →"` link — Funnel Sans 12px, `letter-spacing: 0.15em`, `#0a1028`                                                        |
| Inset photo        | `320px × 280px`, off-center (right-aligned in editorial grid), hospitality interior — lounge seating                                 |

### 5.2 Bleeding Heading Technique

```css
/* The monumental heading bleeds ~50px past each side */
.monumental-heading {
  font-family: var(--font-heading);
  font-size: var(--text-display); /* clamp(120px, 13vw, 190px) */
  font-weight: 700;
  line-height: 1;
  color: var(--fg-primary);
  text-align: center;
  width: calc(100% + 100px); /* 50px overflow each side */
  margin-left: -50px;
  white-space: nowrap;
  overflow: visible; /* parent must NOT clip */
}

/* Parent section must have: overflow: visible */
```

```tsx
// In JSX:
<section className="overflow-visible bg-[#F4F2EF] py-16">
  <h2 className="monumental-heading">WHAT WE DO</h2>
  {/* ... */}
</section>
```

---

## 6. Section 3 — Features

### 6.1 Visual Spec

| Property           | Value                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background         | `#F4F2EF`                                                                                                                                                                                                                                                     |
| Height             | `min-height: 920px`                                                                                                                                                                                                                                           |
| Section label      | `"03 / FEATURES"` — Funnel Sans 11px, `letter-spacing: 0.25em`, `#4A4A4A`                                                                                                                                                                                     |
| Monumental heading | `"FEATURES"` — Playfair Display 190px, overflows ±50px both sides, centered                                                                                                                                                                                   |
| Gold accent rule   | `56px × 2px`, `#d4af37`, below heading                                                                                                                                                                                                                        |
| Column grid        | `padding: 0 80px`, `gap: 56px`, `margin-top: 370px` from section top                                                                                                                                                                                          |
| Per column         | Category label (royal `#1c2ca3`, Funnel Sans 10px, `letter-spacing: 0.3em`) → title (Playfair 26px, `font-weight: 600`, `#1A1A1A`) → body (Newsreader 15px, `line-height: 1.75`, `#4A4A4A`) → `"Explore →"` (Funnel Sans 12px, `letter-spacing: 0.1em`, navy) |

### 6.2 Feature Items

```ts
const features = [
  {
    category: "INTELLIGENCE",
    title: "Adaptive AI Systems",
    body: "Our intelligent models learn from every interaction, continuously refining understanding of your business context and objectives to deliver ever-sharper insight.",
  },
  {
    category: "PRECISION",
    title: "Strategic Data Analysis",
    body: "Transform raw data into decisive clarity. Our analytical frameworks extract meaningful patterns that drive confident, informed decision-making at every level.",
  },
  {
    category: "PARTNERSHIP",
    title: "Human-Centred Consulting",
    body: "We integrate seamlessly with your team, aligning AI capability with your strategic vision and ensuring meaningful adoption across every level of your organisation.",
  },
];
```

### 6.3 Component

```tsx
// src/components/FeaturesSection.tsx
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-visible bg-[#F4F2EF] min-h-[920px] py-16"
    >
      <p className="font-caption text-[11px] tracking-[.25em] text-[#4A4A4A] px-20 pt-4">
        03 / FEATURES
      </p>

      {/* Monumental bleeding heading */}
      <h2
        className="font-heading font-bold text-[clamp(120px,13vw,190px)] leading-none text-[#1A1A1A] text-center
                     w-[calc(100%+100px)] -mx-[50px] mt-6 whitespace-nowrap overflow-visible"
      >
        FEATURES
      </h2>

      {/* Gold accent */}
      <div className="w-14 h-[2px] bg-gold mx-20 mt-6" />

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-14 px-20 mt-12">
        {features.map(({ category, title, body }) => (
          <div key={category} className="flex flex-col gap-[18px]">
            <span className="font-caption text-[10px] tracking-[.3em] text-royal">
              {category}
            </span>
            <h3 className="font-heading text-[26px] font-semibold text-[#1A1A1A] leading-snug">
              {title}
            </h3>
            <p className="font-body text-[15px] text-[#4A4A4A] leading-[1.75]">
              {body}
            </p>
            <a
              href="#"
              className="font-caption text-[12px] tracking-[.1em] text-navy hover:text-royal transition-colors"
            >
              Explore →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 7. Section 4 — Product Showcase

### 7.1 Visual Spec

| Property        | Value                                                                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Size            | `1440 × 820px` (full-width)                                                                                                                                                                                |
| Background      | Hospitality interior photo (`hotel lobby interior`, wide-angle) via `next/image` with `fill`                                                                                                               |
| Overlay         | `linear-gradient(180deg, rgba(10,16,40,0.8) 0%, rgba(10,16,40,0.4) 50%, rgba(10,16,40,0.93) 100%)`                                                                                                         |
| Section label   | `"04 / PRODUCT SHOWCASE"` — Funnel Sans 11px, `letter-spacing: 0.25em`, `#FFFFFF` opacity 0.6, top-left                                                                                                    |
| Editorial quote | Newsreader 20px, `font-weight: 500`, `#FFFFFF`, `line-height: 1.8`, centered, `max-width: 880px`, vertically centered at ~y:240                                                                            |
| Gold divider    | `80px × 1px`, `#d4af37` opacity 0.8, centered, below quote                                                                                                                                                 |
| Stats row       | Centered at y:396 — three metrics `200+` / `98%` / `3×` in Playfair Display 42px, `font-weight: 700`, `#d4af37`; each with a Funnel Sans 11px `letter-spacing: 0.2em` label below in `#FFFFFF` opacity 0.7 |
| Ghost heading   | `"APEX MOTUS"` — Playfair Display 170px, `#FFFFFF` opacity 0.12, overflows ±60px, centered, y:580                                                                                                          |
| CTA button      | `"REQUEST A DEMO"` — `280 × 52px`, `background: #d4af37`, `border-radius: 4px`, Funnel Sans 11px `letter-spacing: 0.25em` `font-weight: 600`, `#0a1028`, centered, y:700                                   |

### 7.2 Component

```tsx
// src/components/ProductShowcaseSection.tsx
export default function ProductShowcaseSection() {
  return (
    <section className="relative w-full h-[820px] overflow-hidden">
      {/* Background */}
      <Image
        src="/images/showcase-hotel-lobby.jpg"
        fill
        alt=""
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(10,16,40,.8) 0%,rgba(10,16,40,.4) 50%,rgba(10,16,40,.93) 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6 px-6">
        {/* Section label (absolute top-left) */}
        <p className="absolute top-16 left-20 font-caption text-[11px] tracking-[.25em] text-white/60">
          04 / PRODUCT SHOWCASE
        </p>

        {/* Quote */}
        <p className="font-body text-[20px] font-medium text-white leading-[1.8] text-center max-w-[880px]">
          A new intelligence layer for your enterprise — where every decision is
          informed, every strategy sharpened, and every outcome elevated by the
          power of AI.
        </p>

        {/* Gold divider */}
        <div className="w-20 h-px bg-gold/80" />

        {/* Stats */}
        <div className="flex gap-32 mt-2">
          {[
            { value: "200+", label: "Enterprise Clients" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "3×", label: "Avg. ROI Uplift" },
          ].map(({ value, label }) => (
            <div key={value} className="flex flex-col items-center gap-2">
              <span className="font-heading text-[42px] font-bold text-gold">
                {value}
              </span>
              <span className="font-caption text-[11px] tracking-[.2em] text-white/70">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="mt-8 inline-flex items-center justify-center w-[280px] h-[52px]
                     bg-gold text-navy font-caption text-[11px] tracking-[.25em] font-semibold
                     rounded-[4px] hover:bg-yellow-400 transition-colors"
        >
          REQUEST A DEMO
        </a>
      </div>

      {/* Ghost brand mark */}
      <span
        className="absolute bottom-4 left-1/2 -translate-x-1/2 font-heading text-[170px]
                       font-bold text-white/[.12] leading-none whitespace-nowrap pointer-events-none
                       w-[calc(100%+120px)] text-center -ml-[60px]"
      >
        APEX MOTUS
      </span>
    </section>
  );
}
```

---

## 8. Section 5 — Contact

### 8.1 Visual Spec

| Property           | Value                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Background         | `#F4F2EF`                                                                                                                                                                |
| Height             | `min-height: 720px`                                                                                                                                                      |
| Section label      | `"05 / CONTACT"` — Funnel Sans 11px, `letter-spacing: 0.25em`, `#4A4A4A`                                                                                                 |
| Monumental heading | `"LET'S TALK"` — Playfair Display 185px, overflows ±60px both sides                                                                                                      |
| Gold accent        | `56px × 2px`, `#d4af37`                                                                                                                                                  |
| Layout             | 2-column grid at `padding: 0 80px`, `gap: 80px`                                                                                                                          |
| Left column        | Category label `"START A CONVERSATION"` (Funnel Sans 10px, `letter-spacing: 0.3em`, `#1c2ca3`), body paragraph (Newsreader 17px), email address (Funnel Sans 13px, navy) |
| Right column       | Form with label-above-field pattern, bottom-border-only fields (no box), submit button                                                                                   |
| Field labels       | Funnel Sans 10px, `letter-spacing: 0.2em`, `#4A4A4A`, uppercase                                                                                                          |
| Fields             | `height: 48px`, `background: #FFFFFF`, `border-bottom: 2px solid #1A1A1A`, no other border, Newsreader 15px                                                              |
| Submit button      | `220 × 52px`, `background: #0a1028`, `border-radius: 4px`, Funnel Sans 11px `letter-spacing: 0.25em`, `font-weight: 600`, `#d4af37` text                                 |

### 8.2 Component

```tsx
// src/components/ContactSection.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
});
type FormData = z.infer<typeof schema>;

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <section
      id="contact"
      className="overflow-visible bg-[#F4F2EF] min-h-[720px] py-16"
    >
      <p className="font-caption text-[11px] tracking-[.25em] text-[#4A4A4A] px-20 pt-4">
        05 / CONTACT
      </p>

      {/* Monumental heading */}
      <h2
        className="font-heading font-bold text-[clamp(100px,13vw,185px)] leading-none text-[#1A1A1A] text-center
                     w-[calc(100%+120px)] -mx-[60px] mt-6 whitespace-nowrap overflow-visible"
      >
        LET&apos;S TALK
      </h2>

      <div className="w-14 h-[2px] bg-gold mx-20 mt-6" />

      {/* 2-column layout */}
      <div className="grid grid-cols-2 gap-20 px-20 mt-12">
        {/* Left — copy */}
        <div className="flex flex-col gap-5">
          <span className="font-caption text-[10px] tracking-[.3em] text-royal">
            START A CONVERSATION
          </span>
          <p className="font-body text-[17px] text-[#4A4A4A] leading-[1.8]">
            Whether you are exploring AI for the first time or scaling an
            existing programme, we align technology with your ambitions.
          </p>
          <a
            href="mailto:apex.motus.inc@gmail.com"
            className="font-caption text-[13px] tracking-[.1em] text-navy hover:text-royal transition-colors"
          >
            apex.motus.inc@gmail.com
          </a>
        </div>

        {/* Right — form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-[.2em] text-[#4A4A4A] uppercase">
              Your Name
            </label>
            <input
              {...register("name")}
              placeholder="Full name"
              className="h-12 bg-white border-b-2 border-[#1A1A1A] font-body text-[15px] text-[#1A1A1A] placeholder:text-[#4A4A4A]/40 px-0 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-[.2em] text-[#4A4A4A] uppercase">
              Your Email
            </label>
            <input
              {...register("email")}
              placeholder="email@company.com"
              className="h-12 bg-white border-b-2 border-[#1A1A1A] font-body text-[15px] text-[#1A1A1A] placeholder:text-[#4A4A4A]/40 px-0 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-[220px] h-[52px] bg-navy text-gold font-caption text-[11px] tracking-[.25em] font-semibold rounded-[4px] hover:bg-royal transition-colors disabled:opacity-60"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </section>
  );
}
```

### 8.3 Contact API Route Handler

```ts
// src/app/api/contact/route.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email } = await req.json();
  await resend.emails.send({
    from: "contact@apexmotus.com",
    to: "apex.motus.inc@gmail.com",
    subject: `New enquiry from ${name}`,
    html: `<p><strong>${name}</strong> (${email}) sent an enquiry via the website.</p>`,
  });
  return Response.json({ ok: true });
}
```

---

## 9. Footer

### 9.1 Visual Spec

| Property          | Value                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Background        | `#0a1028` (navy)                                                                                                                      |
| Height            | `300px`                                                                                                                               |
| Top accent line   | `1px`, `#d4af37` opacity 0.3, full-width at top of footer                                                                             |
| Brand mark        | `"APEX MOTUS"` — Funnel Sans 18px, `letter-spacing: 0.2em`, `font-weight: 700`, `#d4af37`, `padding-left: 80px`, `padding-top: 60px`  |
| Tagline           | `"AI Consulting & Strategic Intelligence"` — Newsreader 14px, `#FFFFFF` opacity 0.5, below brand                                      |
| Nav links row     | `padding-left: 80px`, `padding-top: 40px`, `gap: 48px` — Funnel Sans 12px, `letter-spacing: 0.15em`, `#FFFFFF` opacity 0.6, hover 1.0 |
| Royal accent glow | Radial gradient, `80 × 80px`, `#1c2ca3` → transparent, top-right at `padding-right: 80px`                                             |
| Divider           | `1px`, `rgba(255,255,255,0.1)`, `margin: 0 80px`                                                                                      |
| Copyright         | Funnel Sans 11px, `letter-spacing: 0.1em`, `#FFFFFF` opacity 0.35, bottom-left                                                        |
| Privacy · Terms   | Same style, bottom-right                                                                                                              |

### 9.2 Component

```tsx
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="relative w-full h-[300px] bg-navy overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold/30" />

      {/* Royal glow accent */}
      <div
        className="absolute top-15 right-20 w-20 h-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,44,163,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="px-20 pt-[60px]">
        <p className="font-caption text-[18px] tracking-[.2em] font-bold text-gold">
          APEX MOTUS
        </p>
        <p className="font-body text-[14px] text-white/50 mt-2">
          AI Consulting & Strategic Intelligence
        </p>

        <nav className="flex gap-12 mt-10">
          {["About", "Features", "Case Studies", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="font-caption text-[12px] tracking-[.15em] text-white/60 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-20 h-px bg-white/10" />
        <div className="flex justify-between px-20 py-4">
          <span className="font-caption text-[11px] tracking-[.1em] text-white/35">
            © 2026 Apex Motus. All rights reserved.
          </span>
          <span className="font-caption text-[11px] tracking-[.1em] text-white/35">
            Privacy · Terms
          </span>
        </div>
      </div>
    </footer>
  );
}
```

---

## 10. Animation & Interaction Summary

| Interaction            | Mechanism                                               | Duration | Easing                                 |
| ---------------------- | ------------------------------------------------------- | -------- | -------------------------------------- |
| Hero → Nav collapse    | Framer Motion `animate` variants on `height`            | `400ms`  | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| Collapse trigger delay | `setTimeout` in scroll handler                          | `100ms`  | —                                      |
| Hero content fade out  | Framer Motion `opacity: 0`                              | `250ms`  | `ease-out`                             |
| Nav blur background    | CSS `backdrop-filter: blur(12px)`                       | instant  | —                                      |
| Section entry fade     | Framer Motion `whileInView`, `initial:{opacity:0,y:30}` | `600ms`  | `ease-out`                             |
| Hover states           | Tailwind `transition-colors`                            | `150ms`  | —                                      |
| CTA button hover       | `hover:bg-yellow-400` (gold lightens)                   | `150ms`  | —                                      |

---

## 11. Image Assets Required

Source from Unsplash. Download and place in `public/images/`:

| File                       | Search query                             | Usage                               |
| -------------------------- | ---------------------------------------- | ----------------------------------- |
| `hero-hotel-lobby.jpg`     | `"hotel lobby interior wide angle"`      | Hero section full-bleed background  |
| `showcase-hotel-lobby.jpg` | `"boutique hotel lounge architectural"`  | Product showcase background         |
| `about-lounge.jpg`         | `"restaurant interior design editorial"` | About section inset editorial photo |

All images: minimum `2880 × 1800px`, RGB, compressed for web (< 400 KB with Next.js auto-optimization).

---

## 12. Environment Variables

Create `.env.local`:

```bash
# OpenAI — hero AI chat
OPENAI_API_KEY=sk-...

# Resend — contact form emails
RESEND_API_KEY=re_...

# Vercel (set via dashboard, not file)
NEXT_PUBLIC_SITE_URL=https://apexmotus.com
```

---

## 13. Implementation Checklist

```
[ ] 1. npx create-next-app@latest apex-motus --ts --tailwind --app
[ ] 2. Install: framer-motion react-hook-form @hookform/resolvers zod resend
[ ] 3. Configure tailwind.config.ts with brand tokens
[ ] 4. Add CSS custom properties to globals.css
[ ] 5. Set up Google Fonts in layout.tsx
[ ] 6. Download and place 3 hero/showcase/about images in public/images/
[ ] 7. Build HeroSection + useHeroScroll hook
[ ] 8. Build ChatInput + SuggestionChips
[ ] 9. Build NavBar collapsed state (part of HeroSection)
[ ] 10. Build AboutSection with bleeding heading + 3-column editorial grid
[ ] 11. Build FeaturesSection with monumental heading + 3-column feature grid
[ ] 12. Build ProductShowcaseSection with photo + stats + CTA
[ ] 13. Build ContactSection with 2-column layout + form
[ ] 14. Build Footer
[ ] 15. Implement /api/chat route (OpenAI proxy)
[ ] 16. Implement /api/contact route (Resend)
[ ] 17. Add Framer Motion section entry animations (whileInView)
[ ] 18. Test scroll hero→nav transition on mobile
[ ] 19. Verify typography rendering (Playfair Display at 190px on all browsers)
[ ] 20. Deploy to Vercel, set environment variables
```

---

_Spec generated from Pencil design nodes `wQ1Mq` + `BnH79` — Apex Motus landing page, Monumental Editorial style, April 2026._
