# Ridgewill Global Logistics

A fast, professional, mobile-first marketing website for Ridgewill Global Logistics — a freight forwarding and supply chain company connecting Africa to Europe, the Middle East, Asia and beyond.

## Tech Stack

- **React** 19 + **Vite** (TypeScript)
- **React Router** v6 (clean URLs, client-side routing)
- **Plain CSS** with design tokens (no Tailwind)
- **react-helmet-async** for per-page SEO

## Development

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server at http://localhost:5173
npm run build      # production build
npm run lint       # run oxlint
npm run typecheck  # run TypeScript type checking
npm run preview    # preview the built site
```

## Project Structure

```
src/
  assets/          # Static assets
  content/         # Data/content files (editable by site owner)
    company.ts     # Contact info, social links, working hours
    ceo.ts         # CEO name, photo, title, message
    services.ts    # Six service entries with intro, highlights, ideal-for
    portfolio.ts   # Portfolio project entries
  styles/
    tokens.css     # Design tokens (CSS variables for colors, spacing, etc.)
    global.css     # Global resets and base typography
    components.css # All component-specific styles
  components/
    Header.tsx       # Sticky header with dropdown nav + mobile hamburger
    Footer.tsx       # Deep-brown footer with contact info
    ServiceCard.tsx  # Service card (reusable)
    PortfolioCard.tsx # Portfolio card with image placeholder
    ContactForm.tsx  # Contact form with Quotation/Inquiry toggle
    ThemeToggle.tsx  # Dark/light mode toggle
    Seo.tsx          # Per-page SEO with Helmet
  pages/
    Home.tsx         # Hero, About, Why Ridgewill, CEO, Contacts
    Service.tsx      # Service detail page (data-driven template)
    Portfolio.tsx    # Portfolio grid with category filter + lightbox
    Contact.tsx      # Contact page with side cards
    NotFound.tsx     # 404 page
  App.tsx            # Route definitions
  main.tsx           # Entry point (BrowserRouter + HelmetProvider)

public/
  logo.svg         # Brand logo (SVG)
  favicon.svg      # Site favicon
  portfolio/       # Portfolio images
  sitemap.xml      # SEO sitemap
  robots.txt       # SEO robots
```

## Content Editing

All content is stored in `src/content/` as TypeScript modules:

- **Add a service**: Edit `src/content/services.ts`
- **Add a portfolio entry**: Edit `src/content/portfolio.ts` and add an image to `public/portfolio/`
- **Update contact info**: Edit `src/content/company.ts`
- **Update CEO info**: Edit `src/content/ceo.ts`

## Deployment

Deploy to Vercel or Netlify. The build output is in `dist/`.
