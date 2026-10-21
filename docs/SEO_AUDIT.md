# MotoGearsPitstop — Technical SEO Audit

**Audit date:** 2026-03-21  
**Stack:** React 18 + Vite 4 SPA (Hostinger static hosting), Express/MongoDB API on Render  
**Production domain (target):** `https://motogearspitstop.com`

## Executive summary

The site is a client-rendered ecommerce SPA with product data primarily in `frontend/src/data/products.js` (~1,593 SKUs). Before this implementation, SEO was limited to basic `react-helmet` titles/descriptions on some pages, with **no** `robots.txt`, **no** XML sitemap, **no** canonical URLs, **no** JSON-LD, and **no** crawler-visible HTML for product URLs.

## Confirmed findings

| Severity | Issue | Routes / templates | Evidence | Fix status |
|----------|-------|-------------------|----------|------------|
| Critical | Product URLs not crawlable without JS execution | `/product/:id` | `index.html` + CSR only; no prerender/sitemap | **Implemented:** build-time product HTML shells + sitemap |
| Critical | No XML sitemap | Site-wide | No `public/sitemap.xml` in repo | **Implemented:** `tools/generate-sitemap.js` |
| Critical | No `robots.txt` | Site-wide | Missing from `public/` | **Implemented:** `public/robots.txt` |
| High | Duplicate / conflicting default meta | `/` | Global `App.jsx` Helmet + `HomePage` Helmet + `index.html` | **Fixed:** removed App-level Helmet; centralized `SeoHead` |
| High | No canonical URLs | All pages | No `<link rel="canonical">` in components | **Implemented:** `SeoHead` + static shells |
| High | Faceted URL crawl bloat | `/products?…` | Many filter query combinations | **Implemented:** `noindex` for multi-facet/search/filter URLs; robots disallow hints |
| High | Inconsistent NAP / email | Footer vs Contact | `support@motogears.com` vs `support@motogearspitstop.com` | **Partial:** Footer aligned to Contact; see `LOCAL_SEO_SETUP.md` |
| Medium | No structured data | Product, org, local | No JSON-LD | **Implemented:** JSON-LD via `SeoHead` + product shells |
| Medium | No dedicated local landing page | Local SEO | Only `/contact` | **Implemented:** `/motorcycle-accessories-store-whitefield-bengaluru` |
| Medium | Placeholder social links | Footer | `href="#"` on Facebook/YouTube/Twitter | **Partial:** Instagram linked; others disabled pending URLs |
| Medium | Static review counts on PDP | `/product/:id` | `rating` / `reviews` in static catalog | **Mitigated:** omitted `aggregateRating` from JSON-LD |
| Low | `Hostinger Horizons` generator meta | `index.html` | `<meta name="generator">` | **Removed** |
| Low | `llms.txt` build may fail silently | Build | `generate-llms.js` exits 1 if no Helmet pages | Unchanged (`|| true` in build) |

## Requires live-server verification

- Whether `motogearspitstop.in` or other domains redirect to `.com` (not changed — see domain plan in `SEO_IMPLEMENTATION.md`).
- Google’s rendered HTML for sample product URLs after deploy (URL Inspection).
- Core Web Vitals field data (LCP/INP/CLS) — not measured in this environment.
- Whether Hostinger serves `.htaccess` product rewrite rules (Apache) as expected.
- Render CDN / `motogearspitstop.onrender.com` indexing (should stay non-canonical).

## Implemented fixes (code)

- Central SEO config: `frontend/src/config/seo.js`, `frontend/src/config/business.js`
- Reusable head component: `frontend/src/components/SeoHead.jsx`
- JSON-LD utilities: `frontend/src/utils/jsonLd.js`
- Indexation rules: `frontend/src/utils/indexability.js`
- Sitemap + product static shells: `frontend/tools/generate-sitemap.js`, `generate-seo-static-pages.js`
- Local store page: `frontend/src/pages/StoreLocation.jsx`
- Optional GA4: `frontend/src/utils/analytics.js` (`VITE_GA4_MEASUREMENT_ID`)
- Backend optional SEO fields on `Product` model (backward compatible)

## Manual actions

1. Confirm canonical email and update Google Business Profile to match.
2. Submit `https://motogearspitstop.com/sitemap.xml` in Search Console (see `SEARCH_CONSOLE_SETUP.md`).
3. Validate JSON-LD with [Rich Results Test](https://search.google.com/test/rich-results) on homepage, one product, store page.
4. Decide `.in` → `.com` redirect policy after Search Console domain reports.
5. Set `VITE_SITE_URL` and optional `VITE_GA4_MEASUREMENT_ID` in production build env.

## Verification instructions

```bash
cd frontend
npm run sitemap
npm run test:seo
npm run build
```

After deploy:

1. `curl -I https://motogearspitstop.com/robots.txt`
2. `curl -I https://motogearspitstop.com/sitemap.xml`
3. `curl -s https://motogearspitstop.com/product/1 | head -40` — expect title, canonical, JSON-LD in HTML
4. View page source on `/products?subcategory=Helmets` — single canonical, `index` robots
5. View `/products?search=helmet&subcategory=Helmets` — `noindex`
