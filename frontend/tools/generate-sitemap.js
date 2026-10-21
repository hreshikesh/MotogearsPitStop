#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_ORIGIN,
  staticRoutes,
  listingRoutes,
  productRoutes,
} from './seo-shared.js';

const CHUNK = 500;
const publicDir = path.join(process.cwd(), 'public');

const xmlEscape = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const urlEntry = ({ loc, lastmod, changefreq, priority }) => {
  let body = `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n`;
  if (lastmod) body += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) body += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority) body += `    <priority>${priority}</priority>\n`;
  body += '  </url>\n';
  return body;
};

const writeUrlset = (filename, urls) => {
  const content =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((entry) =>
        urlEntry({
          ...entry,
          loc: entry.loc.startsWith('http') ? entry.loc : `${SITE_ORIGIN}${entry.loc}`,
        }),
      )
      .join('') +
    '</urlset>\n';
  fs.writeFileSync(path.join(publicDir, filename), content, 'utf8');
};

const main = () => {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const coreUrls = [...staticRoutes, ...listingRoutes()].map((r) => ({
    loc: r.path,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  writeUrlset('sitemap-pages.xml', coreUrls);

  const products = productRoutes();
  const productFiles = [];
  for (let i = 0; i < products.length; i += CHUNK) {
    const chunk = products.slice(i, i + CHUNK);
    const file = `sitemap-products-${Math.floor(i / CHUNK) + 1}.xml`;
    writeUrlset(
      file,
      chunk.map((r) => ({
        loc: r.path,
        changefreq: r.changefreq,
        priority: r.priority,
        lastmod: r.lastmod,
      })),
    );
    productFiles.push(file);
  }

  const sitemapIndex =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [`sitemap-pages.xml`, ...productFiles]
      .map(
        (file) =>
          `  <sitemap>\n    <loc>${xmlEscape(`${SITE_ORIGIN}/${file}`)}</loc>\n  </sitemap>\n`,
      )
      .join('') +
    '</sitemapindex>\n';

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  console.log(`Sitemap: ${products.length} products, ${coreUrls.length} core/listing URLs → public/sitemap.xml`);
};

main();
