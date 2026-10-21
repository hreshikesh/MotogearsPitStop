import { INDEXABLE_LISTING_PARAMS, NOINDEX_PATH_PREFIXES } from '@/config/seo';

/**
 * Decide whether a /products URL with query params should be indexed.
 * Allows a single facet (category, subcategory, brand, or bike) without extra filters.
 */
export const isProductsListingIndexable = (searchParams) => {
  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : new URLSearchParams(searchParams || '');

  const keys = [...params.keys()];
  if (keys.length === 0) return true;

  const blockedKeys = keys.filter(
    (key) => !INDEXABLE_LISTING_PARAMS.has(key),
  );
  if (blockedKeys.length > 0) return false;

  let facetCount = 0;
  for (const key of INDEXABLE_LISTING_PARAMS) {
    if (params.get(key)) facetCount += 1;
  }
  return facetCount <= 1;
};

export const isPathNoindex = (pathname) => {
  const path = pathname || '/';
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
};

export const robotsDirective = ({ pathname, searchParams, forceNoindex = false } = {}) => {
  if (forceNoindex || isPathNoindex(pathname)) {
    return 'noindex, follow';
  }
  if (pathname === '/products' || pathname.startsWith('/products')) {
    const indexable = isProductsListingIndexable(searchParams);
    return indexable ? 'index, follow' : 'noindex, follow';
  }
  if (pathname.startsWith('/shop-by-bike/')) {
    return 'index, follow';
  }
  return 'index, follow';
};
