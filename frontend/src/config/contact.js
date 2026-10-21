export const SUPPORT_PHONE_DISPLAY = '+91 63619 11949';
export const SUPPORT_WHATSAPP_NUMBER = '916361911949';

export const INSTAGRAM_URL = 'https://www.instagram.com/motogearpitstop/';
export const INSTAGRAM_FOLLOW_LABEL = 'Follow';

export const getWhatsAppUrl = (message) => {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}${query}`;
};
