/**
 * Meta Pixel + Conversions API relay (server sends hashed PII).
 * Set VITE_META_PIXEL_ID at build time; CAPI token lives on the backend only.
 */

import api from '@/api/axiosInstance';

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

let initialized = false;

const getCookie = (name) => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const getMetaBrowserIds = () => ({
  fbp: getCookie('_fbp'),
  fbc: getCookie('_fbc'),
});

export const createMetaEventId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export const initMetaPixel = () => {
  if (initialized || !PIXEL_ID || typeof window === 'undefined') return;
  initialized = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
};

const relayMetaEvent = async ({
  eventName,
  eventId,
  customData,
  userData,
  eventSourceUrl,
}) => {
  try {
    await api.post('/meta/events', {
      events: [{
        eventName,
        eventId,
        eventSourceUrl: eventSourceUrl || window.location.href,
        eventTime: Math.floor(Date.now() / 1000),
        fbp: getMetaBrowserIds().fbp,
        fbc: getMetaBrowserIds().fbc,
        customData,
        userData: {
          ...userData,
          clientUserAgent: navigator.userAgent,
          fbp: getMetaBrowserIds().fbp,
          fbc: getMetaBrowserIds().fbc,
        },
      }],
    });
  } catch {
    // Non-blocking; Pixel still fires when configured
  }
};

export const trackMetaEvent = (eventName, customData = {}, options = {}) => {
  if (typeof window === 'undefined') return;

  const eventId = options.eventId || createMetaEventId();
  const eventSourceUrl = options.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : '');

  if (PIXEL_ID && window.fbq) {
    const pixelOptions = { eventID: options.eventId || eventId };
    window.fbq('track', eventName, customData, pixelOptions);
  }

  if (!options.skipRelay) {
    relayMetaEvent({
      eventName,
      eventId: options.eventId || eventId,
      customData,
      userData: options.userData,
      eventSourceUrl,
    });
  }

  return eventId;
};

const productContent = (product) => ({
  content_ids: [String(product.id ?? product._id)],
  content_name: product.name,
  content_type: 'product',
  content_category: product.category,
  currency: 'INR',
  value: product.price,
});

export const trackMetaViewContent = (product) => {
  if (!product) return;
  trackMetaEvent('ViewContent', productContent(product));
};

export const trackMetaSearch = (searchString) => {
  if (!searchString?.trim()) return;
  trackMetaEvent('Search', { search_string: searchString.trim() });
};

export const trackMetaAddToWishlist = (product) => {
  if (!product) return;
  trackMetaEvent('AddToWishlist', productContent(product));
};

export const trackMetaAddToCart = (product, quantity = 1) => {
  if (!product) return;
  trackMetaEvent('AddToCart', {
    ...productContent(product),
    value: product.price * quantity,
    num_items: quantity,
  });
};

export const trackMetaInitiateCheckout = (items, value) => {
  trackMetaEvent('InitiateCheckout', {
    currency: 'INR',
    value,
    content_ids: items.map((item) => String(item.id ?? item._id ?? item.productId)),
    content_type: 'product',
    num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
  });
};

export const trackMetaAddPaymentInfo = ({
  value,
  contentIds,
  orderId,
  userData,
  eventId,
}) => {
  trackMetaEvent(
    'AddPaymentInfo',
    {
      currency: 'INR',
      value,
      content_ids: contentIds,
      order_id: orderId,
    },
    { eventId, userData },
  );
};

/** Pixel only — server sends Purchase via CAPI when the order is created (same event_id). */
export const trackMetaPurchase = ({ transactionId, value, items, eventId, userData }) => {
  trackMetaEvent(
    'Purchase',
    {
      currency: 'INR',
      value,
      order_id: transactionId,
      content_ids: items.map((item) => String(item.id ?? item._id ?? item.product)),
      content_type: 'product',
      num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
    },
    { eventId, userData, skipRelay: true },
  );
};

export const trackMetaCompleteRegistration = (userData) => {
  trackMetaEvent('CompleteRegistration', { status: true }, { userData });
};

export const trackMetaContact = () => {
  trackMetaEvent('Contact');
};

export const trackMetaFindLocation = () => {
  trackMetaEvent('FindLocation');
};
