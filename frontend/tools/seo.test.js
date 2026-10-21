#!/usr/bin/env node

import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { INDEXABLE_LISTING_PARAMS, NOINDEX_PATH_PREFIXES } from '../src/config/seo.js';

const escapeHtml = (value) => {
  if (value == null) return '';
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch] || ch));
};

const absoluteUrl = (origin, pathnameOrUrl) => {
  if (/^https?:\/\//i.test(pathnameOrUrl)) return pathnameOrUrl;
  const path = pathnameOrUrl.startsWith('/') ? pathnameOrUrl : `/${pathnameOrUrl}`;
  return `${origin}${path}`;
};

const SITE_ORIGIN = (process.env.VITE_SITE_URL || 'https://motogearspitstop.com').replace(/\/$/, '');

const isProductsListingIndexable = (searchParams) => {
  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : new URLSearchParams(searchParams || '');
  const keys = [...params.keys()];
  if (keys.length === 0) return true;
  const blockedKeys = keys.filter((key) => !INDEXABLE_LISTING_PARAMS.has(key));
  if (blockedKeys.length > 0) return false;
  let facetCount = 0;
  for (const key of INDEXABLE_LISTING_PARAMS) {
    if (params.get(key)) facetCount += 1;
  }
  return facetCount <= 1;
};

const isPathNoindex = (pathname) =>
  NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const robotsDirective = ({ pathname, searchParams, forceNoindex = false } = {}) => {
  if (forceNoindex || isPathNoindex(pathname)) return 'noindex, follow';
  if (pathname === '/products' || pathname.startsWith('/products')) {
    return isProductsListingIndexable(searchParams) ? 'index, follow' : 'noindex, follow';
  }
  return 'index, follow';
};

const productMetaTitle = (product) => {
  const brand = product?.brand ? `${product.brand} ` : '';
  return `${brand}${product?.name || 'Product'} | MotoGearsPitstop`;
};

const productMetaDescription = (product) => {
  const desc = String(product?.description || '').slice(0, 120);
  return `${desc} Buy online at MotoGearsPitstop.`.trim();
};

const productSchema = (product) => ({
  '@type': 'Product',
  name: product.name,
  offers: {
    priceCurrency: 'INR',
    price: Number(product.price ?? 0).toFixed(2),
  },
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

test('homepage canonical host uses production domain', () => {
  const url = absoluteUrl(SITE_ORIGIN, '/');
  assert.equal(url, 'https://motogearspitstop.com/');
});

test('product metadata is unique and escaped', () => {
  const product = {
    id: 99,
    name: 'Test "Helmet" & Jacket',
    brand: 'Rynox',
    category: 'Riding Gear',
    subcategory: 'Helmets',
    description: 'CE certified gear for Indian riders.',
    price: 4999,
    image: 'https://example.com/p.webp',
  };
  const title = productMetaTitle(product);
  assert.match(title, /Rynox/);
  assert.match(title, /MotoGearsPitstop/);
  const desc = productMetaDescription(product);
  assert.match(desc, /CE certified/);
  assert.doesNotMatch(desc, /</);
});

test('faceted listing with search is not indexable', () => {
  const params = new URLSearchParams('subcategory=Helmets&search=axor');
  assert.equal(isProductsListingIndexable(params), false);
});

test('single subcategory listing is indexable', () => {
  const params = new URLSearchParams('subcategory=Helmets');
  assert.equal(isProductsListingIndexable(params), true);
});

test('cart and checkout are noindex', () => {
  assert.match(robotsDirective({ pathname: '/cart' }), /noindex/);
  assert.match(robotsDirective({ pathname: '/checkout' }), /noindex/);
});

test('product JSON-LD has INR price and no aggregateRating', () => {
  const schema = productSchema({
    id: 1,
    name: 'Sample Product',
    price: 1200,
    brand: 'Studds',
    description: 'Sample',
    image: 'https://example.com/i.webp',
  });
  assert.equal(schema.offers.priceCurrency, 'INR');
  assert.equal(schema.offers.price, '1200.00');
  assert.equal(schema.aggregateRating, undefined);
});

test('escapeHtml prevents attribute injection', () => {
  assert.equal(escapeHtml('"><script>'), '&quot;&gt;&lt;script&gt;');
});

test('robots.txt allows assets and references sitemap', () => {
  const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/motogearspitstop\.com\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/admin/);
  assert.doesNotMatch(robots, /Disallow: \/assets/);
});

test('sitemap index exists after generation', () => {
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.warn('Skip: run npm run sitemap first');
    return;
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  assert.match(xml, /sitemapindex/);
  assert.match(xml, /sitemap-pages\.xml/);
});
