/**
 * Authoritative business details sourced from site copy (Footer, Contact).
 * See docs/LOCAL_SEO_SETUP.md for fields requiring owner confirmation.
 */
export const BUSINESS_NAME = 'MotoGearsPitstop';
export const BUSINESS_LEGAL_NAME = 'MotoGearsPitstop';

export const BUSINESS_ADDRESS = {
  streetAddress: 'No.301, Varthur Main Rd, next to Dmart, Narayanswamy Layout, Siddapura',
  addressLocality: 'Whitefield, Bengaluru',
  addressRegion: 'Karnataka',
  postalCode: '560066',
  addressCountry: 'IN',
};

export const BUSINESS_ADDRESS_LINES = [
  'No.301, Varthur Main Rd, next to Dmart,',
  'Narayanswamy Layout, Siddapura,',
  'Whitefield, Bengaluru,',
  'Karnataka 560066',
];

export const BUSINESS_PHONE_DISPLAY = '+91 63619 11949';
export const BUSINESS_PHONE_E164 = '+916361911949';

/** Primary email on Contact page */
export const BUSINESS_EMAIL_PRIMARY = 'support@motogearspitstop.com';
/** Alternate email shown in Footer — confirm which is canonical */
export const BUSINESS_EMAIL_FOOTER = 'support@motogears.com';

export const BUSINESS_HOURS = [
  { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '20:00' },
  { dayOfWeek: ['Sunday'], opens: '11:00', closes: '18:00' },
];

export const BUSINESS_HOURS_TEXT = {
  weekday: 'Mon – Sat: 10:00 AM – 8:00 PM',
  sunday: 'Sunday: 11:00 AM – 6:00 PM',
};

export const SOCIAL_PROFILES = {
  instagram: 'https://www.instagram.com/motogearpitstop/',
};

export const STORE_LOCATION_PATH = '/motorcycle-accessories-store-whitefield-bengaluru';

export const getGoogleMapsDirectionsUrl = () => {
  const query = [
    BUSINESS_ADDRESS.streetAddress,
    BUSINESS_ADDRESS.addressLocality,
    BUSINESS_ADDRESS.addressRegion,
    BUSINESS_ADDRESS.postalCode,
    'India',
  ].join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
