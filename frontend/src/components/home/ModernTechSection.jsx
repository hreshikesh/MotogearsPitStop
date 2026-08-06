import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Cpu } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { productsUrl } from '@/utils/urlUtils';

const ModernTechSection = () => {
  const modernTechProducts = products
    .filter((p) => p.brand === 'MODERN TECH' || p.name.toUpperCase().includes('MODERN TECH'))
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  if (modernTechProducts.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden border-y border-gray-100">
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
                <Cpu size={12} /> Featured Brand
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Modern Tech{' '}
              <span className="relative inline-block">
                <span className="text-red-600">Accessories</span>
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

            <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 max-w-md">
              Premium protection and utility gear engineered for the modern rider.
            </p>
          </div>

          <Link to={productsUrl({ search: 'Modern Tech' })} className="hidden md:block">
            <button className="inline-flex items-center gap-2 group text-gray-900 hover:text-white bg-transparent hover:bg-red-600 border-2 border-gray-900 hover:border-red-600 font-bold uppercase tracking-widest text-xs lg:text-sm px-5 py-2.5 rounded-full transition-all duration-300">
              View All
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>

        {/* ═══════ PRODUCT GRID / SCROLL ═══════ */}
        <div className="relative">
          <div
            className="flex overflow-x-auto gap-3 sm:gap-4 snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4
                       md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 lg:gap-5 md:overflow-visible md:mx-0 md:px-0 md:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {modernTechProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="min-w-[55vw] sm:min-w-[38vw] md:min-w-0 snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══════ MOBILE VIEW ALL ═══════ */}
        <div className="mt-6 md:hidden">
          <div className="flex items-center justify-center gap-2 mb-3 text-gray-400 text-[10px] font-mono uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
            Swipe to explore
            <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
          </div>
          <Link to={productsUrl({ search: 'Modern Tech' })} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 text-white bg-gray-900 hover:bg-red-600 font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-colors duration-300 group">
              View All Modern Tech
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModernTechSection;