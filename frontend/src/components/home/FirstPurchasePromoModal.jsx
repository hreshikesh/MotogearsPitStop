import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Check, X } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import { FIRST_PURCHASE_PROMO } from '@/config/promotions';

const PROMO_IMAGE_SRC = '/images/first-purchase-promo.jpg?v=signup';

const FirstPurchasePromoModal = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showPromo, setShowPromo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCouponAfterLogin, setShowCouponAfterLogin] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowPromo(true);
      setShowCouponAfterLogin(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && showPromo && !showCouponAfterLogin) {
      setShowPromo(false);
    }
  }, [isAuthenticated, showPromo, showCouponAfterLogin]);

  const handleClose = () => {
    setShowPromo(false);
    setShowCouponAfterLogin(false);
  };

  const handleSignUpClick = () => {
    setShowPromo(false);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowCouponAfterLogin(true);
    setShowPromo(true);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(FIRST_PURCHASE_PROMO.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  const promoVisible =
    showPromo && (showCouponAfterLogin || !isAuthenticated);

  return (
    <>
      {promoVisible &&
        createPortal(
          <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/70 px-4 py-6">
            <button
              type="button"
              aria-label="Close offer"
              className="absolute inset-0 cursor-default"
              onClick={handleClose}
            />

            <div className="relative w-full max-w-[420px] overflow-hidden rounded-xl border border-zinc-800 bg-[#0f0f0f] shadow-2xl">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {showCouponAfterLogin && isAuthenticated ? (
                <div className="p-4 sm:p-5">
                  <div className="mb-4 overflow-hidden rounded-lg border border-zinc-800">
                    <img
                      src={PROMO_IMAGE_SRC}
                      alt="First purchase discount unlocked"
                      className="h-[155px] w-full object-cover object-top sm:h-[165px]"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Your discount is unlocked
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {FIRST_PURCHASE_PROMO.discountPercent}% off your first order (max ₹
                    {FIRST_PURCHASE_PROMO.maxDiscountRs.toLocaleString('en-IN')}) is applied
                    automatically in your cart at checkout.
                  </p>
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-[#e63946]/50 bg-zinc-900/80 px-3 py-2.5">
                    <span className="flex-1 font-mono text-base font-bold tracking-wider text-white">
                      {FIRST_PURCHASE_PROMO.couponCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#e63946] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#c1121f]"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 w-full rounded-lg bg-[#e63946] py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#c1121f]"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={PROMO_IMAGE_SRC}
                    alt="Sign up and get your first purchase discount"
                    className="h-[185px] w-full object-cover object-top sm:h-[200px]"
                  />
                  <div className="p-4 sm:p-5">
                    <p className="text-center text-xs leading-relaxed text-zinc-400 sm:text-sm">
                      Get{' '}
                      <span className="font-semibold text-white">
                        {FIRST_PURCHASE_PROMO.discountPercent}% off up to ₹
                        {FIRST_PURCHASE_PROMO.maxDiscountRs.toLocaleString('en-IN')}
                      </span>{' '}
                      on your first order. Sign up and the discount applies automatically at checkout.
                    </p>
                    <button
                      type="button"
                      onClick={handleSignUpClick}
                      className="mt-4 w-full rounded-lg bg-[#e63946] py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#e63946]/25 transition hover:bg-[#c1121f]"
                    >
                      Sign up to get discount
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mt-2 w-full py-1.5 text-xs text-zinc-500 transition hover:text-zinc-300 sm:text-sm"
                    >
                      Continue browsing
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      <AuthModal
        isOpen={showAuth}
        initialMode="register"
        onClose={() => {
          setShowAuth(false);
          if (!isAuthenticated) setShowPromo(true);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default FirstPurchasePromoModal;
