import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Radio, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from './VideoCard';
import { videos } from '@/data/videos';

const ShopShowcaseSection = () => {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts = videos.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {});
    const cats = Object.keys(counts).map((cat) => ({ name: cat, count: counts[cat] }));
    return [{ name: 'all', count: videos.length }, ...cats];
  }, []);

  const filteredVideos = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? videos
      : videos.filter((v) => v.category === activeCategory);
    return filtered.slice(0, 8);
  }, [activeCategory]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const max = scrollWidth - clientWidth;
      setScrollProgress(max > 0 ? (scrollLeft / max) * 100 : 0);
    }
  };

  return (
    <section className="relative py-14 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden border-y border-gray-100">
      {/* Racing stripes */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-40" />
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-40" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
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
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 sm:mb-10"
        >
          <div className="max-w-2xl">
            {/* LIVE badge */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
              <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full">
                
                <Radio size={11} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest">On Air</span>
              </div>
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              MotoGears{' '}
              <span className="relative inline-block">
                <span className="text-red-600">Pitstop TV</span>
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

            <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">
              Gear reviews. Maintenance hacks. Epic rides. All in one place.
            </p>
          </div>

          {/* Navigation arrows (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
              <Play size={12} className="fill-red-600 text-red-600" />
              <span className="tabular-nums">{filteredVideos.length} Episodes</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-full bg-white border-2 border-gray-900 hover:bg-red-600 hover:border-red-600 flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-105"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-full bg-white border-2 border-gray-900 hover:bg-red-600 hover:border-red-600 flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══════ CATEGORY FILTER CHIPS ═══════ */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {categoriesWithCounts.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 shrink-0 overflow-hidden ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600'
                  }`}
                >
                  {/* Shine effect on active */}
                  {isActive && (
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                  )}
                  <span className="relative capitalize">
                    {cat.name.replace('-', ' ')}
                  </span>
                  <span
                    className={`relative flex items-center justify-center text-[9px] tabular-nums font-mono px-1.5 py-0.5 rounded-full transition-all ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ═══════ VIDEO SCROLLER ═══════ */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 md:gap-5 lg:gap-6 snap-x snap-mandatory scrollbar-hide pb-6 pt-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, idx) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-[75vw] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] flex-shrink-0 snap-start"
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500">
                    <VideoCard video={video} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredVideos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Play size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No videos in this category yet.</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-4 text-red-600 text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Show All Videos
                </button>
              </motion.div>
            )}
          </div>

          {/* Scroll progress bar */}
          {filteredVideos.length > 0 && (
            <div className="mt-2 h-[3px] bg-gray-200 rounded-full overflow-hidden hidden sm:block">
              <motion.div
                className="h-full bg-red-600 rounded-full"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          )}
        </div>

       
      </div>
    </section>
  );
};

export default ShopShowcaseSection;