# Apex Motus — website

Next.js (App Router) · TypeScript · Tailwind v4 · Radix Dialog · Lucide. Light-mode, brand-led rebuild of apexmotus.co.za.
Prompt 01 delivers the design system and the homepage. See [docs/redesign/PLAN.md](docs/redesign/PLAN.md) for decisions and open items.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

Node 20+. The pages need no environment variables; the two carried-over API routes do — copy
`.env.local.example` to `.env.local` and fill it in before exercising them. `.env*` is git-ignored
apart from the committed templates; document any new variable in `.env.local.example`.

## Structure

```
src/
  app/                 routes, global CSS (design tokens live in @theme), metadata
  app/api/             carried over from the previous site, no caller in this UI yet:
                       contact/ (EmailJS delivery), diagnostic/ (OpenAI/Gemini audit)
  components/
    brand/             Logo (approved artwork only), Period (the lime full stop)
    layout/            Header, MobileMenu, Footer, Container, SectionLabel
    ui/                Button, ArrowLink, Reveal (scroll reveal), PlannedPage
    home/              one component per homepage section + graphics
    seo/               JsonLd (Organization + WebSite structured data)
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

This app is the repository root (framework Next.js, no Root Directory override). Preview deployments come from branch pushes; production only from `main`.

## SEO

Everything resolves against `SITE.url` (`https://apexmotus.co.za`, no `www`) via `metadataBase`:
canonical, `og:url`, `og:image`, `twitter:image`, `robots.txt` and the sitemap. Change that one
constant in `src/content/site.ts` and the whole site follows.

- `robots.ts` allows all crawlers and publishes `/sitemap.xml`; `sitemap.ts` lists `/` only.
- `src/components/seo/JsonLd.tsx` emits Organization + WebSite JSON-LD with stable `@id`s, so later
  schema (products, breadcrumbs, articles) can reference those nodes instead of repeating them.
- The homepage sets `alternates.canonical`. The `PlannedPage` holding routes are `noindex, follow`
  and deliberately carry **no** canonical — Google treats noindex + canonical as conflicting.
  When a holding page gains real content: add it to `sitemap.ts`, drop its `robots` override and
  give it a canonical, in the same change.

## Contact

`CONTACT_HREF` in `src/content/site.ts` powers every "Discuss your challenge" button (header,
mobile menu, hero, final CTA, holding pages). It is a `mailto:` to `SITE.enquiryEmail`
(`products@apexmotus.co.za`) carrying a pre-populated, labelled enquiry the visitor completes in
their own mail client. Keep the template short — some mail clients truncate a `mailto:` URL past
roughly 2000 characters.
