import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mountain, MapPin, Compass, Package, Navigation } from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';

const SUB_CATEGORIES = [
  {
    name: 'Saddle Bags',
    icon: Package,
    count: '45+',
    img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423032/Saddle_Bags_mul05z.webp',
  },
  {
    name: 'Tank Bags',
    icon: Package,
    count: '32+',
    img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423033/Tank_Bags_nnjcib.webp',
  },
  {
    name: 'Top Boxes',
    icon: Package,
    count: '28+',
    img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423035/Top_Boxes_eoudzq.webp',
  },
  {
    name: 'Mounts',
    icon: Navigation,
    count: '55+',
    img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423031/Mounts_p5dtfw.webp',
  },
];

const STATS = [
  { value: '10K+', label: 'Kilometers Ready', icon: MapPin },
  { value: '50+', label: 'Countries Tested', icon: Compass },
  { value: '2000+', label: 'Happy Riders', icon: Mountain },
];

const TouringShowcase = () => {
  return (
    <section className="relative py-14 sm:py-16 lg:py-24 bg-white overflow-hidden border-y border-gray-100">
      {/* Racing stripes */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />

      {/* Dot bg */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════ HEADER ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
                <Mountain size={12} /> Long-Haul Ready
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Touring{' '}
              <span className="relative inline-block">
                <span className="text-red-600">Essentials</span>
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
          </div>
        </motion.div>

        {/* ═══════ HERO PANEL ═══════ */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[500px] sm:h-[600px] lg:h-[640px] shadow-2xl border-2 border-gray-900 group">
          {/* Background image */}
          <motion.img
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            src="https://res.cloudinary.com/twjztvms/image/upload/v1784022518/touring_fbhs8o.jpg"
            alt="Adventure Touring"
            className="w-full h-full object-cover"
          />

          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Top-left: LIVE badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-red-500/40 rounded-full px-3 py-1.5 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Featured Collection
            </div>
          </div>

          {/* Top-right: Coordinates badge (cool detail) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 hidden sm:block">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white/70 text-[10px] font-mono uppercase tracking-widest">
              <Compass size={11} className="text-red-400" />
              N 34°21' · E 78°12'
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500" />
            <div className="absolute top-0 left-0 h-full w-[2px] bg-red-500" />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-red-500" />
            <div className="absolute bottom-0 right-0 h-full w-[2px] bg-red-500" />
          </div>

          {/* Vertical text right side */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 hidden lg:block z-10">
            <div
              className="text-white/40 text-[10px] font-mono uppercase tracking-[0.5em] font-bold"
              style={{ writingMode: 'vertical-rl' }}
            >
              Adventure · Since 2019
            </div>
          </div>

          {/* Watermark background number */}
          <div className="absolute inset-0 flex items-center justify-end pr-6 lg:pr-24 pointer-events-none overflow-hidden">
            <span
              className="text-white/[0.05] font-black uppercase whitespace-nowrap select-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(10rem, 20vw, 22rem)',
                lineHeight: 0.85,
                WebkitTextStroke: '2px rgba(239,68,68,0.15)',
              }}
            >
              10K
            </span>
          </div>

          {/* CONTENT */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 lg:px-16 z-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-3 sm:mb-4"
              >


              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.85] uppercase tracking-tight mb-4 sm:mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Adventure <br />
                <span className="text-red-500">Touring</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg leading-relaxed"
              >
                Aluminum panniers, tank bags, comfort seats, and navigation mounts —
                engineered for <span className="text-red-400 font-bold">cross-country expeditions</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link
                  to={productsUrl({ category: 'Touring' })}
                  className="group/cta relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs px-6 py-3.5 rounded-full shadow-lg shadow-red-600/40 hover:shadow-red-600/70 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                  <span className="relative">Shop Touring Gear</span>
                  <ArrowUpRight size={14} className="relative group-hover/cta:rotate-45 transition-transform duration-300" />
                </Link>

                <Link
                  to={productsUrl({ category: 'Touring', subcategory: 'Luggage' })}
                  className="group inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-red-500 bg-white/5 hover:bg-red-600/10 backdrop-blur-sm text-white font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-full transition-all duration-300"
                >
                  <span>View Luggage Systems</span>
                  <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                </Link>
              </motion.div>

              {/* STATS ROW */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 sm:mt-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg"
              >
                {STATS.map((stat, i) => (
                  <div key={i} className="text-left">
                    <div className="flex items-center gap-1.5 text-red-400 mb-1">
                      <stat.icon size={11} />
                      <span className="text-[9px] font-mono uppercase tracking-widest hidden sm:inline">
                        {stat.label.split(' ')[0]}
                      </span>
                    </div>
                    <div
                      className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-widest font-medium mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ═══════ SUB-CATEGORIES STRIP ═══════ */}
        <div className="mt-6 sm:mt-8">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-red-600/40 to-transparent" />
            <span className="text-gray-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-bold">
              Explore By Category
            </span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-red-600/40 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {SUB_CATEGORIES.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={productsUrl({ category: 'Touring', subcategory: item.name })}
                  className="group relative block h-36 sm:h-44 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-600/15 border border-gray-100 hover:border-red-200 transition-all duration-500"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-95 group-hover:brightness-100"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x400/f5f5f5/dc2626?text=' + encodeURIComponent(item.name);
                    }}
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />

                  {/* Red hover tint */}
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-500" />

                  {/* Top: count */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-white/70 text-[10px] font-mono font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                      {item.count}
                    </span>
                  </div>

                  {/* Top-right: arrow */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-400 group-hover:bg-red-600 group-hover:border-red-600">
                      <ArrowUpRight size={12} className="text-white" />
                    </div>
                  </div>

                  {/* Bottom: name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                    <div className="h-[2px] w-6 bg-red-500 mb-1.5 origin-left group-hover:w-10 transition-all duration-500" />
                    <h3
                      className="text-white font-black uppercase tracking-tight leading-none text-lg sm:text-xl md:text-2xl group-hover:text-red-400 transition-colors duration-300"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <div className="absolute top-0 left-0 h-full w-[2px] bg-red-500 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TouringShowcase;