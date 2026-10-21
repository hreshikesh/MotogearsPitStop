# Local SEO Setup — MotoGearsPitstop (Whitefield, Bengaluru)

## Authoritative values (from website copy)

Use these unless the business owner confirms otherwise:

| Field | Value | Source |
|-------|-------|--------|
| Business name | MotoGearsPitstop | Site branding |
| Street | No.301, Varthur Main Rd, next to Dmart, Narayanswamy Layout, Siddapura | Footer / Contact |
| City | Whitefield, Bengaluru | Footer / Contact |
| Region / PIN | Karnataka 560066 | Footer / Contact |
| Phone | +91 63619 11949 | `frontend/src/config/contact.js` |
| Hours (weekday) | Mon–Sat 10:00 AM – 8:00 PM | Contact page |
| Hours (Sunday) | 11:00 AM – 6:00 PM | Contact page |
| Primary email (Contact) | support@motogearspitstop.com | Contact page |
| Instagram | https://www.instagram.com/motogearpitstop/ | `contact.js` |
| Website (canonical) | https://motogearspitstop.com | Project / backend CORS |
| Store landing page | https://motogearspitstop.com/motorcycle-accessories-store-whitefield-bengaluru | Implemented |

## Discrepancies — confirm with owner

| Item | Value A | Value B | Recommended action |
|------|---------|---------|---------------------|
| Support email | `support@motogearspitstop.com` (Contact) | `support@motogears.com` (was in Footer) | **Footer updated to Contact email.** Confirm which inbox is monitored and set GB profile + schema to match. |
| Brand spelling | MotoGearsPitstop | "Moto Gears Pitstop" (some product copy) | Standardize customer-facing name to **MotoGearsPitstop**. |
| Facebook / YouTube / Twitter | Not linked | Placeholder icons in Footer | Add verified profile URLs or remove icons. |
| Google Maps listing URL | Not in codebase | — | Copy official GBP “Share” / “Directions” link into store page after verification (do not invent Place ID). |
| Google review link | Not in codebase | — | Use GBP dashboard “Get more reviews” link when available. |

## Website local SEO (done in code)

- Dedicated page: `/motorcycle-accessories-store-whitefield-bengaluru`
- `LocalBusiness` / `MotorcycleDealer` JSON-LD with address, hours, phone, map search URL
- Footer link “Whitefield Store”
- NAP aligned to `frontend/src/config/business.js`

## Google Business Profile — manual checklist

Do **not** create duplicate listings.

- [ ] Primary category: Motorcycle shop / Motorcycle parts store (choose best GBP fit)
- [ ] Secondary categories: Sporting goods store, Helmet shop (if accurate)
- [ ] Address matches table above exactly
- [ ] Phone matches +91 63619 11949
- [ ] Website = `https://motogearspitstop.com`
- [ ] Hours match Contact page
- [ ] Upload real store photos (exterior, interior, products)
- [ ] Add products/services from actual inventory categories
- [ ] Post updates for promotions (align with site promos only)
- [ ] Q&A: add FAQs from store page (visit, pickup, hours)
- [ ] Monitor reviews — respond professionally; no incentives for reviews

## Citations (optional, manual)

Ensure NAP consistency on:

- Instagram bio
- WhatsApp business profile
- Any directories already in use (Justdial, etc.) — update only existing listings

## Validation

1. [Rich Results Test](https://search.google.com/test/rich-results) on store URL
2. [Schema Validator](https://validator.schema.org/) for LocalBusiness block
3. Google Maps search for business name + address — confirm pin accuracy with owner
