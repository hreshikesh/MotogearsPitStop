import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, Star } from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';

// Cloudinary optimization helper for faster load speeds
const optimizeImg = (url) => url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');

const GEARS = [
  {
    name: 'Helmets',
    tagline: 'Head Protection',
    description: 'DOT, ECE 22.06 & ISI certified helmets built for maximum impact dispersion.',
    count: '120+',
    stat: '5★ Safety',
    image: optimizeImg('https://res.cloudinary.com/twjztvms/image/upload/v1784022427/Helmet_SXE_l1sz04_c6eyqw.webp'),
  },
  {
    name: 'Jackets',
    tagline: 'Body Armor',
    description: 'CE Level 2 armor with abrasion-resistant Cordura® and mesh ventilation.',
    count: '80+',
    stat: 'CE Level 2',
    image: optimizeImg('https://res.cloudinary.com/twjztvms/image/upload/v1784022424/Raida_Jacket_itrknv_ijnycz.jpg'),
  },
  {
    name: 'Gloves',
    tagline: 'Grip & Feel',
    description: 'Knuckle protection with TPU sliders and touchscreen-compatible fingertips.',
    count: '65+',
    stat: 'All Season',
    image: optimizeImg('https://res.cloudinary.com/twjztvms/image/upload/v1784022422/GLOVES_rik2zf_gdrpwx.webp'),
  },
  {
    name: 'Boots',
    tagline: 'Ankle Support',
    description: 'Rigid shank soles with reinforced toe caps and ankle torsion control.',
    count: '45+',
    stat: 'Waterproof',
    image: optimizeImg('https://res.cloudinary.com/twjztvms/image/upload/v1784022420/Boots_kehggs_amtal1.webp'),
  },
];

const RidingGearShowcase = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-slate-50 text-gray-900 overflow-hidden border-y border-gray-200">
      {/* Top/Bottom racing red accent lines */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />

      {/* Ambient Soft Red Glow Backdrops */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ═══════ RED OUTLINE SINGLE-LINE WATERMARK ═══════ */}
      <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden select-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 0.14, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full flex items-center justify-center px-4"
        >
          <h2
            className="font-black uppercase tracking-tighter text-transparent whitespace-nowrap text-center select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(5rem, 16vw, 22rem)',
              lineHeight: 1,
              WebkitTextStroke: '2px #dc2626',
            }}
          >
            RIDE SAFE
          </h2>
        </motion.div>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* ═══════ HEADER ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-10 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                <Shield size={14} className="text-red-600" /> Armor & Protection
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Essential{' '}
              <span className="relative inline-block text-red-600">
                Riding Gear
                <motion.span
                  className="absolute inset-x-0 -bottom-1 h-2 bg-red-600/20 -z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed max-w-lg font-normal">
              Safety doesn't happen by accident. Engineered armor designed to absorb maximum kinetic energy so you ride with unyielding confidence.
            </p>
          </div>

          <Link to={productsUrl({ category: 'Riding Gear' })} className="hidden md:block">
            <button className="inline-flex items-center gap-2 group text-gray-900 hover:text-white bg-white hover:bg-red-600 border border-gray-300 hover:border-red-600 font-bold uppercase tracking-widest text-xs lg:text-sm px-6 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-600/30">
              View All Armor
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>

        {/* ═══════ GEAR GRID (WHITE & RED CARDS) ═══════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {GEARS.map((gear, idx) => {
            const isTall = idx % 2 === 1;

            return (
              <motion.div
                key={gear.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: idx * 0.1,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                className={`${isTall ? 'lg:mt-8' : 'lg:mt-0'} transform-gpu`}
              >
                <Link
                  to={productsUrl({ category: 'Riding Gear', subcategory: gear.name })}
                  className={`group relative block h-[380px] sm:h-[440px] ${
                    isTall ? 'lg:h-[500px]' : 'lg:h-[450px]'
                  } overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg hover:shadow-2xl hover:shadow-red-500/15 hover:border-red-600 transition-all duration-500 transform-gpu`}
                >
                  {/* Background Image */}
                  <img
                    src={gear.image}
                    alt={gear.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100 transform-gpu"
                  />

                  {/* Light Contrast Scrim Layer (White Bottom Fade) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent opacity-95 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Red Tint Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Top-Left: Number Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Top-Right: Stat Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-red-600/30">
                      <Star size={10} className="fill-white" />
                      {gear.stat}
                    </div>
                  </div>

                  {/* Tech Brackets on Hover */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                  {/* Bottom Content Area */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                    {/* Tagline */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-[2px] w-5 bg-red-600 group-hover:w-8 transition-all duration-300" />
                      <span className="text-red-600 font-mono text-[10px] uppercase font-bold tracking-widest">
                        {gear.tagline}
                      </span>
                    </div>

                    {/* Gear Name */}
                    <h3
                      className="text-4xl sm:text-5xl font-black text-gray-900 uppercase leading-none tracking-tight mb-2 group-hover:text-red-600 transition-colors duration-300"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {gear.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4 font-normal leading-relaxed">
                      {gear.description}
                    </p>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 group-hover:border-red-200 transition-colors duration-300">
                      <span className="text-gray-500 text-xs font-mono font-medium">
                        {gear.count} Products
                      </span>

                      <div className="inline-flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider group-hover:text-red-600 transition-colors duration-300">
                        <span>Explore</span>
                        <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-red-600 text-gray-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ═══════ MOBILE VIEW ALL BUTTON ═══════ */}
        <div className="md:hidden mt-8">
          <Link to={productsUrl({ category: 'Riding Gear' })} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-colors duration-300 shadow-lg shadow-red-600/20">
              View All Riding Gear
              <ArrowUpRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RidingGearShowcase;