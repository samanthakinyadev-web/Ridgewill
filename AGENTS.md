# Kilo Agent Instructions

## Commands

### Development

```bash
npm start       # start Vite dev server at http://localhost:5173
npm run dev     # alias for start
npm run build   # production build
npm run lint    # run oxlint
npm run typecheck # run TypeScript type checking
npm run preview # preview the built site
```

## Project Structure

- `src/content/` — Data/content files (company info, CEO, services, portfolio)
- `src/styles/` — CSS (tokens, global, components)
- `src/components/` — Reusable React components (Header, Footer, ServiceCard, etc.)
- `src/pages/` — Page-level components (Home, Service, Portfolio, Contact, NotFound)
- `public/` — Static assets (logo, favicon, portfolio images, sitemap, robots)

## Content Editing

To add a new service, edit `src/content/services.ts`.
To add a portfolio entry, edit `src/content/portfolio.ts` and add an image to `public/portfolio/`.
To update company contact info, edit `src/content/company.ts`.
To update CEO info, edit `src/content/ceo.ts`.
