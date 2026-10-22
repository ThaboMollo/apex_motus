/**
 * Single source of truth for site copy, navigation and routes.
 * Later phases extend this data rather than editing markup.
 *
 * Copy status key:
 *  - "brief"    : supplied verbatim in the Prompt 01 brief
 *  - "brand"    : taken from the approved brand boards
 *  - "verified" : confirmed against the live site / company material
 *  - "draft"    : written for this build — awaiting client approval
 */

export const SITE = {
  name: "Apex Motus",
  url: "https://apexmotus.co.za",
  tagline: "Turning ambition into motion.",
  description:
    "Apex Motus is a South African business transformation and execution partner. We help growing businesses overcome operational complexity through strategic redesign, intelligent systems and hands-on implementation.",
  /** Only contact detail published on the current apexmotus.co.za (verified). */
  email: "products@apexmotus.co.za",
  /** Where "Discuss your challenge" enquiries are delivered. */
  enquiryEmail: "products@apexmotus.co.za",
} as const;

const mail = (to: string, subject: string, body?: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

/*
 * Pre-populated enquiry the visitor completes in their own mail client.
 * Labelled blank lines so an enquiry arrives qualified rather than as "hi".
 * Kept well inside the ~2000-character ceiling some mail clients put on a
 * mailto URL — anything longer risks being silently truncated.
 */
const ENQUIRY_TEMPLATE = [
  "Hi Apex Motus,",
  "",
  "I would like to discuss a challenge in my business.",
  "",
  "Name:",
  "Company:",
  "Role:",
  "Phone:",
  "",
  "The challenge we are facing:",
  "",
  "",
  "What we have already tried:",
  "",
  "",
  "What a good outcome looks like:",
  "",
  "",
  "Thanks,",
].join("\n");

export const CONTACT_HREF = mail(
  SITE.enquiryEmail,
  "Discuss a challenge — apexmotus.co.za",
  ENQUIRY_TEMPLATE,
);
export const WALKTHROUGH_HREF = mail(SITE.email, "Product walkthrough request");

/* ---------------------------------------------------------------- Routes */

export type RouteStatus = "live" | "planned";

export const NAV = [
  { label: "Solutions", href: "/#solutions", status: "live" as RouteStatus },
  { label: "Our Approach", href: "/#approach", status: "live" as RouteStatus },
  { label: "Products", href: "/#products", status: "live" as RouteStatus },
  { label: "Our Work", href: "/#work", status: "live" as RouteStatus },
  { label: "About", href: "/#about", status: "live" as RouteStatus },
  { label: "Contact", href: "/#contact", status: "live" as RouteStatus },
] as const;

/* Dedicated pages planned for later prompts. Rendered via <PlannedPage/>. */
export const PLANNED_ROUTES = {
  solutions: {
    title: "Solutions",
    summary:
      "A full overview of how Apex Motus approaches systems, process, data and enablement work.",
  },
  approach: {
    title: "Our Approach",
    summary:
      "The Diagnose → Engineer → Accelerate method in detail, with how engagements are structured.",
  },
  products: {
    title: "Products",
    summary: "The Apex Motus technology portfolio, with a dedicated page per product.",
  },
  work: {
    title: "Our Work",
    summary:
      "Case studies and implementation examples, published once client permission and verified outcomes are in place.",
  },
  about: {
    title: "About",
    summary: "The company, its thinking, and the people behind it.",
  },
  contact: {
    title: "Contact",
    summary: "A structured way to describe your challenge and start a conversation.",
  },
} as const;

/* -------------------------------------------------------------- Homepage */

export const HERO = {
  eyebrow: "Real systems. Measurable progress.", // brand
  headline: "Turning ambition into motion", // client-directed tagline (full stop is the lime square)
  body: "We help growing businesses overcome operational complexity through strategic redesign, intelligent systems and hands-on implementation.", // brief
  primary: "Discuss your challenge",
  secondary: "Explore our approach",
  rail: ["Systems", "Tools", "Infrastructure", "Data", "Automation", "Performance"], // brand
} as const;

export const PROBLEM = {
  headline: "Ambition is easy. Operational progress is hard.", // brief
  body: "Businesses rarely struggle because they lack ambition. Problems emerge when processes, systems, responsibilities and information can no longer support the organisation’s growth.", // brief (supporting idea)
  challenges: [
    {
      title: "Disconnected systems",
      text: "Tools that don’t talk to each other, so people become the integration.",
    },
    {
      title: "Inefficient workflows",
      text: "Work moves through hand-offs, rework and workarounds nobody designed.",
    },
    {
      title: "Unclear accountability",
      text: "Roles overlap, decisions stall, and no one clearly owns the outcome.",
    },
    {
      title: "Limited operational visibility",
      text: "Leaders decide on instinct because the numbers arrive late, or not at all.",
    },
    {
      title: "Slow implementation",
      text: "Good strategy loses momentum in the gap between the plan and the rollout.",
    },
    {
      title: "Excessive manual administration",
      text: "Skilled people spend their days re-keying, chasing and reconciling.",
    },
  ],
} as const; // challenge titles: brief · descriptions: draft

export const SOLUTIONS = {
  headline: "We turn complexity into capability.", // brief
  intro:
    "Four pathways, each starting from a problem you will recognise rather than a service you have to decode.", // draft
  note: "Proposed marketing architecture — confirm against company materials before final.",
  pathways: [
    {
      slug: "systems-platforms",
      title: "Systems & Platforms",
      description:
        "Design and build fit-for-purpose systems that fit how your business actually runs, and scale with it.", // brand mockup
      recognisable: "Your teams run on spreadsheets, inboxes and tools that don’t connect.",
    },
    {
      slug: "process-engineering",
      title: "Process Engineering",
      description:
        "Streamline operations for clarity and efficiency: who does what, in which order, with which hand-offs.", // brand mockup
      recognisable: "Growth has outpaced the way work gets done, and everything depends on key people.",
    },
    {
      slug: "data-automation",
      title: "Data & Automation",
      description:
        "Turn data into momentum with intelligent tooling that removes repetitive work and shows what is really happening.", // brand mockup
      recognisable: "Reports are late, manual and argued over, and admin eats skilled time.",
    },
    {
      slug: "operational-enablement",
      title: "Operational Enablement",
      description:
        "Equip teams and infrastructure for sustained progress: adoption, ownership and measures that stick.", // brand mockup
      recognisable: "New systems get launched, then quietly abandoned.",
    },
  ],
} as const;

export const METHOD = {
  headline: "From diagnosis to delivery.", // brief
  intro: "Three stages, each handing a clear result to the next.", // draft
  stages: [
    {
      n: "01",
      name: "Diagnose",
      summary: "Understand the business, identify constraints and establish priorities.", // brief
      points: [
        "Map how work really flows, not how it is meant to",
        "Surface the constraints and dependencies holding progress back",
        "Agree priorities and how progress will be measured",
      ],
      outcome: "A shared, evidence-based picture of what to fix first.",
    },
    {
      n: "02",
      name: "Engineer",
      summary: "Redesign processes, develop systems and implement practical solutions.", // brief
      points: [
        "Redesign processes, roles and hand-offs",
        "Build or configure the systems that carry them",
        "Implement alongside your team, not around them",
      ],
      outcome: "Working structures and systems, in use.",
    },
    {
      n: "03",
      name: "Accelerate",
      summary: "Support adoption, monitor performance and continuously improve.", // brief
      points: [
        "Support teams through adoption",
        "Monitor performance against the agreed measures",
        "Improve continuously so progress compounds",
      ],
      outcome: "Progress that holds, and builds.",
    },
  ],
} as const; // stage names + summaries: brief · bullets/outcomes: draft

export type Product = {
  slug: string;
  name: string;
  category: string;
  positioning: string;
  detail?: string;
  published: boolean;
};

export const PRODUCTS: { headline: string; intro: string; items: Product[] } = {
  headline: "Software built to run operations.",
  intro:
    "We build our own software alongside our advisory work: practical products for real operational problems.",
  items: [
    {
      // Renamed from ClinicOS; the live apexmotus.co.za listing still says ClinicOS.
      slug: "babyblue",
      name: "BabyBlue",
      category: "Healthcare operations",
      // verified: current apexmotus.co.za product listing
      positioning:
        "Streamline patient flow, bookings, and clinic operations with a unified system.",
      // verified: BabyBlue (then ClinicOS) MVP build spec (Nental, July 2026)
      detail: "Scheduling, patient records and billing in one system.",
      published: true,
    },
    {
      slug: "scanya",
      name: "ScanYa",
      category: "Asset management",
      // verified: current apexmotus.co.za product listing
      positioning: "Scan, access, and manage assets instantly using QR-powered workflows.",
      published: true,
    },
    {
      // On the live site but absent from the Prompt 01 brief — awaiting decision.
      slug: "tseboiq",
      name: "tseboIQ",
      category: "Talent intelligence",
      positioning:
        "Unlock talent intelligence and make smarter hiring and workforce decisions.",
      published: false,
    },
  ],
};

export const PROOF = {
  headline: "Evidence you can inspect.",
  intro:
    "We would rather show you how we work than tell you how good we are.",
  items: [
    {
      label: "Working software",
      text: "BabyBlue and ScanYa are products we designed and built ourselves. Ask for a walkthrough and judge the work directly.",
    },
    {
      label: "A defined method",
      text: "Diagnose, Engineer, Accelerate: a repeatable sequence with a clear result at every stage, so you always know where an engagement stands.",
    },
    {
      label: "Hands-on delivery",
      text: "We stay for implementation. Redesign on paper is the easy part; getting it into daily use is the work.",
    },
  ],
  pending: "Case studies, measured outcomes and client voices are published here as they are approved.",
  cta: "Request a product walkthrough",
} as const; // draft — contains no statistics, client names or outcomes

export const PHILOSOPHY = {
  label: "Our purpose",
  purpose: "Make progress operational", // brand purpose statement (full stop is the lime square)
  intro: "We build the systems, tools and infrastructure that turn ambition into motion.", // brand
  pillars: [
    {
      n: "01",
      word: "progress",
      line: "From ambition to impact.",
      body: "We turn complex goals into measurable progress through clarity, focus and momentum.",
      practice: "Define the right outcomes, align teams, and track what moves the needle.",
      level: 0.34,
    },
    {
      n: "02",
      word: "engineering",
      line: "Built for what’s next.",
      body: "We design and build the systems, tools and infrastructure that make progress repeatable, scalable and resilient.",
      practice:
        "Create integrated platforms, automation and data foundations that reduce friction and increase capacity.",
      level: 0.67,
    },
    {
      n: "03",
      word: "the apex",
      line: "A more operational future.",
      body: "We pursue a higher standard, where people, technology and systems work in unison to unlock greater possibility.",
      practice: "Transform ambition into a sustainable operating advantage for long-term impact.",
      level: 1,
    },
  ],
} as const; // pillar copy: brand (Pillars & Messaging board)

export const FINAL = {
  headline: "Ready to make progress operational?", // brief
  body: "Tell us what’s holding your business back. We’ll help you explore a practical way forward.", // brief
  primary: "Discuss your challenge",
  secondary: "Explore our solutions",
} as const;

export const FOOTER = {
  signoff: "Turning ambition into motion",
  description:
    "A South African business transformation, operations and technology company. We make progress operational.",
  legal: ["Privacy policy", "Terms"], // pages do not exist yet — rendered as text, not links
  rail: ["Progress", "Engineering", "The Apex"],
} as const;
