import { BUSINESS_NAME } from './business.js';

/** Production canonical origin — override via VITE_SITE_URL at build time */
export const SITE_ORIGIN = (
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL
    : 'https://motogearspitstop.com'
).replace(/\/$/, '');

export const SITE_NAME = BUSINESS_NAME;
export const SITE_LOCALE = 'en_IN';
export const SITE_LANGUAGE = 'en-IN';
export const DEFAULT_CURRENCY = 'INR';

export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/rteryyle/image/upload/v1790424296/logo.png';

export const TITLE_SUFFIX = SITE_NAME;
export const DEFAULT_TITLE = `${SITE_NAME} — Premium Motorcycle Accessories & Riding Gear`;
export const DEFAULT_DESCRIPTION =
  'Shop premium motorcycle accessories, riding gear, helmets, jackets, crash guards, and touring essentials for riders across India. Free shipping on orders above ₹5000.';

/** Routes that must never be indexed */
export const NOINDEX_PATH_PREFIXES = [
  '/cart',
  '/checkout',
  '/wishlist',
  '/orders',
  '/forgot-password',
  '/reset-password',
  '/admin',
  '/community',
];

export const SITEMAP_CHUNK_SIZE = 500;

export const INDEXABLE_LISTING_PARAMS = new Set([
  'category',
  'subcategory',
  'brand',
  'bike',
]);
