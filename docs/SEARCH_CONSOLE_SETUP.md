# Google Search Console Setup

## Canonical property

Prefer **Domain property** `motogearspitstop.com` (covers http/https and subdomains) once DNS access is available.

Alternative: **URL prefix** `https://motogearspitstop.com/`

## Verification (user action — no tokens in repo)

Choose one method in GSC:

1. **DNS TXT** record at domain registrar (recommended for domain property)
2. **HTML file** upload to site root (`dist/`)
3. **HTML meta tag** in `index.html` (temporary; remove after verified if desired)
4. **Google Analytics** if GA4 is linked and you have admin access

Do not commit verification tokens to git.

## Sitemap submission

After deploy:

1. Open GSC → Sitemaps  
2. Submit: `https://motogearspitstop.com/sitemap.xml`  
3. Confirm child sitemaps (`sitemap-pages.xml`, `sitemap-products-*.xml`) are discovered

Regenerate sitemaps on each catalog deploy:

```bash
cd frontend && npm run sitemap
```

## Post-submit checks

| Report | Action |
|--------|--------|
| **URL Inspection** | Test `/`, one category URL, one product URL, store page |
| **Page indexing** | Resolve “Crawled – not indexed” for important templates |
| **Performance** | Monitor queries for brand + category terms |
| **Enhancements → Product snippets** | Fix Product schema errors if reported |
| **Core Web Vitals** | Track mobile URLs for `/` and `/products` |

## Domain consolidation (if `.in` or others exist)

1. List all serving hosts in GSC + `site:` search  
2. If alternate domain is owned and duplicate: plan 301 to `https://motogearspitstop.com`  
3. Use GSC “Change of address” only when moving primary host  
4. See `SEO_IMPLEMENTATION.md` redirect plan — **not enabled in code**

## GA4 linkage

If `VITE_GA4_MEASUREMENT_ID` is set at build time:

- Link GA4 property to Search Console (GA admin → Search Console linking)
- Enable enhanced measurement events as needed
- Ecommerce events implemented in code: `view_item`, `add_to_cart`, `begin_checkout` (optional wiring on checkout), `purchase` on order success when `?placed=1` or navigation state

Configure conversions in GA4 UI for `purchase` (user action).

## Structured data validation (manual)

- https://search.google.com/test/rich-results  
- https://validator.schema.org/

Test URLs: homepage, sample PDP, store page, one brand listing.
