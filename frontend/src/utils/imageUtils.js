import { applyCloudinaryDeliveryUrl } from '@/config/cloudinaryDelivery';

const getUrlValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || value.src || value.image || '';
};

/** Some catalog rows accidentally concatenated two URLs (…webphttps://…). */
export const sanitizeImageUrl = (value) => {
  let url = getUrlValue(value).trim();
  if (!url) return '';

  const secondProtocol = url.indexOf('https://', 8);
  if (secondProtocol > 0) {
    url = url.slice(0, secondProtocol);
  }

  return applyCloudinaryDeliveryUrl(url);
};

export const normalizeImageUrl = (value) => {
  return sanitizeImageUrl(value);
};

export const getProductImageCandidates = (product = {}) => {
  const primary = sanitizeImageUrl(product.image);
  const gallery = Array.isArray(product.galleryImages)
    ? product.galleryImages.map(sanitizeImageUrl).filter(Boolean)
    : [];

  return [...new Set([primary, ...gallery].filter(Boolean))];
};

export const getProductImage = (product = {}) => {
  const candidates = getProductImageCandidates(product);
  return candidates[0] || '';
};

export const getProductGalleryImages = (product = {}) => {
  const galleryImages = Array.isArray(product.galleryImages) ? product.galleryImages : [];
  return galleryImages.map(sanitizeImageUrl).filter(Boolean);
};

export const handleProductImageError = (event, product) => {
  const img = event.currentTarget;
  if (!product) {
    img.removeAttribute('src');
    return;
  }

  const candidates = getProductImageCandidates(product);
  const tried = Number(img.dataset.fallbackIndex || 0);
  const next = tried + 1;

  if (next < candidates.length) {
    img.dataset.fallbackIndex = String(next);
    img.src = candidates[next];
    return;
  }

  if (img.dataset.fallbackExhausted === '1') {
    return;
  }

  img.dataset.fallbackExhausted = '1';
  img.src = '/images/product-placeholder.svg';
};
