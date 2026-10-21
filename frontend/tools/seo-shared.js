import { products, brands, categories, bikes } from '../src/data/products.js';
import { getProductIdentifier } from '../src/utils/urlUtils.js';

export const SITE_ORIGIN = (process.env.VITE_SITE_URL || 'https://motogearspitstop.com').replace(/\/$/, '');

export { products, brands, categories, bikes, getProductIdentifier };

export const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/motorcycle-accessories-store-whitefield-bengaluru', changefreq: 'monthly', priority: '0.8' },
];

export const listingRoutes = () => {
  const routes = [];
  for (const subcategory of new Set(products.map((p) => p.subcategory).filter(Boolean))) {
    routes.push({
      path: `/products?subcategory=${encodeURIComponent(subcategory)}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }
  for (const brand of brands) {
    routes.push({
      path: `/products?brand=${encodeURIComponent(brand)}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }
  for (const bike of bikes) {
    const slug = bike.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      path: `/shop-by-bike/${slug}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }
  for (const category of categories) {
    routes.push({
      path: `/products?category=${encodeURIComponent(category)}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }
  return routes;
};

export const productRoutes = () =>
  products.map((product) => {
    const id = getProductIdentifier(product);
    return {
      path: `/product/${encodeURIComponent(String(id))}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: product.updatedAt || product.lastModified,
    };
  });
