import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/use-toast';
import { productUrl } from '@/utils/urlUtils';
import { getProductImage, handleProductImageError } from '@/utils/imageUtils';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const productImage = getProductImage(product);

  const originalPrice = product.discount > 0
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Added to cart!',
      description: `${product.name} added to your cart.`,
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({ title: 'Removed from wishlist', description: product.name });
    } else {
      addToWishlist(product);
      toast({ title: 'Added to wishlist!', description: product.name });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500 flex flex-col h-full"
    >
      <Link to={productUrl(product)} className="flex flex-col h-full">
        {/* ═══════ IMAGE SECTION ═══════ */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            onError={(event) => handleProductImageError(event, product)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Discount badge (top-left) */}
        {/*  {product.discount > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg shadow-red-600/40">
                -{product.discount}%
              </div>
            </div>
          )}*/}

          {/* Wishlist button (top-right) */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 ${
              inWishlist
                ? 'bg-red-600 text-white'
                : 'bg-white/95 backdrop-blur-sm text-gray-600 hover:bg-red-600 hover:text-white'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={13} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={2.2} />
          </button>

          {/* Rating pill (bottom-left) */}
          {product.rating && (
            <div className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-gray-100">
              <Star size={9} className="text-amber-500 fill-amber-500" />
              <span className="tabular-nums">{product.rating}</span>
              {product.reviews > 0 && (
                <span className="text-gray-400 font-normal">({product.reviews})</span>
              )}
            </div>
          )}

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* ═══════ CONTENT SECTION ═══════ */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1">
          {/* Brand */}
          {product.brand && (
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest truncate mb-1">
              {product.brand}
            </span>
          )}

          {/* Name */}
          <h3
            className="text-gray-900 font-semibold text-[12px] sm:text-[13px] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-300 min-h-[32px] sm:min-h-[36px] mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price + Add Btn Row */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-black text-gray-900 leading-none tabular-nums">
                ₹{product.price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through decoration-red-500/50 tabular-nums mt-0.5">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add-to-cart icon button */}
            <button
              onClick={handleAddToCart}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 group-hover:bg-red-600 hover:!bg-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-red-600/40 active:scale-90"
              aria-label="Add to cart"
              title="Add to cart"
            >
              <ShoppingCart size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* Bottom red progress line */}
          <div className="mt-3 h-[2px] w-full bg-gray-100 overflow-hidden rounded-full">
            <div className="h-full w-0 group-hover:w-full bg-red-600 transition-all duration-700 ease-out" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(ProductCard);