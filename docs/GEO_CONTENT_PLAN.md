# GEO Content Plan — MotoGearsPitstop

Generative Engine Optimization here means **accurate, crawlable, cite-worthy content** tied to real products and verified specs — not bulk AI articles or `llms.txt` hacks.

## Principles

- Use manufacturer specifications and in-stock product data only.
- Attribute authors only when a real staff expert is named.
- Link guides to specific `/products` and `/product/:id` URLs.
- Keep business facts consistent with `frontend/src/config/business.js`.
- No fabricated tests, statistics, or review scores.

## Content roadmap (editorial — manual creation)

| Priority | Topic | Target intent | Internal links |
|----------|-------|---------------|----------------|
| P1 | How to choose a motorcycle helmet in India | Helmet sizing, ISI/DOT/ECE basics | `/products?subcategory=Helmets`, top helmet PDPs |
| P1 | Motorcycle riding gear buying guide | Jacket CE ratings, monsoon gear | Riding Gear categories |
| P2 | Touring accessories checklist | Long-ride luggage, lights, comfort | `/products?category=Touring` |
| P2 | Choosing a motorcycle Bluetooth intercom | Pairing, range, brand compatibility | Intercom subcategory, Sena/Cardo/EJEAS PDPs |
| P3 | Crash guard fitment by bike model | RE, KTM, etc. | `/shop-by-bike/*`, crash guard PDPs |
| P3 | Helmet care and visor replacement | Maintenance | Helmet accessories PDPs |

## Suggested URL structure (when published)

- `/guides/how-to-choose-motorcycle-helmet`
- `/guides/riding-gear-buying-guide`

Implement as static routes or CMS pages later; **not auto-generated in this pass**.

## Product data improvements (supports GEO + SEO)

1. Expand unique descriptions for products with duplicate one-liners in `products.js`.
2. Add verified `compatibleBikes` / fitment notes where data exists.
3. Use admin SEO fields (`seoTitle`, `metaDescription`) when moving to API-first catalog.

## AI visibility monitoring (manual)

- GA4: watch `session_source` for `chatgpt.com`, `gemini.google.com`, `perplexity.ai` (if traffic appears).
- Search Console: branded queries and impression growth on guide URLs after publish.
- Do **not** expect guaranteed citations in ChatGPT, Gemini, or AI Overviews.

## robots.txt / AI crawlers

Current policy: allow standard indexing (`User-agent: * Allow: /`).  
If you restrict AI training crawlers later, document business impact first (may affect some AI discovery tools).

## Existing automated artifact

`frontend/tools/generate-llms.js` builds a minimal `public/llms.txt` from Helmet titles — optional, not a ranking guarantee. Regenerated on build.
