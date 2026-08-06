import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { productUrl, productsUrl } from '@/utils/urlUtils';
import { getProductImage, handleProductImageError } from '@/utils/imageUtils';

const NewArrivals = () => {
  const newArrivalProducts = [
    { name: 'Royal Enfield SUM GUARD FOR HIMALAYAN 450' },
    { name: 'MADDOG Alpha Combo Aux Light 80 Watts' },
    { name: 'Cardo Packtalk Special Edition Intercom (PTN00010)' },
    { name: 'BMW R1300 GS Top Box & Pannier Set' },
  ];

  const newProducts = newArrivalProducts.flatMap((displayProduct) => {
    const product = products.find((p) => p.name === displayProduct.name);
    return product ? [{ ...product, ...displayProduct, isNew: true }] : [];
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({ title: 'Added to cart!', description: `${product.name} added.` });
  };

  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden border-y border-gray-100">
      {/* Dot pattern bg */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ══════ HEADER ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
                <Sparkles size={11} /> Just Dropped
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              New{' '}
              <span className="relative inline-block">
                <span className="text-red-600">Arrivals</span>
                <motion.span
                  className="absolute inset-x-0 bottom-1 h-2 bg-red-500/25"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-md">
              Fresh gear, this week. Grab them before they sell out.
            </p>
          </div>

          <Link to={productsUrl({ filter: 'new' })} className="hidden md:block">
            <button className="inline-flex items-center gap-2 group text-gray-900 hover:text-white bg-transparent hover:bg-red-600 border-2 border-gray-900 hover:border-red-600 font-bold uppercase tracking-widest text-xs lg:text-sm px-6 py-3 rounded-full transition-all duration-300">
              View All
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>

        {/* ══════ GRID: 2 mobile / 2 tablet / 4 desktop ══════ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {newProducts.map((product, idx) => {
            const originalPrice = Math.round(product.price / (1 - product.discount / 100));
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                <Link to={productUrl(product)} className="block">
                  {/* ── IMAGE CONTAINER ── */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-100 mb-3 sm:mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-red-600/10 group-hover:border-red-200 transition-all duration-500">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => handleProductImageError(e, product)}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Top-left: NEW badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                      <div className="inline-flex items-center gap-1 bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-full shadow-lg shadow-red-600/40">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        NEW
                      </div>
                    </div>

                    {/* Top-right: Item number */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                      <span className="text-gray-400 font-mono text-[9px] sm:text-[10px] font-bold tabular-nums bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        /0{idx + 1}
                      </span>
                    </div>

                    {/* Hover overlay with action buttons (DESKTOP) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden sm:flex items-end justify-center gap-2 pb-4">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-11 h-11 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl transform translate-y-6 group-hover:translate-y-0 hover:scale-110"
                        title="Add to cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                      <Link
                        to={productUrl(product)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-11 h-11 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl transform translate-y-6 group-hover:translate-y-0 delay-75 hover:scale-110"
                        title="Quick view"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>

                    {/* Corner accents on hover */}
                    <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-red-500 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                      <div className="absolute bottom-0 right-0 w-full h-[2px] bg-red-500 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                      <div className="absolute bottom-0 right-0 h-full w-[2px] bg-red-500 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100" />
                    </div>
                  </div>

                  {/* ── PRODUCT INFO ── */}
                  <div className="px-1">
                    {/* Brand */}
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-mono font-bold uppercase tracking-widest mb-1 truncate">
                      {product.brand}
                    </p>

                    {/* Name */}
                    <h3 className="text-gray-900 font-bold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-300 text-[13px] sm:text-sm lg:text-base min-h-[36px] sm:min-h-[40px] mb-2 sm:mb-3">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tabular-nums">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through decoration-red-500/50 tabular-nums">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Animated bottom bar */}
                    <div className="h-[2px] w-full bg-gray-100 overflow-hidden rounded-full mb-3">
                      <div className="h-full w-0 group-hover:w-full bg-red-600 transition-all duration-700 ease-out" />
                    </div>

                    {/* Add to cart button (mobile) */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="sm:hidden w-full inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] py-2.5 rounded-full transition-all duration-300 active:scale-95"
                    >
                      <ShoppingCart size={12} />
                      Add
                    </button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ══════ MOBILE VIEW ALL ══════ */}
        <div className="mt-8 md:hidden">
          <Link to={productsUrl({ filter: 'new' })} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 text-white bg-gray-900 hover:bg-red-600 font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-colors duration-300 group">
              View All New Arrivals
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;