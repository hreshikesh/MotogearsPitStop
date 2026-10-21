/**
 * Optional GA4 — set VITE_GA4_MEASUREMENT_ID at build time.
 * Does not send PII; ecommerce helpers use transaction id + INR value only.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

let initialized = false;

export const initAnalytics = () => {
  if (initialized || !MEASUREMENT_ID || typeof window === 'undefined') return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
};

export const trackPageView = (path, title) => {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
};

export const trackEcommerce = (eventName, params) => {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', eventName, params);
};

export const trackViewItem = (product) => {
  if (!product) return;
  trackEcommerce('view_item', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: String(product.id ?? product._id),
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      price: product.price,
    }],
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  trackEcommerce('add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [{
      item_id: String(product.id ?? product._id),
      item_name: product.name,
      quantity,
      price: product.price,
    }],
  });
};

export const trackBeginCheckout = (items, value) => {
  trackEcommerce('begin_checkout', {
    currency: 'INR',
    value,
    items: items.map((item) => ({
      item_id: String(item.id ?? item._id),
      item_name: item.name,
      quantity: item.quantity ?? 1,
      price: item.price,
    })),
  });
};

/** Call once per completed order with server-confirmed transaction id */
export const trackPurchase = ({ transactionId, value, items }) => {
  if (!transactionId) return;
  trackEcommerce('purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value,
    items: items.map((item) => ({
      item_id: String(item.id ?? item._id),
      item_name: item.name,
      quantity: item.quantity ?? 1,
      price: item.price,
    })),
  });
};
