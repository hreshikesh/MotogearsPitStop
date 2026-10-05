import Order from '../models/Order.js';

export const FIRST_PURCHASE_DISCOUNT_PERCENT = 10;
export const FIRST_PURCHASE_MAX_DISCOUNT_RS = 500;

export const calculateFirstPurchaseDiscount = (billAmount) => {
  const bill = Number(billAmount || 0);
  if (bill <= 0) return 0;
  return Math.min(
    Math.round(bill * (FIRST_PURCHASE_DISCOUNT_PERCENT / 100)),
    FIRST_PURCHASE_MAX_DISCOUNT_RS
  );
};

export const isFirstPurchaseEligible = async (userId) => {
  const existingOrder = await Order.exists({
    user: userId,
    orderStatus: { $ne: 'cancelled' }
  });
  return !existingOrder;
};
