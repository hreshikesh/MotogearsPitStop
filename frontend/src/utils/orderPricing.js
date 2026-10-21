import { FIRST_PURCHASE_PROMO } from '@/config/promotions';

export const FREE_DELIVERY_MINIMUM = 5000;
export const DELIVERY_CHARGE = 199;
export const COD_ADVANCE_PERCENTAGE = 10;

export const calculateFirstPurchaseDiscount = (billAmount) => {
  const bill = Number(billAmount || 0);
  if (bill <= 0) return 0;
  return Math.min(
    Math.round(bill * (FIRST_PURCHASE_PROMO.discountPercent / 100)),
    FIRST_PURCHASE_PROMO.maxDiscountRs
  );
};

export const calculateOrderPricing = (itemsTotal, { firstPurchaseEligible = false } = {}) => {
  const items = Number(itemsTotal || 0);
  const deliveryCharge = items >= FREE_DELIVERY_MINIMUM ? 0 : DELIVERY_CHARGE;
  const billBeforeDiscount = items + deliveryCharge;
  const firstPurchaseDiscount = firstPurchaseEligible
    ? calculateFirstPurchaseDiscount(billBeforeDiscount)
    : 0;
  const total = Math.max(billBeforeDiscount - firstPurchaseDiscount, 0);

  return {
    itemsTotal: items,
    deliveryCharge,
    billBeforeDiscount,
    firstPurchaseDiscount,
    total,
  };
};
