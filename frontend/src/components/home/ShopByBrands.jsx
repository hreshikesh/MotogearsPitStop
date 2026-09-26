import React, { useRef, useState } from 'react';
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
  const [, setHoveredBrand] = useState(null);
  const x = useMotionValue(0);

  const bikeBrands = [
    { name: 'KTM', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419207/KTM_wo6lqu_uxkyxl.jpg' },
    { name: 'BMW', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419206/BMW_cflzgx_eydobz.jpg' },
    { name: 'YAMAHA', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419205/YAMAHA_qlscri_excl9m.jpg' },
    { name: 'ROYAL ENFIELD', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419211/Royal_Enfield_ihcvc0_dxoahm.avif' },
    { name: 'DUCATI', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419200/photo-1568772585407-9361f9bf3a87_sfpya9.jpg' },
    { name: 'HONDA', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419207/HONDA_plqlz2_emccqb.jpg' },
    { name: 'KAWASAKI', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419205/z900_vh9bmo.jpg' },
    { name: 'HERO', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419206/Hero_bmnkqh.jpg' },
    { name: 'TVS', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419210/Screenshot_2026-03-05_at_10.27.02_AM_raje3d.png' },
    { name: 'TRIUMPH', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419205/TRIUMPH_vcbcuh.webp' },
    { name: 'BAJAJ', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419203/Screenshot_2026-03-05_at_10.27.14_AM_riaxfv.png' },
    { name: 'ATHER', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419205/ATHER_ienv7e.jpg' },
    { name: 'OLA', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419207/OLA_hp5ki7.jpg' },
    { name: 'APRILIA', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419205/APRILIA_cungwe.jpg' },
    { name: 'HARLEY DAVIDSON', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790419206/HARLEY_DAVIDSON_ih3aik.avif' },
  ];

  const brandLogos = [
    { name: 'Studds', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689981/STUDDS-LOGO.png' },
    { name: 'Axor', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689974/Axor_Logo.jpg' },
    { name: 'SMK', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423390/ed6df065-f7f5-48e2-b0d4-2e349b5fd3e9.png' },
    { name: 'MT Helmets', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786712465/33ec969b-aca9-4dde-92a3-620a5e60d3c9.png' },
    { name: 'Barkbusters', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689975/Barkbusters_Logo_Grunge.jpg' },
    { name: 'Cardo', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689979/OIP.webp' },
    { name: 'Maddog', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711488/32cb2a46-cc20-45a1-97d6-cc5b98242aac.png' },
    { name: 'Moto Torque', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711558/37f407a3-4819-4922-af76-de9cacde20eb.png' },
    { name: 'Moto Care', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711603/c59e7d4e-3bec-472c-84b9-31980895cdcd.png' },
    { name: 'LGP', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786712310/4322a859-cd04-4837-a542-47fdbfb64f47.png' },
    { name: 'Pro Taper', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711654/4e675654-27e6-4d56-b7f1-0c38fe05e96a.png' },
    { name: 'Jawa', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689975/OIP_3.webp' },
   
    { name: 'Ngage', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711748/20356d1f-19c4-42bc-907f-b2d1ad8bcb43.png' },
    { name: 'BMC', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786871250/1d71613b-c70a-4dd3-824f-a90a7a295af8.png' },
    { name: 'Rolon', img: 'https://res.cloudinary.com/rteryyle/image/upload/v1790423459/9b004447-1173-4744-a6e4-4453ea6adb9f.png' },
    { name: 'Vesrah', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711910/9ae0357e-ac3b-47bc-9f54-e3acc466042f.png' },
    { name: 'BluArmor', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689976/OIP_7.webp' },
    { name: 'EJEAS Intercom', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689976/OIP_8.webp' },
    { name: 'Red Rooster', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711439/6db1eae5-b10f-4539-8ee8-95b22b6642fe.png' },
    { name: 'Powerage', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689977/OIP_10.webp' },
    { name: 'Modern Tech', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786711962/3e4f118f-5f70-452a-8ce3-c6f9cf2b1a6e.png' },
    { name: 'FuelX', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786712014/b3674a8e-f007-4b0d-a8ac-c951d883f6c9.png' },
    { name: 'BOBO', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1787288194/36fce251-d445-4ce1-8c1f-dece594999c5.png' },
  
    { name: 'RK Tech', img: 'https://res.cloudinary.com/eelqgto5/image/upload/v1786712251/92a1f92a-2d01-4ea9-bd2f-7d71e7103be3.png' },
    { name: 'NGK', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689978/OIP_14.webp' },
    { name: 'K&N', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689978/OIP_15.webp' },
    { name: 'Sena', img: 'https://res.cloudinary.com/px1co5qc/image/upload/v1786689979/OIP_16.webp' },
  ];

  const brandMap = {
    'KTM': 'KTM',
    'BMW': 'BMW',
    'YAMAHA': 'Yamaha',
    'ROYAL ENFIELD': 'Royal Enfield',
    'DUCATI': 'Ducati',
    'HONDA': 'Honda',
    'KAWASAKI': 'Kawasaki',
    'HERO': 'Hero',
    'SUZUKI': 'Suzuki',
    'TVS': 'TVS',
    'TRIUMPH': 'Triumph',
    'BAJAJ': 'Bajaj',
    'ATHER': 'Ather',
    'OLA': 'Ola',
    'APRILIA': 'Aprilia',
    'HARLEY DAVIDSON': 'Harley-Davidson',
    'MOTUL': 'Motul',
    'AXOR': 'Axor',
    'SMK': 'SMK',
    'MT HELMETS': 'MT Helmets',
    'BARKBUSTERS': 'Barkbusters',
    'MADDOG': 'Maddog',
    'CARDO': 'Cardo',
    'MOTO TORQUE': 'Moto Torque',
    'MOTO CARE': 'Moto Care',
    'LGP': 'LGP',
    'PRO TAPER': 'Pro Taper',
    'JAWA': 'Jawa',
    'STUDDS': 'Studds',
    'NGAGE': 'Ngage',
    'BMC': 'BMC',
    'ROLON': 'Rolon',
    'VESRAH': 'Vesrah',
    'BLUARMOR': 'BluArmor',
    'EJEAS INTERCOM': 'EJEAS Intercom',
    'RED ROOSTER': 'Red Rooster',
    'POWERAGE': 'Powerage',
    'MODERN TECH': 'Modern Tech',
    'FUELX': 'FuelX',
    'BOBO': 'BOBO',
    'RK TECH': 'RK Tech',
    'NGK': 'NGK',
    'K&N': 'K&N',
    'SENA': 'Sena',
  };

  const handleBrandClick = (brandName, isBikeParam = true) => {
    clearFilters();
    const formattedBrand = brandMap[brandName.toUpperCase()] || brandName;
    const filterParam = isBikeParam ? { bike: formattedBrand } : { brand: formattedBrand };
    navigate(productsUrl(filterParam));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

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
      {/* ── Background Grid + Glow ── */}
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
              <span className="relative z-10 text-red-500">Bike</span>
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

        {/* ── Infinite Marquee Ticker ── */}
        <div className="relative mb-10 sm:mb-14 py-4 border-y border-white/10 overflow-hidden">
          <motion.div
            ref={marqueeRef}
            style={{ x }}
            className="flex whitespace-nowrap gap-8 sm:gap-14"
          >
            {[...bikeBrands, ...bikeBrands].map((brand, i) => (
              <div
                key={`marquee-${i}`}
                className="flex items-center gap-8 sm:gap-14 text-white/30 hover:text-red-500 transition-colors cursor-pointer select-none"
                onClick={() => handleBrandClick(brand.name, true)}
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
        <div className="relative group/carousel mb-16 sm:mb-20">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:scale-110 shadow-2xl md:-ml-4"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:scale-110 shadow-2xl md:-mr-4"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 snap-x snap-mandatory scrollbar-hide pb-4 pt-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {bikeBrands.map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  delay: idx * 0.04,
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredBrand(idx)}
                onHoverEnd={() => setHoveredBrand(null)}
                onClick={() => handleBrandClick(brand.name, true)}
                className="group relative flex-none w-[170px] sm:w-[210px] md:w-[240px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer snap-start border border-white/10 hover:border-red-500/50 transition-colors duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={brand.img}
                    alt={`${brand.name} motorcycles`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                </div>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/30" />

                {/* Subtle Red Overlay on Hover */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-500" />

                {/* Top: Brand Index */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="text-white/40 font-mono text-xs font-bold tabular-nums">
                    /{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Top-Right: External Icon */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                  <div className="h-[2px] w-8 bg-red-500 mb-2 sm:mb-3 origin-left group-hover:w-16 transition-all duration-500" />

                  <h3
                    className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-none uppercase tracking-tight transform group-hover:-translate-y-0.5 transition-transform duration-300"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {brand.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    <span className="text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      Explore
                    </span>
                    <div className="h-[1px] w-6 bg-red-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade Edges */}
          <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none z-10" />
        </div>

        {/* ── Section Divider: Shop by Brand ── */}
        <div className="flex items-center justify-center gap-4 my-10 sm:my-14">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight uppercase text-center"
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
        </div>

        {/* ── Brand Capsules Cloud (FIXED LOGO SIZING) ── */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-w-6xl mx-auto">
          {brandLogos.map((brand, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.015, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBrandClick(brand.name, false)}
              className="group relative flex items-center h-12 sm:h-14 px-5 sm:px-7 rounded-full border border-white/20 hover:border-red-500 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-red-500/20"
            >
              {/* Default State: Clean White Brand Text */}
              <span className="relative z-10 text-white/90 group-hover:opacity-0 group-hover:scale-90 transition-all duration-300 font-black text-xs sm:text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
                {brand.name}
              </span>

              {/* Hover State: Uniform Logo Container */}
              <div className="absolute inset-0.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full p-2 overflow-hidden">
                <img
                  src={brand.img}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="h-6 sm:h-7 md:h-8 w-auto max-w-[80%] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Subtle Edge Glow Shine */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
            </motion.button>
          ))}
        </div>

        {/* ── Bottom Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
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