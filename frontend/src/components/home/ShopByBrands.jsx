import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight, Zap } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { productsUrl } from '@/utils/urlUtils';

const ShopByBrands = () => {
  const navigate = useNavigate();
  const { clearFilters } = useFilterStore();
  const scrollRef = useRef(null);
  const marqueeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const x = useMotionValue(0);

  const brands = [
    { name: 'KTM', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015383/KTM_wo6lqu_uxkyxl.jpg' },
    { name: 'BMW', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015382/BMW_cflzgx_eydobz.jpg' },
    { name: 'YAMAHA', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015382/YAMAHA_qlscri_excl9m.jpg' },
    { name: 'ROYAL ENFIELD', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015380/Royal_Enfield_ihcvc0_dxoahm.avif' },
    { name: 'DUCATI', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015381/photo-1568772585407-9361f9bf3a87_sfpya9.jpg' },
    { name: 'HONDA', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015377/HONDA_plqlz2_emccqb.jpg' },
    { name: 'KAWASAKI', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015375/z900_vh9bmo.jpg' },
    { name: 'HERO', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015374/Hero_bmnkqh.jpg' },
    { name: 'TVS', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015373/Screenshot_2026-03-05_at_10.27.02_AM_raje3d.png' },
    { name: 'TRIUMPH', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015371/TRIUMPH_vcbcuh.webp' },
    { name: 'BAJAJ', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015371/Screenshot_2026-03-05_at_10.27.14_AM_riaxfv.png' },
    { name: 'ATHER', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015368/ATHER_ienv7e.jpg' },
    { name: 'OLA', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015367/OLA_hp5ki7.jpg' },
    { name: 'APRILIA', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015366/APRILIA_cungwe.jpg' },
    { name: 'HARLEY DAVIDSON', img: 'https://res.cloudinary.com/twjztvms/image/upload/v1784015365/HARLEY_DAVIDSON_ih3aik.avif' },
  ];

  const brandMap = {
    'KTM': 'KTM', 'BMW': 'BMW', 'YAMAHA': 'Yamaha', 'ROYAL ENFIELD': 'Royal Enfield',
    'DUCATI': 'Ducati', 'HONDA': 'Honda', 'KAWASAKI': 'Kawasaki', 'HERO': 'Hero',
    'SUZUKI': 'Suzuki', 'TVS': 'TVS', 'TRIUMPH': 'Triumph', 'BAJAJ': 'Bajaj',
    'ATHER': 'Ather', 'OLA': 'Ola', 'APRILIA': 'Aprilia', 'HARLEY DAVIDSON': 'Harley-Davidson',
    'MOTUL': 'Motul', 'AXOR': 'Axor', 'SMK': 'SMK', 'MT HELMETS': 'MT Helmets',
    'MADDOG': 'Maddog', 'BARKBUSTERS': 'Barkbusters', 'JAWA': 'Jawa', 'STUDDS': 'Studds',
    'CARDO': 'Cardo', 'MOTO TORQUE': 'Moto Torque', 'MOTO CARE': 'Moto Care', 'LGP': 'LGP',
    'PRO TAPER': 'Pro Taper', 'NGAGE': 'Ngage', 'BMC': 'BMC', 'ROLON': 'Rolon',
    'VESRAH': 'Vesrah', 'BluArmor': 'BluArmor', 'EJEAS INTERCOM': 'EJEAS Intercom',
    'RED ROOSTER': 'Red Rooster', 'POWERAGE': 'Powerage', 'MODERN TECH': 'Modern Tech',
    'FUELX': 'FuelX', 'BOBO': 'BOBO',
  };

  const handleBrandClick = (brandName) => {
    clearFilters();
    const formattedBrand = brandMap[brandName.toUpperCase()] || brandName;
    navigate(productsUrl({ bike: formattedBrand }));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const textBrands = [
    'Studds', 'Axor', 'Barkbusters', 'Cardo', 'Maddog',
    'Moto Torque', 'Moto Care', 'LGP', 'Pro Taper', 'Jawa', 'Suzuki',
    'Ngage', 'BMC', 'Rolon', 'Vesrah', 'BluArmor', 'EJEAS Intercom',
    'Red Rooster', 'Powerage', 'Modern Tech', 'FuelX', 'BOBO',
  ];

  // Infinite marquee effect for the top ticker
  useAnimationFrame((t, delta) => {
    if (isPaused) return;
    const moveBy = -0.03 * delta;
    x.set(x.get() + moveBy);
    if (marqueeRef.current) {
      const width = marqueeRef.current.scrollWidth / 2;
      if (x.get() <= -width) x.set(0);
    }
  });

  return (
    <section
      id="shop-by-brand"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden"
    >
      {/* ── Background: Grid + Glow ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-3 sm:mb-4">
            <div className="h-[2px] w-8 sm:w-12 bg-red-500" />
            <span className="inline-flex items-center gap-1.5 text-red-400 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
              <Zap size={12} className="fill-red-400" /> Top Manufacturers
            </span>
            <div className="h-[2px] w-8 sm:w-12 bg-red-500" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Shop by{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-red-500">Brand</span>
              <motion.span
                className="absolute inset-x-0 bottom-1 h-2 bg-red-500/30 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ originX: 0 }}
              />
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            The world's most iconic motorcycle brands, curated in one place.
          </p>
        </motion.div>

        {/* ── Infinite Marquee Ticker (top text scroll) ── */}
        <div className="relative mb-10 sm:mb-14 py-4 border-y border-white/10 overflow-hidden">
          <motion.div
            ref={marqueeRef}
            style={{ x }}
            className="flex whitespace-nowrap gap-8 sm:gap-14"
          >
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`marquee-${i}`}
                className="flex items-center gap-8 sm:gap-14 text-white/30 hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => handleBrandClick(brand.name)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <span
                  className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase whitespace-nowrap"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {brand.name}
                </span>
                <span className="text-red-500 text-xl sm:text-3xl">✦</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Brand Cards Carousel ── */}
        <div className="relative group/carousel mb-14 sm:mb-16">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:scale-110 shadow-2xl md:-ml-6"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:scale-110 shadow-2xl md:-mr-6"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 snap-x snap-mandatory scrollbar-hide pb-4 pt-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {brands.map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  delay: idx * 0.05,
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredBrand(idx)}
                onHoverEnd={() => setHoveredBrand(null)}
                onClick={() => handleBrandClick(brand.name)}
                className="group relative flex-none w-[170px] sm:w-[210px] md:w-[240px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer snap-start"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={brand.img}
                    alt={`${brand.name} motorcycles`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-[900ms] ease-out grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/30" />

                {/* Red hover tint */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-500" />

                {/* Grain */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Top: brand number */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="text-white/40 font-mono text-xs font-bold tabular-nums">
                    /{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Top-right: arrow pill */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <ArrowUpRight size={15} className="text-white" />
                  </div>
                </div>

                {/* Bottom: brand name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                  {/* Divider line - grows on hover */}
                  <div className="h-[2px] w-8 bg-red-500 mb-2 sm:mb-3 origin-left group-hover:w-16 transition-all duration-500" />

                  <h3
                    className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-none uppercase tracking-tight transform group-hover:-translate-y-0.5 transition-transform duration-500"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {brand.name}
                  </h3>

                  {/* Explore link */}
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      Explore
                    </span>
                    <div className="h-[1px] w-6 bg-red-400" />
                  </div>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/50 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Edge gradients */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 my-10 sm:my-14">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-white/40 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
            + More Brands
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* ── Text Brands Cloud ── */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
          {textBrands.map((b, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBrandClick(b)}
              className="group relative text-white/70 hover:text-white whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full border border-white/15 hover:border-red-500 bg-white/[0.02] hover:bg-red-600/10 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10">{b}</span>
              {/* Shine effect */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
            </motion.button>
          ))}
        </div>

        {/* ── Bottom stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '40+', label: 'Global Brands' },
            { value: '2000+', label: 'Products' },
            { value: '100%', label: 'Authentic' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="text-red-500">{stat.value}</span>
              </div>
              <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByBrands;