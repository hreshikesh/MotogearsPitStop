/** Keep at most 10 national digits (strips leading 91 if present). */
export const toIndianLocalDigits = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length <= 10) return digits.slice(0, 10);
  if (digits.startsWith('91') && digits.length >= 12) return digits.slice(2, 12);
  return digits.slice(-10);
};
