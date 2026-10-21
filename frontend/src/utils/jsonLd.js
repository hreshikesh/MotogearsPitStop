import {
  SITE_ORIGIN,
  SITE_NAME,
  DEFAULT_CURRENCY,
} from '@/config/seo';
import {
  BUSINESS_NAME,
  BUSINESS_ADDRESS,
  BUSINESS_PHONE_E164,
  BUSINESS_EMAIL_PRIMARY,
  BUSINESS_HOURS,
  SOCIAL_PROFILES,
  getGoogleMapsDirectionsUrl,
} from '@/config/business';
import { absoluteUrl, stripHtml } from '@/utils/seoText';
import { getProductIdentifier } from '@/utils/urlUtils';

export const safeJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BUSINESS_NAME,
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/logo.webp`,
  email: BUSINESS_EMAIL_PRIMARY,
  telephone: BUSINESS_PHONE_E164,
  sameAs: Object.values(SOCIAL_PROFILES).filter(Boolean),
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_ADDRESS.streetAddress,
    addressLocality: BUSINESS_ADDRESS.addressLocality,
    addressRegion: BUSINESS_ADDRESS.addressRegion,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.addressCountry,
  },
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_ORIGIN}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'MotorcycleDealer',
  name: BUSINESS_NAME,
  image: `${SITE_ORIGIN}/logo.webp`,
  url: absoluteUrl(SITE_ORIGIN, '/motorcycle-accessories-store-whitefield-bengaluru'),
  telephone: BUSINESS_PHONE_E164,
  email: BUSINESS_EMAIL_PRIMARY,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_ADDRESS.streetAddress,
    addressLocality: BUSINESS_ADDRESS.addressLocality,
    addressRegion: BUSINESS_ADDRESS.addressRegion,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.addressCountry,
  },
  openingHoursSpecification: BUSINESS_HOURS.map(({ dayOfWeek, opens, closes }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek,
    opens,
    closes,
  })),
  hasMap: getGoogleMapsDirectionsUrl(),
  priceRange: '₹₹',
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(SITE_ORIGIN, item.path),
  })),
});

const offerAvailability = (product) => {
  if (product?.discontinued) return 'https://schema.org/Discontinued';
  if (product?.stock === 0 || product?.inStock === false) {
    return 'https://schema.org/OutOfStock';
  }
  return 'https://schema.org/InStock';
};

export const productSchema = (product) => {
  const id = getProductIdentifier(product);
  const url = absoluteUrl(SITE_ORIGIN, `/product/${encodeURIComponent(String(id))}`);
  const image = product?.image || product?.images?.[0]?.url;
  const description = stripHtml(product?.description || product?.name || '');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name,
    description,
    image: image ? [image] : undefined,
    sku: product?.sku || String(id),
    brand: product?.brand
      ? { '@type': 'Brand', name: product.brand }
      : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: DEFAULT_CURRENCY,
      price: Number(product?.price ?? 0).toFixed(2),
      availability: offerAvailability(product),
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BUSINESS_NAME,
      },
    },
  };

  if (product?.mpn) schema.mpn = product.mpn;

  // Omit aggregateRating — static catalog review counts are not verified customer reviews.

  return schema;
};

export const itemListSchema = ({ name, items }) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.slice(0, 20).map((product, index) => {
    const id = getProductIdentifier(product);
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(SITE_ORIGIN, `/product/${encodeURIComponent(String(id))}`),
      name: product.name,
    };
  }),
});
