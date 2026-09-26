import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';

const COLLECTIONS = [
  {
    title: 'ADVENTURE',
    subtitle: 'Touring Essentials',
    description: 'Gear up for the long haul.',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420710/touringessential_ydqs83.jpg',
    colSpan: 'lg:col-span-2',
    items: '240+',
    tag: 'Bestseller',
    tagColor: 'bg-emerald-600',
    link: productsUrl({ category: 'Touring' }),
  },
  {
    title: 'URBAN',
    subtitle: 'Street Style',
    description: 'City-ready essentials.',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420708/streetstyle_kytprj.jpg',
    colSpan: 'lg:col-span-1',
    items: '150+',
    tag: 'Trending',
    tagColor: 'bg-red-600',
    link: productsUrl({ category: 'Riding Gear' }),
  },
  {
    title: 'RACING',
    subtitle: 'Track Ready',
    description: 'Race-bred performance.',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420712/track_readt_bj6yob.jpg',
    colSpan: 'lg:col-span-1',
    items: '85+',
    tag: 'Pro Series',
    tagColor: 'bg-amber-600',
    link: productsUrl({ category: 'Performance Parts' }),
  },
  {
    title: 'OFF-ROAD',
    subtitle: 'Dirt & Enduro',
    description: 'Built for the wild.',
    image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420707/dirt_zyccor.avif',
    colSpan: 'lg:col-span-2',
    items: '120+',
    tag: 'New Drop',
    tagColor: 'bg-red-600',
    link: productsUrl({ category: 'Bike Accessories' }),
  },
];

const FeaturedCollections = () => {
  return (
    <section className="relative py-14 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-red-50/30 text-slate-900 overflow-hidden">
      {/* Racing stripes */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Ambient red glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════ HEADER ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-black">
                Handpicked
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Curated{' '}
              <span className="relative inline-block">
                <span className="text-red-600">Collections</span>
                <motion.span
                  className="absolute inset-x-0 bottom-1 h-2.5 bg-red-600/20"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h2>

            <p className="text-slate-600 font-medium text-sm sm:text-base mt-3 max-w-md">
              Four collections. Every ride. Every mood. All in one place.
            </p>
          </div>

          <Link to="/products" className="hidden md:block">
            <button className="inline-flex items-center gap-2 group text-white bg-red-600 hover:bg-red-700 border-2 border-red-600 hover:border-red-700 font-bold uppercase tracking-widest text-xs lg:text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-red-600/25 active:scale-95">
              View All
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 auto-rows-[220px] sm:auto-rows-[280px] lg:auto-rows-[380px]">
          {COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: idx * 0.1,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{ y: -6 }}
              className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 hover:border-red-600/60 transition-colors duration-300 ${col.colSpan}`}
            >
              <Link to={col.link} className="block w-full h-full">
                {/* Image */}
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-all duration-[900ms] ease-out group-hover:scale-110"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:from-slate-950/90 transition-all duration-500" />

                {/* Red tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 group-hover:from-red-600/20 to-transparent transition-all duration-500" />

                {/* Top-left: Tag badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <div className={`inline-flex items-center gap-1.5 ${col.tagColor} text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-red-900/20`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {col.tag}
                  </div>
                </div>

                {/* Top-right: Collection number */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="text-slate-800 font-mono text-[10px] sm:text-xs font-bold tabular-nums bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                    /0{idx + 1}
                  </span>
                </div>

                {/* Corner red accents */}
                <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-red-600 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100" />
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-full h-[2px] bg-red-600 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="absolute bottom-0 right-0 h-full w-[2px] bg-red-600 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100" />
                </div>

                {/* Watermark for wide cards */}
                {col.colSpan === 'lg:col-span-2' && (
                  <div className="hidden lg:block absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none overflow-hidden">
                    <span
                      className="text-white/[0.08] font-black uppercase whitespace-nowrap select-none"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 'clamp(6rem, 10vw, 10rem)',
                        lineHeight: 0.8,
                        WebkitTextStroke: '1.5px rgba(220,38,38,0.25)',
                      }}
                    >
                      {col.title}
                    </span>
                  </div>
                )}

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6 z-10">
                  {/* Subtitle */}
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <div className="h-[2px] w-6 bg-red-500 origin-left group-hover:w-10 transition-all duration-500" />
                    <span className="text-red-400 font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                      {col.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-white font-black uppercase leading-none tracking-tight mb-2 sm:mb-3 transform group-hover:-translate-y-0.5 transition-transform duration-500
                              text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {col.title}
                  </h3>

                  {/* Description — only on wide cards + hover reveal */}
                  {col.colSpan === 'lg:col-span-2' && (
                    <p className="hidden lg:block text-slate-300 text-xs sm:text-sm mb-3 max-w-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {col.description}
                    </p>
                  )}

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-300 text-[10px] sm:text-xs font-medium">
                        {col.items} Products
                      </span>
                    </div>

                    {/* Shop button (desktop) */}
                    <div className="hidden sm:flex items-center gap-1.5 text-white/0 group-hover:text-white transform translate-x-2 group-hover:translate-x-0 transition-all duration-400">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white">
                        Shop
                      </span>
                      <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50">
                        <ArrowUpRight size={12} className="text-white" />
                      </div>
                    </div>

                    {/* Mobile arrow */}
                    <div className="sm:hidden">
                      <ArrowUpRight size={14} className="text-red-400" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-[2px] w-full bg-white/20 overflow-hidden rounded-full">
                    <div className="h-full w-0 group-hover:w-full bg-red-600 transition-all duration-700 ease-out" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ═══════ MOBILE VIEW ALL ═══════ */}
        <div className="md:hidden mt-6">
          <Link to="/products" className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-colors duration-300 group shadow-lg shadow-red-600/30">
              View All Collections
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </div>

        {/* ═══════ BOTTOM INFO STRIP ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 sm:mt-10 pt-6 border-t border-slate-200 flex items-center justify-center gap-3 text-slate-500 text-[10px] sm:text-xs font-mono uppercase tracking-widest"
        >
          <span className="h-3 w-[1px] bg-red-600/40" />
          <span className="font-semibold text-slate-700">4 Curated Collections · 595+ Products</span>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;