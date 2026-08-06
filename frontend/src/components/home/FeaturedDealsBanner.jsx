import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowUpRight, Flame } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { productUrl, productsUrl } from '@/utils/urlUtils';
import { getProductImage, handleProductImageError } from '@/utils/imageUtils';

const FeaturedDealsBanner = () => {
  const finalBlastProducts = [
    { name: 'STUDDS Thunder Black' },
    { name: 'Royal Enfield SUM GUARD FOR HIMALAYAN 450' },
    { name: 'Bark Buster Metal HandGuard(Black) - HAND PROTECTOR for universal motorycles HD33B' },
    { name: 'MADDOG Alpha Combo Aux Light 80 Watts' },
    { name: 'MODERN TECH YAMAHA XSR 155 HEAD LIGHT GRILL' },
    { name: 'Pro Taper Sport Bike handle Grip' },
  ];

  const dealProducts = finalBlastProducts.flatMap((displayProduct) => {
    const product = products.find((p) => p.name === displayProduct.name);
    return product ? [{ ...product, ...displayProduct }] : [];
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} added to cart.`,
    });
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden border-y border-gray-100">
      {/* subtle dot pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #e63946 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
                <Flame size={12} className="text-red-600" /> Limited Time Offer
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              FINAL <span className="text-red-600">BLAST</span>
            </motion.h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
              Unbeatable deals on best-selling gear. Grab them before they're gone.
            </p>
          </div>

          <Link to={productsUrl({ filter: 'deals' })} className="hidden md:block">
            <button className="inline-flex items-center gap-2 group text-gray-900 hover:text-white bg-transparent hover:bg-red-600 border-2 border-gray-900 hover:border-red-600 font-bold uppercase tracking-widest text-xs lg:text-sm px-6 py-3.5 rounded-full transition-all duration-300">
              View All Deals
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </div>

        {/* GRID - 2 mobile | 3 tablet | 6 desktop (no orphan) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {dealProducts.map((product, idx) => {
            const originalPrice = Math.round(product.price / (1 - product.discount / 100));
            return (
              <motion.div
                key={`${product.id}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-500"
              >
                <Link to={productUrl(product)} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => handleProductImageError(event, product)}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-1 rounded-full shadow-lg shadow-red-600/30">
                        {product.discount}% OFF
                      </div>
                    )}
                    {/* Rating pill */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-md border border-gray-100 text-gray-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      {product.rating}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono font-bold uppercase tracking-widest truncate">
                      {product.brand}
                    </span>

                    <h3
                      className="text-gray-900 font-bold leading-tight line-clamp-2 mt-1 group-hover:text-red-600 transition-colors duration-300 text-[13px] sm:text-sm lg:text-[15px] min-h-[36px] sm:min-h-[40px]"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-3">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base sm:text-lg lg:text-xl font-black text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[11px] sm:text-xs text-gray-400 line-through decoration-red-500/50">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-900 group-hover:bg-red-600 text-white font-bold uppercase tracking-widest text-[11px] sm:text-xs py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-600/25 active:scale-[0.98]"
                      >
                        <ShoppingCart size={14} className="shrink-0" />
                        <span className="hidden sm:inline">Add To Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                </Link>

                {/* bottom red bar */}
                <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
                  <div className="h-full w-0 group-hover:w-full bg-red-600 transition-all duration-700 ease-out" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-6">
          <Link to={productsUrl({ filter: 'deals' })} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-colors duration-300 group">
              View All Deals
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDealsBanner;