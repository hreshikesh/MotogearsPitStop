import { stripHtml } from '@/utils/seoText';

export const productImageAlt = (product, { variant = 'primary', index = 0 } = {}) => {
  const name = stripHtml(product?.name || 'Motorcycle product');
  const brand = product?.brand ? `${product.brand} ` : '';
  if (variant === 'gallery') {
    return `${brand}${name} — image ${index + 1}`;
  }
  return `${brand}${name} — motorcycle accessory photo`;
};

export const categoryImageAlt = (label) =>
  `${stripHtml(label || 'Category')} — shop motorcycle gear at MotoGearsPitstop`;
