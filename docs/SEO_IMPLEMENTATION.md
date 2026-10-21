# SEO Implementation Guide

## Architecture

| Layer | Approach |
|-------|----------|
| Runtime (browser) | `SeoHead` + `react-helmet` for titles, meta, canonical, OG, Twitter, JSON-LD |
| Build time | XML sitemaps + static product HTML shells for crawlers |
| Hosting | Hostinger static `dist/` + Apache `.htaccess` product rewrite |

## Key files

| File | Purpose |
|------|---------|
| `frontend/src/config/seo.js` | Site origin, defaults, noindex prefixes |
| `frontend/src/config/business.js` | Verified NAP, hours, store path |
| `frontend/src/components/SeoHead.jsx` | Unified metadata component |
| `frontend/src/utils/jsonLd.js` | Organization, WebSite, Product, LocalBusiness, BreadcrumbList |
| `frontend/src/utils/indexability.js` | Robots rules for faceted `/products` URLs |
| `frontend/tools/generate-sitemap.js` | Sitemap index + product chunks |
| `frontend/tools/generate-seo-static-pages.js` | Post-build product HTML |
| `frontend/public/robots.txt` | Crawl directives |
| `frontend/public/.htaccess` | SPA fallback + product shell rewrite |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SITE_URL` | Recommended | Canonical origin, e.g. `https://motogearspitstop.com` |
| `VITE_GA4_MEASUREMENT_ID` | Optional | GA4 measurement ID (never commit secrets) |
| `VITE_API_URL` | Existing | Backend API |

Example (production build):

```env
VITE_SITE_URL=https://motogearspitstop.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Domain / canonical policy

- **Canonical production host:** `https://motogearspitstop.com` (configured in `seo.js` and build tools).
- **Not activated:** automatic redirect from alternate domains (e.g. `.in`, `onrender.com` frontend mirror). Confirm ownership and GSC performance before 301 consolidation.
- **Documented redirect plan (when confirmed):**
  1. 301 all alternate hosts → `https://motogearspitstop.com` preserving path/query where valid.
  2. Update GSC domain property and sitemap.
  3. Update Google Business Profile website URL.

## Routes affected

| Route | Index | Notes |
|-------|-------|-------|
| `/` | yes | Organization + WebSite schema |
| `/products` | yes | Base listing |
| `/products?subcategory=` / `?brand=` / `?category=` / `?bike=` | yes (single facet only) | Multi-facet → noindex |
| `/product/:id` | yes | Product schema + static shell |
| `/shop-by-bike/:bike` | yes | ItemList when products exist |
| `/about`, `/contact` | yes | |
| `/motorcycle-accessories-store-whitefield-bengaluru` | yes | LocalBusiness schema |
| `/cart`, `/checkout`, `/wishlist`, `/orders/*`, `/admin/*` | no | |

## Commands

```bash
cd frontend
npm run sitemap          # Regenerate public/sitemap*.xml
npm run test:seo         # Node SEO unit tests
npm run lint
npm run build            # Sitemap + Vite + product shells + 404 copy
```

## Deployment & rollback

1. Build with `VITE_SITE_URL` set to production.
2. Upload `dist/` including `product/*.html`, `sitemap*.xml`, `robots.txt`, `.htaccess`.
3. **Rollback:** redeploy previous `dist/` artifact; remove sitemap submission if needed.

## Tests performed

Run locally after changes:

- `npm run test:seo`
- `npm run build`

Record actual exit codes in your CI/deploy log.

## 30-day SEO backlog (prioritized)

1. Confirm email/NAP and sync Google Business Profile.
2. Submit sitemap; fix Coverage issues in GSC.
3. URL Inspection for top 20 product URLs and top categories.
4. Replace placeholder footer social URLs when available.
5. Enrich thin product descriptions in catalog (admin or CSV).
6. Add real customer review program (then eligible Product rich results).
7. Evaluate `.in` redirect after 2 weeks of GSC data.
8. Core Web Vitals: measure LCP on `/` and `/products` (PageSpeed Insights).
9. Internal links from homepage modules to priority categories (ongoing).
10. First GEO editorial page from `GEO_CONTENT_PLAN.md` (manual content).

## Remaining risks

- CSR still required for full PDP content; shells provide meta + basic text only.
- Static catalog review counts are visible on PDP but excluded from schema intentionally.
- API-backed products (if switched from static JS) need sitemap generation from API.
