# Apex Motus — website

Next.js (App Router) · TypeScript · Tailwind v4 · Radix Dialog · Lucide. Light-mode, brand-led rebuild of apexmotus.co.za.
Prompt 01 delivers the design system and the homepage. See [docs/PLAN.md](docs/PLAN.md) for decisions and open items.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

Node 20+. No environment variables are required yet. `.env*` is git-ignored; document any future variable in `.env.example`.

## Structure

```
src/
  app/                 routes, global CSS (design tokens live in @theme), metadata
  components/
    brand/             Logo (approved artwork only), Period (the lime full stop)
    layout/            Header, MobileMenu, Footer, Container, SectionLabel
    ui/                Button, ArrowLink, Reveal (scroll reveal), PlannedPage
    home/              one component per homepage section + graphics
  content/site.ts      all copy, nav, products, routes — extend data, not markup
public/brand/          transparent logo PNGs (see below)
scripts/prepare-logos.py
```

## Design system (in `src/app/globals.css`)

| Token | Value | Rule |
|---|---|---|
| paper | `#F5F5ED` | canvas, ~60% |
| ink | `#0B0B0B` | text + structure, ~25% |
| grey | `#C6C6C6` | rules + surfaces, ~10% — never body text |
| lime | `#E6FF19` | signal, ~5% — fills with ink text, never text on paper |

Manrope (display) · Inter (UI/body) · IBM Plex Mono (labels, indices). The signature lime full stop is `<Period />`.

## Logos

`public/brand/*.png` are the approved artwork converted to transparency by `scripts/prepare-logos.py`
(luminance → alpha, cropped, upscaled, exact brand fill). Geometry is untouched; **never re-set the logo in a font**.
Swap in vector masters (SVG) when supplied.

## Routes

Live: `/`. Planned (holding pages, honestly marked): `/solutions`, `/solutions/[slug]`, `/approach`, `/products`, `/products/[slug]`, `/work`, `/about`, `/contact`.
Navigation currently points at homepage sections (`/#solutions` …).

## Workflow

| Branch | Purpose |
|---|---|
| `dev` | active work; every push can be previewed |
| `staging` | stakeholder review (merge from `dev`) |
| `main` | production (merge from `staging`, explicit approval only) |

Vercel: set **Root Directory = `05_Dev`**, framework Next.js. Preview deployments come from branch pushes; production only from `main`.
The review build is `noindex` (`robots.ts` + metadata) — remove both at launch. The existing `apexmotus.co.za` is untouched.
