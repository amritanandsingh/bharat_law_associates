# Bharat Law Associates — Website

Mobile-first, multilingual marketing site for Bharat Law Associates (React 18 + Create React App).

## Features

- Multi-page via `react-router-dom` v6: Home, About, Practice Areas (19 services in 4 categories with detail pages), Contact (Connect + Schedule a Consultation forms), Join Us, 404
- Forms submit via prefilled **WhatsApp** deep link with **mailto/tel fallbacks** (no backend)
- Sticky mobile action bar (Call / WhatsApp / Consult), callback-request modal, desktop WhatsApp FAB
- **23 languages**: English + all 22 scheduled Indian languages (`react-i18next`, lazy-loaded per-locale chunks, RTL support for Urdu/Kashmiri/Sindhi, on-demand fonts for Ol Chiki / Meetei Mayek / Nastaliq)
- Custom "Pillar & Scales" SVG logo + design-token CSS system (no UI framework)

## Where things live

- **Firm details (phones, WhatsApp, addresses, emails)** → `src/config/site.js` — *all values are placeholders; replace before go-live* (a console warning fires in dev while any remain)
- Services catalog (ids, categories, icons) → `src/data/services.js`; display text → `src/locales/<lng>/services.json`
- All UI copy → `src/locales/<lng>/common.json` (`en/` is the source of truth)

## Scripts

- `npm start` / `npm run build` — CRA dev server / production build
- `npm run i18n:check` — fails if any locale's keys drift from `en/` (missing keys, orphans, broken `{{placeholders}}`, wrong array lengths)
- `npm run i18n:fill` — English-fills missing keys in every locale and writes a `missing-translations.json` worklist

## Deployment note

This is an SPA — the production host must rewrite unknown paths to `index.html`
(e.g. Netlify `_redirects`: `/* /index.html 200`, or the equivalent `vercel.json` rewrite),
otherwise deep links like `/practice-areas/gst-registration` will 404 on refresh.

## Translation disclaimer

Non-English content is machine-translated and should be reviewed by a native speaker
before go-live; the footer carries an "English version prevails" note.
