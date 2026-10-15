// frontend/src/pages/Cart.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useOrderStore from '@/store/orderStore';
import { FIRST_PURCHASE_PROMO } from '@/config/promotions';
import { calculateOrderPricing } from '@/utils/orderPricing';
import { getProductImage, handleProductImageError } from '@/utils/imageUtils';
import { products } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';
import { productUrl } from '@/utils/urlUtils';

const ADD_ON_MAX_PRICE = 500;

const getItemId = (item) => item?.product?._id || item?.product?.id || item?._id || item?.id;
const getItemName = (item) => item?.product?.name || item?.name || 'Product';
const getItemProduct = (item) => item?.product || item;
const getItemImage = (item) => getProductImage(getItemProduct(item));
const getItemPrice = (item) => Number(item?.price ?? item?.product?.discountPrice ?? item?.product?.price ?? 0);
const formatINR = (value = 0) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const addOnScore = (product) =>
  (Number(product.rating) || 0) * (Number(product.reviews) || 0) + (Number(product.rating) || 0) * 100;

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, updateQuantity, removeFromCart, getCartTotal, addToCart } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchFirstPurchaseEligibility = useOrderStore((state) => state.fetchFirstPurchaseEligibility);
  const [firstPurchaseEligible, setFirstPurchaseEligible] = useState(false);

  const itemsTotal = getCartTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const pricing = calculateOrderPricing(itemsTotal, { firstPurchaseEligible });

  const addOnProducts = useMemo(() => {
    const cartIds = new Set(items.map((item) => String(getItemId(item))));
    return products
      .filter(
        (product) =>
          product?.price > 0 &&
          product.price <= ADD_ON_MAX_PRICE &&
          !cartIds.has(String(product.id))
      )
      .sort((a, b) => addOnScore(b) - addOnScore(a))
      .slice(0, 6);
  }, [items]);

  const handleAddOn = (product) => {
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your order.`,
    });
  };

  useEffect(() => {
    let active = true;

    const loadEligibility = async () => {
      if (!isAuthenticated) {
        if (active) setFirstPurchaseEligible(false);
        return;
      }

      const result = await fetchFirstPurchaseEligibility();
      if (active) setFirstPurchaseEligible(result.eligible);
    };

    loadEligibility();
    return () => {
      active = false;
    };
  }, [isAuthenticated, fetchFirstPurchaseEligibility]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 px-4 pb-12">
        <div className="max-w-[900px] mx-auto text-center py-16">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-[#e63946]">
            <ShoppingBag size={38} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add riding gear and accessories to see them here.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-[#e63946] px-8 py-3 font-bold text-white transition-colors hover:bg-[#d62839]"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 px-4 pb-12">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemId = getItemId(item);
              const price = getItemPrice(item);

              return (
                <div
                  key={itemId}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
                >
                  <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
                    {getItemImage(item) ? (
                      <img
                        src={getItemImage(item)}
                        alt={getItemName(item)}
                        onError={(event) => handleProductImageError(event, getItemProduct(item))}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag size={28} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="line-clamp-2 font-bold text-gray-900">{getItemName(item)}</h2>
                        <p className="mt-1 font-bold text-gray-900">{formatINR(price)}</p>
                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#e63946]"
                        aria-label={`Remove ${getItemName(item)} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                          aria-label={`Decrease quantity for ${getItemName(item)}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                          aria-label={`Increase quantity for ${getItemName(item)}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-left font-bold text-gray-900 sm:text-right">
                        {formatINR(price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {addOnProducts.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-end">
                  <h2 className="font-bold text-gray-900">Everyone love these too..!</h2>
                </div>
                <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:thin]">
                  {addOnProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex w-[168px] shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:w-[180px]"
                    >
                      <Link
                        to={productUrl(product)}
                        className="mb-2 aspect-square w-full overflow-hidden rounded-md bg-gray-100"
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(event) => handleProductImageError(event, product)}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <Link
                        to={productUrl(product)}
                        className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900 hover:text-[#e63946]"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm font-bold text-black">
                        {formatINR(product.price)}
                      </p>
                      {(product.rating > 0 || product.reviews > 0) && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {product.rating ? `${product.rating}★` : ''}
                          {product.reviews ? ` · ${product.reviews} reviews` : ''}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAddOn(product)}
                        className="mt-auto pt-2 rounded-full bg-[#0a0a0a] px-2 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black"
                      >
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between gap-4">
                  <span>Items ({itemCount})</span>
                  <span>{formatINR(pricing.itemsTotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Delivery charge</span>
                  <span>{pricing.deliveryCharge === 0 ? 'FREE' : formatINR(pricing.deliveryCharge)}</span>
                </div>
                {firstPurchaseEligible && pricing.firstPurchaseDiscount > 0 && (
                  <div className="flex justify-between gap-4 text-green-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Tag size={14} />
                      First purchase ({FIRST_PURCHASE_PROMO.discountPercent}%)
                    </span>
                    <span className="font-bold">-{formatINR(pricing.firstPurchaseDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-gray-900">{formatINR(pricing.total)}</span>
                </div>
              </div>

              {firstPurchaseEligible && pricing.firstPurchaseDiscount > 0 && (
                <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs leading-relaxed text-green-800">
                  Welcome offer applied automatically: {FIRST_PURCHASE_PROMO.discountPercent}% off your first
                  order (max Rs. {FIRST_PURCHASE_PROMO.maxDiscountRs.toLocaleString('en-IN')}).
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full rounded-full bg-[#0a0a0a] px-6 py-3 font-bold text-white transition-colors hover:bg-black"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-bold text-gray-900 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
