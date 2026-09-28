import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { productsUrl } from '@/utils/urlUtils';

const BRANDS = [
  {
    name: 'Maddog',
    tagline: 'Illuminate The Ride',
    description: 'Premium auxiliary lighting and mounting systems engineered for extreme adventure and touring.',
    products: '45+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/maddog_bqfpeb_ljtljq.png',
    params: { brand: 'Maddog' },
  },
  {
    name: 'Red Rooster',
    tagline: 'Performance Exhausts',
    description: 'Race-inspired stainless steel exhausts engineered for optimal backpressure and performance.',
    products: '30+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/red-rooster-performance-international-pvt-ltd-cheemasandra-bangalore-sports-bike-exhaust-dealers_yzni94.avif',
    params: { search: 'Red Rooster' },
  },
  {
    name: 'FuelX Pro+',
    tagline: 'Ride Smarter',
    description: 'Plug-and-play electronic fuel management systems for optimized torque and engine efficiency.',
    products: '20+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/fuel_x_c7c6v5_fly1fq.png',
    params: { search: 'FuelX Pro+' },
  },
  {
    name: 'Vesrah',
    tagline: 'Stop With Confidence',
    description: 'Precision Japanese brake pads designed for maximum bite, thermal resistance, and longevity.',
    products: '25+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/VESRAH-1_qjbosf_ravfvn.jpg',
    params: { search: 'Vesrah Brake pads' },
  },
  {
    name: 'BluArmor',
    tagline: 'Ride Cool',
    description: 'Advanced helmet cooling and ventilation technology built specifically for hot conditions.',
    products: '15+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/bluarmor_zwpmjb.webp',
    params: { brand: 'BluArmor' },
  },
  {
    name: 'EJEAS',
    tagline: 'Stay Connected',
    description: 'Long-range Bluetooth mesh intercoms for seamless group communications on every ride.',
    products: '18+ Products',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790580973/EJAEA_ktdezx_hvvvlp.webp',
    params: { brand: 'EJEAS Intercom' },
  },
];

const AUTO_ROTATE_MS = 5000;

// Progress Indicator Line
const ProgressBar = ({ duration, isActive, isPaused }) => (
  <div className="relative h-1 w-full bg-neutral-700 overflow-hidden rounded-full">
    {isActive && (
      <motion.div
        key={`p-${isActive}-${isPaused}`}
        className="absolute inset-y-0 left-0 bg-red-600"
        initial={{ width: '0%' }}
        animate={{ width: isPaused ? undefined : '100%' }}
        transition={{ duration: isPaused ? 0 : duration / 1000, ease: 'linear' }}
      />
    )}
  </div>
);

const ShopBySpecificBrands = () => {
  const navigate = useNavigate();
  const clearFilters = useFilterStore((state) => state.clearFilters);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const activeBrand = BRANDS[activeIndex];

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BRANDS.length);
    }, AUTO_ROTATE_MS);
  }, []);

  useEffect(() => {
    if (!isPaused) startInterval();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, startInterval]);

  const handleSelect = useCallback(
    (idx) => {
      setActiveIndex(idx);
      startInterval();
    },
    [startInterval]
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % BRANDS.length);
    startInterval();
  }, [startInterval]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + BRANDS.length) % BRANDS.length);
    startInterval();
  }, [startInterval]);

  const handleShop = useCallback(
    (brand) => {
      clearFilters();
      navigate(productsUrl(brand.params));
    },
    [clearFilters, navigate]
  );

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/800x600/f3f4f6/dc2626?text=BRAND+IMAGE';
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-24 bg-neutral-50 text-neutral-900 overflow-hidden">
      {/* Background Accent Mesh (Light Mode Subtle Glow) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neutral-300/40 rounded-full filter blur-[140px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════ HEADER ═══════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-red-600 font-mono text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                Premier Brands
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 uppercase">
              Shop by <span className="text-red-600 underline decoration-red-600/30 decoration-4 underline-offset-8">Official Brand</span>
            </h2>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 hover:border-red-600 text-neutral-700 hover:text-neutral-900 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
              aria-label={isPaused ? 'Play Slideshow' : 'Pause Slideshow'}
            >
              {isPaused ? <Play size={13} className="text-red-600 fill-red-600" /> : <Pause size={13} className="text-red-600 fill-red-600" />}
              <span>{isPaused ? 'Play' : 'Pause'}</span>
            </button>

            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-1 shadow-sm">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Previous Brand"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-mono text-xs font-semibold text-neutral-500">
                {String(activeIndex + 1).padStart(2, '0')}/{String(BRANDS.length).padStart(2, '0')}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Next Brand"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════ MAIN SHOWCASE STAGE ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
          
          {/* ─── LEFT: Hero Banner (7 Columns) ─── */}
          <div
            onClick={() => handleShop(activeBrand)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="lg:col-span-7 relative bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 shadow-xl min-h-[420px] sm:min-h-[500px] flex flex-col justify-end cursor-pointer group"
          >
            {/* Background Image Showcase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <img
                  src={activeBrand.image}
                  alt={activeBrand.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* High-Contrast Dark Gradient Overlay for Banner Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Quick Badges */}
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="bg-white/95 backdrop-blur-md border border-neutral-200 rounded-full px-3.5 py-1 text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <ShieldCheck size={14} className="text-red-600" /> Authorized Dealer
              </span>
            </div>

            {/* Content Overlays */}
            <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${activeIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="inline-block text-red-500 font-mono text-xs font-bold uppercase tracking-widest mb-1">
                    {activeBrand.tagline}
                  </span>

                  <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-3">
                    {activeBrand.name}
                  </h3>

                  <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-6 line-clamp-2">
                    {activeBrand.description}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShop(activeBrand);
                      }}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/30 group/btn"
                    >
                      <span>Explore Catalog</span>
                      <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                    </button>

                    <span className="text-neutral-200 font-mono text-xs uppercase tracking-wider bg-black/50 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-lg">
                      {activeBrand.products} Available
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ─── RIGHT: Interactive Brand Selector (5 Columns) ─── */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-3 sm:p-4 flex flex-col justify-between">
            <div className="divide-y divide-neutral-100">
              {BRANDS.map((brand, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div key={brand.name} className="py-1.5 first:pt-0 last:pb-0">
                    <button
                      onMouseEnter={() => handleSelect(idx)}
                      onClick={() => handleShop(brand)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 group ${
                        isActive
                          ? 'bg-red-900 text-white shadow-lg border border-neutral-800'
                          : 'hover:bg-neutral-100/80 text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {/* Left: Thumbnail & Brand Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img
                            src={brand.image}
                            alt={brand.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-extrabold uppercase text-base sm:text-lg tracking-tight truncate ${
                                isActive ? 'text-white' : 'text-neutral-900 group-hover:text-black'
                              }`}
                            >
                              {brand.name}
                            </h4>
                            {isActive && (
                              <span className="h-2 w-2 rounded-full bg-red-600 shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              isActive ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {brand.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Right: Product Count & Arrow Indicator */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`hidden sm:inline-block font-mono text-[11px] ${
                            isActive ? 'text-neutral-400' : 'text-neutral-400 group-hover:text-neutral-600'
                          }`}
                        >
                          {brand.products}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-red-600 text-white'
                              : 'bg-neutral-100 text-neutral-400 group-hover:text-white group-hover:bg-neutral-900'
                          }`}
                        >
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </button>

                    {/* Progress Bar under active item */}
                    {isActive && (
                      <div className="px-3.5 pt-1.5">
                        <ProgressBar duration={AUTO_ROTATE_MS} isActive={true} isPaused={isPaused} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ═══════ TRUST & VALUE PROPOSITION BAR ═══════ */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 text-red-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">100% Genuine</h5>
                <p className="text-[11px] text-neutral-500">Direct Brand Sourced</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 text-red-600 shadow-sm">
                <Truck size={20} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">Express Delivery</h5>
                <p className="text-[11px] text-neutral-500">Pan-India Shipping</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 text-red-600 shadow-sm">
                <RotateCcw size={20} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">Easy Returns</h5>
                <p className="text-[11px] text-neutral-500">Hassle-Free Support</p>
              </div>
            </div>
          </div>

          {/* All Brands CTA */}
          <button
            onClick={() => navigate('/products')}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-bold uppercase text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>View All Partner Brands</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ShopBySpecificBrands);