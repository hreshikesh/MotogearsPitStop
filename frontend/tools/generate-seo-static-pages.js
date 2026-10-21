#!/usr/bin/env node

/**
 * Post-build: lightweight HTML shells with crawlable meta + JSON-LD for product URLs.
 * Apache rewrite (public/.htaccess) serves these for /product/:id requests.
 */

import fs from 'node:fs';
import path from 'node:path';
import { products, SITE_ORIGIN, getProductIdentifier } from './seo-shared.js';

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

const stripHtml = (t) => String(t || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const truncate = (t, max = 160) => {
  const s = stripHtml(t);
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
};

const escapeAttr = (v) =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');

const productJsonLd = (product, url) => {
  const id = getProductIdentifier(product);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.description || product.name),
    image: product.image ? [product.image] : undefined,
    sku: String(id),
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: Number(product.price ?? 0).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }).replace(/</g, '\\u003c');
};

const buildShell = ({ title, description, canonical, jsonLd, bodyHtml }) => `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(title)}</title>
  <meta name="description" content="${escapeAttr(description)}" />
  <link rel="canonical" href="${escapeAttr(canonical)}" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:url" content="${escapeAttr(canonical)}" />
  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
  <meta http-equiv="refresh" content="0;url=${escapeAttr(canonical)}" />
</head>
<body>
  <main>
    ${bodyHtml}
    <p><a href="${escapeAttr(canonical)}">Continue to ${escapeAttr(title)}</a></p>
  </main>
  <script>window.location.replace(${JSON.stringify(canonical)});</script>
</body>
</html>
`;

const main = () => {
  if (!fs.existsSync(indexPath)) {
    throw new Error('Run after vite build — dist/index.html missing');
  }

  const productDir = path.join(distDir, 'product');
  fs.mkdirSync(productDir, { recursive: true });

  let written = 0;
  for (const product of products) {
    const id = getProductIdentifier(product);
    const segment = encodeURIComponent(String(id));
    const pathPart = `/product/${segment}`;
    const canonical = `${SITE_ORIGIN}${pathPart}`;
    const title = `${product.brand ? `${product.brand} ` : ''}${product.name} | MotoGearsPitstop`;
    const description = truncate(
      product.description ||
        `${product.name} — buy online at MotoGearsPitstop, India.`,
    );
    const html = buildShell({
      title,
      description,
      canonical,
      jsonLd: productJsonLd(product, canonical),
      bodyHtml: `<h1>${escapeAttr(product.name)}</h1><p>${escapeAttr(description)}</p><p>Price: ₹${Number(product.price).toLocaleString('en-IN')}</p>`,
    });
    fs.writeFileSync(path.join(productDir, `${segment}.html`), html, 'utf8');
    written += 1;
  }

  console.log(`SEO static shells: ${written} product HTML files in dist/product/`);
};

main();
