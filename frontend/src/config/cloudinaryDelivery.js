/** Cloud names that currently fail delivery (see scripts/audit-cloudinary.js). */
export const DISABLED_OR_BROKEN_CLOUDS = {
  dbplgk8d8: 'disabled',
  k4uklwi4: 'missing_or_removed',
  px1co5qc: 'missing_or_removed',
};

/**
 * Optional rewrite when assets are migrated to a new Cloudinary cloud.
 * Set VITE_CLOUDINARY_DELIVERY_CLOUD in frontend/.env (e.g. dauynokmb).
 */
export const applyCloudinaryDeliveryUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com/')) {
    return url;
  }

  const deliveryCloud = import.meta.env.VITE_CLOUDINARY_DELIVERY_CLOUD?.trim();
  if (!deliveryCloud) {
    return url;
  }

  return url.replace(
    /res\.cloudinary\.com\/dbplgk8d8\//g,
    `res.cloudinary.com/${deliveryCloud}/`
  );
};
