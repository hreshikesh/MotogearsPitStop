import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass } from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';


const optimizeImg = (url) => url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');

const CATEGORIES = [
  {
    name: 'Adventure',
    tagline: 'Conquer Any Terrain',
    count: '220+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420462/adventure_hrdho6.avif'),
    link: productsUrl({ category: 'Touring' }),
  },
  {
    name: 'Street',
    tagline: 'Urban Domination',
    count: '180+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420587/street_pppvcx.avif'),
    link: productsUrl({ category: 'Riding Gear' }),
  },
  {
    name: 'Cruiser',
    tagline: 'Ride In Style',
    count: '150+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420463/cruiser_gwzswk.avif'),
    link: productsUrl({ category: 'Bike Accessories' }),
  },
  {
    name: 'Sport',
    tagline: 'Track Ready',
    count: '300+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420537/sports_p8ejgv.jpg'),
    link: productsUrl({ category: 'Performance Parts' }),
  },
  {
    name: 'Classic',
    tagline: 'Timeless Legacy',
    count: '120+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420465/classic_a7txjw.jpg'),
    link: productsUrl({ category: 'Riding Gear' }),
  },
  {
    name: 'Scooter',
    tagline: 'Everyday Freedom',
    count: '90+',
    img: optimizeImg('https://res.cloudinary.com/rteryyle/image/upload/v1790420533/scooter_dnipvx.avif'),
    link: productsUrl({ category: 'Bike Accessories' }),
  },
];

const ShopByBikeShowcase = () => {
  return (
    <section className="relative py-14 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden border-y border-gray-100">
      {/* Racing stripes */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />

      {/* Dot bg */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════ HEADER ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-3 sm:mb-4">
            <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
            <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
              <Compass size={12} /> Ride Category
            </span>
            <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-none tracking-tight uppercase mb-3 sm:mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Choose Your{' '}
            <span className="relative inline-block">
              <span className="text-red-600">Ride</span>
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

          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Six styles. One passion. Find parts perfectly matched to your machine.
          </p>
        </motion.div>

        {/* ═══════ CIRCULAR SELECTOR GRID ═══════ */}
        {/* `group/grid` allows pure CSS dimming of non-hovered siblings */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6 group/grid">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="transition-opacity duration-300 group-hover/grid:opacity-40 hover:!opacity-100 transform-gpu"
            >
              <Link to={cat.link} className="group flex flex-col items-center gap-4 sm:gap-5">
                {/* ── Circular Image Container with Orbital Rings ── */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-40 lg:h-40 xl:w-44 xl:h-44">
                  
                  {/* Outer rotating orbital ring (GPU CSS Spin on Hover) */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-600/20 group-hover:border-red-600/50 group-hover:animate-[spin_8s_linear_infinite] transition-colors duration-300 transform-gpu" />

                  {/* Middle ring (CSS Pulse on Hover) */}
                  <div className="absolute inset-2 rounded-full border-2 border-black/10 group-hover:border-red-600 group-hover:animate-pulse transition-colors duration-300 transform-gpu" />

                  {/* Image circle */}
                  <div className="absolute inset-4 rounded-full overflow-hidden bg-white shadow-lg group-hover:shadow-2xl group-hover:shadow-red-600/20 transition-all duration-500 transform-gpu">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 transform-gpu"
                    />

                    {/* Red overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

                    {/* Arrow icon reveal on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 -rotate-90 scale-50 group-hover:rotate-0 group-hover:scale-100 transition-all duration-300 ease-out transform-gpu">
                        <ArrowUpRight size={20} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Corner compass dots (CSS Hardware Accelerated) */}
                  {[
                    'top-1/2 -left-1 -translate-y-1/2',
                    'top-1/2 -right-1 -translate-y-1/2',
                    '-top-1 left-1/2 -translate-x-1/2',
                    '-bottom-1 left-1/2 -translate-x-1/2',
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full bg-black/20 group-hover:bg-red-600 group-hover:scale-125 transition-all duration-300 ${pos} transform-gpu`}
                    />
                  ))}
                </div>

                {/* ── Text Content ── */}
                <div className="text-center w-full">
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-gray-900 group-hover:text-red-600 transition-colors duration-300"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {cat.name}
                  </h3>

                  {/* Divider line */}
                  <div className="h-[2px] mx-auto mt-2 mb-2 bg-red-600 rounded-full w-6 group-hover:w-12 transition-all duration-300" />

                  {/* Tagline / Count swap via CSS transitions (No JS layout shifts) */}
                  <div className="relative h-4 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-mono uppercase tracking-widest transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                      {cat.count} Products
                    </p>
                    <p className="absolute inset-0 text-[10px] sm:text-xs text-red-600 font-mono uppercase tracking-widest font-bold transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ═══════ BOTTOM INFO STRIP ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-gray-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest">
            <span className="h-3 w-[1px] bg-gray-300" />
            <span>6 Categories · 600+ Products</span>
          </div>

          <Link to="/products">
            <button className="group inline-flex items-center gap-2 text-gray-900 hover:text-white bg-transparent hover:bg-red-600 border-2 border-gray-900 hover:border-red-600 font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-full transition-all duration-300">
              Browse All Categories
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByBikeShowcase;