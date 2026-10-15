export const formatUserPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '—';
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length !== 10) return digits;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
};

export const formatUserEmail = (email) => {
  const value = String(email || '').trim();
  return value || 'Not provided';
};
