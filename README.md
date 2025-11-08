# Apex Motus — Corporate Holding Company

A production-grade Next.js 14 application built with Material Tailwind, designed for static deployment on Netlify.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material Tailwind React
- **Fonts**: Space Grotesk (headings), Inter (body)
- **Deployment**: Netlify (Static Export)
- **Form Handling**: Netlify Forms

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
   - **Publish directory**: `out`
3. Enable Netlify Forms in your site settings
4. Deploy!

### Contact Form

The contact form is configured to work with Netlify Forms automatically. No backend required.

To test the form locally:
1. Build the site: `yarn build`
2. Serve the `out` directory with a static server
3. Submit the form - it will be captured by Netlify on deployment

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

- ✅ Fully static site (SSG)
- ✅ SEO optimized with metadata
- ✅ Responsive design (mobile-first)
- ✅ Dark theme by default with theme toggle
- ✅ Material Tailwind components
- ✅ Netlify Forms integration
- ✅ TypeScript for type safety
- ✅ Optimized fonts (Google Fonts)
- ✅ Accessibility compliant

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any environment variables here
```

### Theme Customization

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## 📝 License

© 2024 Apex Motus. All rights reserved.
