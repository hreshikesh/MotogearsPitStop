import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { productsUrl } from '@/utils/urlUtils';

const CATEGORIES = [
  {
    id: 'helmets',
    name: 'Helmets',
    tagline: 'Head Protection',
    count: '120+ Products',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419001/HELMET_apudzn_uh6riz.jpg',
    params: { subcategory: 'Helmets' },
    featured: true, // Spans 2x2
  },
  {
    id: 'jackets',
    name: 'Jackets',
    tagline: 'Ride in Style',
    count: '80+ Products',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419001/Raida_Jacket_itrknv_i00fes.jpg',
    params: { subcategory: 'Jackets' },
  },
  {
    id: 'gloves',
    name: 'Gloves',
    tagline: 'Ultimate Grip',
    count: '65+ Products',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419001/GLOVES_rik2zf_p7zqjq.webp',
    params: { subcategory: 'Gloves' },
  },
  {
    id: 'boots',
    name: 'Boots',
    tagline: 'Step With Power',
    count: '45+ Products',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419000/Boots_kehggs_trirdc.webp',
    params: { subcategory: 'Boots' },
  },
  {
    id: 'touring',
    name: 'Touring',
    tagline: 'Go The Distance',
    count: '90+ Products',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419003/Screenshot_2026-02-22_at_11.33.45_PM_y7dit1_umjkyf.png',
    params: { category: 'Touring' },
  },
  {
    id: 'bike-accessories',
    name: 'Bike Accessories',
    tagline: 'Complete Your Ride',
    count: '150+ Products',
    description:
      'Essential accessories to complete your build — from precision mirrors to rugged phone mounts.',
    image:
      'https://res.cloudinary.com/rteryyle/image/upload/v1790419000/Bike_accessories_quf2sc_acl65x.jpg',
    params: { category: 'Bike Accessories' },
    wide: true, // Spans full width at bottom (2 cols on mobile/tablet, 4 cols on desktop)
  },
];

const CategoryCard = ({ category, index, onClick }) => {
  const { name, tagline, count, image, featured, wide, description } = category;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.07,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${name} category`}
      whileHover={{ y: -3 }}
      className={`
        group relative overflow-hidden rounded-2xl bg-gray-950 cursor-pointer
        shadow-sm hover:shadow-2xl hover:shadow-red-950/20
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${featured ? 'col-span-2 row-span-2' : ''}
        ${wide ? 'col-span-2 sm:col-span-3 lg:col-span-4' : ''}
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Dynamic Overlay Gradients */}
      {wide ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/10 group-hover:to-red-600/20 transition-all duration-500" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-600/0 group-hover:to-red-600/15 transition-all duration-500" />
        </>
      )}

      {/* Badges */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-red-600/30">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Featured
          </span>
        </div>
      )}

      {wide && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Top Rated
          </span>
        </div>
      )}

      {/* Floating Action Button (Top-Right) */}
      <div className="absolute top-4 right-4 z-10">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300">
          <ArrowUpRight size={18} className="text-white" />
        </div>
      </div>

      {/* Card Content Layout */}
      <div
        className={`
          absolute z-10 p-5 sm:p-6 lg:p-7
          ${
            wide
              ? 'inset-y-0 left-0 flex flex-col justify-center max-w-full sm:max-w-[70%] lg:max-w-[50%]'
              : 'inset-x-0 bottom-0'
          }
        `}
      >
        <p className="text-red-500 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 opacity-90 group-hover:opacity-100">
          {tagline}
        </p>

        <h3
          className={`
            text-white font-black uppercase leading-none tracking-tight mb-2
            transition-transform duration-300 group-hover:-translate-y-0.5
            ${
              featured
                ? 'text-3xl sm:text-5xl lg:text-6xl'
                : wide
                ? 'text-2xl sm:text-4xl lg:text-5xl'
                : 'text-xl sm:text-2xl lg:text-3xl'
            }
          `}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {name}
        </h3>

        {wide && description && (
          <p className="hidden sm:block text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-gray-300 text-xs font-medium">{count}</span>

          <div className="flex items-center gap-1 text-white font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Explore</span>
            <ArrowRight
              size={14}
              className="transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Hover Progress Bar (Standard & Featured Cards) */}
        {!wide && (
          <div className="mt-3.5 h-[2px] w-full bg-white/15 overflow-hidden rounded-full">
            <div className="h-full w-0 group-hover:w-full bg-red-500 transition-all duration-500 ease-out" />
          </div>
        )}
      </div>

      {/* Right-Side CTA Banner (Wide Card Desktop Only) */}
      {wide && (
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:bg-red-500 group-hover:scale-105 transition-all duration-300">
            <ArrowUpRight size={24} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-bold uppercase tracking-widest">
            Shop Category
          </span>
        </div>
      )}
    </motion.div>
  );
};

const CategoryShowcase = () => {
  const navigate = useNavigate();
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const handleCategoryClick = (category) => {
    clearFilters();
    navigate(productsUrl(category.params));
  };

  const handleViewAllClick = () => {
    clearFilters();
    navigate('/products');
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      {/* Decorative Dot Grid */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #e63946 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 sm:mb-12 gap-4 md:gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="text-red-600 font-mono text-xs md:text-sm tracking-[0.25em] uppercase font-bold">
                Premium Gear
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Shop by{' '}
              <span className="relative inline-block text-red-600">
                Category
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 100 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,3 Q25,0 50,3 T100,3"
                    stroke="#e63946"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
              Discover premium riding gear crafted for uncompromised performance, comfort, and safety.
            </p>
          </div>

          <button
            onClick={handleViewAllClick}
            className="hidden md:inline-flex items-center gap-2 group text-gray-900 hover:text-white bg-transparent hover:bg-red-600 border-2 border-gray-900 hover:border-red-600 font-bold uppercase tracking-widest text-xs lg:text-sm px-6 py-3.5 rounded-full transition-all duration-300"
          >
            View All Categories
            <ArrowUpRight
              size={16}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="
            grid gap-4 sm:gap-5 lg:gap-6
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            auto-rows-[190px] sm:auto-rows-[240px] lg:auto-rows-[250px]
          "
        >
          {CATEGORIES.map((cat, idx) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={idx}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8">
          <button
            onClick={handleViewAllClick}
            className="w-full inline-flex items-center justify-center gap-2 text-white bg-gray-900 hover:bg-red-600 font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-all duration-300 group"
          >
            View All Categories
            <ArrowUpRight
              size={16}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;