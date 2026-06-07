# Apex Motus — Corporate Holding Company

A production-grade Next.js 14 application built with Material Tailwind, deployed on Netlify with serverless route handlers for contact email and AI diagnostics.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material Tailwind React
- **Fonts**: Space Grotesk (headings), Inter (body)
- **Deployment**: Netlify + Next.js runtime
- **Form Handling**: EmailJS (server-side REST API)
- **AI**: OpenAI Responses API

## 🎨 Brand Colors

- **Navy**: `#0a1028` - Deep night navy (trust, dominance)
- **Royal Blue**: `#1c2ca3` - Royal blue
- **Gold**: `#d4af37` - Royal accent
- **Tech Cyan**: `#22d3ee` - Technology accent
- **Silver**: `#c5c6ca` - Muted elements

## 📦 Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn start
```

## 🚀 Deployment

### Netlify Setup

1. Connect your repository to Netlify
2. Configure build settings:
   - **Build command**: `yarn build`
   - **Publish directory**: `.next`
3. Add the environment variables listed below
4. Deploy!

### Contact Form

The contact form posts to `/api/contact`, which validates the payload and sends email through the EmailJS REST API.

To test the form locally:
1. Add `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, and `EMAILJS_PRIVATE_KEY` to `.env.local`
2. In the EmailJS dashboard, enable **Account → Security → "Allow EmailJS API for non-browser applications"** (required for server-side calls)
3. Run `yarn dev`
4. Submit either contact form

The recipient ("To Email") and "Reply To" addresses are configured in the EmailJS template settings (e.g. set Reply To to `{{email_address}}`), not in code.

## 📁 Project Structure

```
apex-motus/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js 14 App Router
│   │   ├── layout.tsx  # Root layout
│   │   ├── page.tsx    # Home page
│   │   ├── portfolio/
│   │   ├── services/
│   │   ├── subsidiary-tseboiq/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   └── components/     # Reusable components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── SectionCard.tsx
│       └── ContactForm.tsx
├── tailwind.config.js
├── next.config.js
└── netlify.toml
```

## 🎯 Features

- ✅ Next.js App Router site
- ✅ SEO optimized with metadata
- ✅ Responsive design (mobile-first)
- ✅ Dark theme by default with theme toggle
- ✅ Material Tailwind components
- ✅ EmailJS contact email delivery
- ✅ OpenAI-powered hero diagnostic
- ✅ TypeScript for type safety
- ✅ Optimized fonts (Google Fonts)
- ✅ Accessibility compliant

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SITE_URL=https://www.apexmotus.com

OPEN_AI_API=sk-...
OPENAI_MODEL=gpt-5.4-mini

EMAILJS_SERVICE_ID=service_...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
EMAILJS_TEMPLATE_ID=template_...              # contact form
EMAILJS_DIAGNOSTIC_TEMPLATE_ID=template_...   # hero diagnostic
```

### Theme Customization

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## 📝 License

© 2024 Apex Motus. All rights reserved.
