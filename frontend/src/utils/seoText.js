const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value) => {
  if (value == null) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] || ch);
};

export const stripHtml = (value) => {
  if (!value) return '';
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

export const truncateMeta = (text, maxLength = 160) => {
  const cleaned = stripHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  const slice = cleaned.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trim()}…`;
};

export const buildTitle = (pageTitle, { includeSuffix = true } = {}) => {
  const base = stripHtml(pageTitle).trim();
  if (!base) return includeSuffix ? DEFAULT_TITLE_FALLBACK() : '';
  if (!includeSuffix) return base;
  if (base.toLowerCase().includes('motogearspitstop') || base.toLowerCase().includes('moto gear')) {
    return base;
  }
  return `${base} | MotoGearsPitstop`;
};

function DEFAULT_TITLE_FALLBACK() {
  return 'MotoGearsPitstop — Premium Motorcycle Accessories & Riding Gear';
}

export const productMetaTitle = (product) => {
  const brand = product?.brand ? `${product.brand} ` : '';
  const name = product?.name || 'Product';
  return buildTitle(`${brand}${name}`.trim());
};

export const productMetaDescription = (product) => {
  const parts = [];
  if (product?.description) {
    parts.push(truncateMeta(product.description, 120));
  }
  if (product?.brand) parts.push(`Brand: ${product.brand}.`);
  if (product?.category) parts.push(`${product.category}${product.subcategory ? ` · ${product.subcategory}` : ''}.`);
  parts.push('Buy online at MotoGearsPitstop with genuine products and fast delivery across India.');
  return truncateMeta(parts.join(' '), 160);
};

export const listingMetaTitle = ({ brand, bike, subcategory, category, search } = {}) => {
  if (search) return buildTitle(`Search: ${search}`);
  if (brand) return buildTitle(`${brand} Motorcycle Gear & Accessories`);
  if (bike) return buildTitle(`${bike} Accessories & Parts`);
  if (subcategory) return buildTitle(`${subcategory} for Motorcycles`);
  if (category) return buildTitle(`${category} — Shop Motorcycle Gear`);
  return buildTitle('Shop Motorcycle Gear & Accessories');
};

export const listingMetaDescription = ({ brand, bike, subcategory, category, productCount } = {}) => {
  const countPhrase = productCount != null ? `${productCount}+ products. ` : '';
  if (brand) {
    return truncateMeta(
      `${countPhrase}Browse ${brand} motorcycle accessories and riding gear at MotoGearsPitstop. Helmets, jackets, parts and more with delivery across India.`,
    );
  }
  if (bike) {
    return truncateMeta(
      `${countPhrase}Shop accessories and performance parts compatible with ${bike}. Genuine gear, crash protection, touring essentials and more.`,
    );
  }
  if (subcategory) {
    return truncateMeta(
      `${countPhrase}Explore ${subcategory} for Indian riders — quality gear, fair prices, and support from our Whitefield, Bengaluru store.`,
    );
  }
  if (category) {
    return truncateMeta(
      `${countPhrase}Shop ${category} at MotoGearsPitstop. Premium motorcycle accessories and riding gear with free shipping on eligible orders.`,
    );
  }
  return truncateMeta(
    `${countPhrase}Browse motorcycle accessories, riding gear, helmets, touring products and performance parts. Online store with pickup at Whitefield, Bengaluru.`,
  );
};

export const absoluteUrl = (origin, pathnameOrUrl) => {
  if (!pathnameOrUrl) return origin;
  if (/^https?:\/\//i.test(pathnameOrUrl)) return pathnameOrUrl.replace(/\/$/, '') || pathnameOrUrl;
  const path = pathnameOrUrl.startsWith('/') ? pathnameOrUrl : `/${pathnameOrUrl}`;
  return `${origin}${path}`;
};

export const normalizePath = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};
