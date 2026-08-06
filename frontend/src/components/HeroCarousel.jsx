// HeroCarousel.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Play, Pause } from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';

// ─── Slide Data (Unified Red Theme) ────────────────────────────────────────────
const slides = [
  {
    id: 0,
    image:
      'https://res.cloudinary.com/twjztvms/image/upload/v1784014427/photo-1682281553437-ccb7820d3da2_kvyw3p.jpg',
    badge: 'New Season Collection',
    heading: ['RIDE WITHOUT', 'LIMITS'],
    headingAccent: 'LIMITS',
    subheading:
      'Premium riding gear engineered for performance, comfort, and safety on every road.',
    ctaPrimary: { label: 'Shop Now', to: '/products' },
    ctaSecondary: {
      label: 'Explore Gear',
      to: '/products?category=Riding+Gear',
    },
  },
  {
    id: 1,
    image:
      'https://res.cloudinary.com/twjztvms/image/upload/v1784014426/apacheee_n8ra9f_icsh73.png',
    badge: 'Performance Series',
    heading: ['BORN FOR THE', 'TRACK'],
    headingAccent: 'TRACK',
    subheading:
      'Race-bred accessories and parts built to push your machine beyond its limits.',
    ctaPrimary: { label: 'View Performance', to: '/products?category=Performance+Parts' },
    ctaSecondary: { label: 'Find Your Fit', to: '/products?category=Touring' },
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/twjztvms/image/upload/v1784014426/Web_1_tmooae_ac3ogq.avif',
    badge: 'Rider Essentials',
    heading: ['GEAR UP FOR', 'ADVENTURE'],
    headingAccent: 'ADVENTURE',
    subheading:
      'From helmets to boots — everything you need for long-distance touring and off-road adventures.',
    ctaPrimary: { label: 'Shop Essentials', to: '/products' },
    ctaSecondary: { label: 'Tour Gear', to: '/products?category=Touring' },
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/twjztvms/image/upload/v1784014426/G301_dcqjcb_ybl41n.jpg',
    badge: 'Exclusive Brands',
    heading: ['WORLD-CLASS', 'BRANDS'],
    headingAccent: 'BRANDS',
    subheading:
      "Shop from the world's most trusted motorcycle brands all in one place.",
    ctaPrimary: { label: 'Browse Brands', to: '/products' },
    ctaSecondary: { label: 'Best Sellers', to: '/products?sort=popular' },
  },
];

// ─── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ duration, isActive, isPaused }) => (
  <div className="relative h-[2px] w-full bg-white/15 overflow-hidden rounded-full">
    {isActive && (
      <motion.div
        key={`progress-${isActive}-${isPaused}`}
        className="absolute inset-y-0 left-0 bg-red-500"
        initial={{ width: '0%' }}
        animate={{ width: isPaused ? undefined : '100%' }}
        transition={{
          duration: isPaused ? 0 : duration / 1000,
          ease: 'linear',
        }}
      />
    )}
  </div>
);

// ─── Main Carousel ─────────────────────────────────────────────────────────────
const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);
  const DURATION = 5000;

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, DURATION);
  }, []);

  useEffect(() => {
    if (!isPaused) startInterval();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, startInterval]);

  const goToSlide = useCallback(
    (index) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      startInterval();
    },
    [currentIndex, startInterval]
  );

  const handleImageError = (e) => {
    e.target.src =
      'https://placehold.co/1920x1080/111827/374151?text=MotoGearsPitstop';
  };

  const slide = slides[currentIndex];

  const imageVariants = {
    enter: (dir) => ({ x: dir > 0 ? '3%' : '-3%', opacity: 0, scale: 1.05 }),
    center: { x: '0%', opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-3%' : '3%', opacity: 0, scale: 0.98 }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    /* ── SMALLER HEIGHT: mobile fits screen; desktop caps at 720px ── */
    <div
      className="
        relative w-full overflow-hidden bg-black
        h-[75vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh]
        min-h-[480px] max-h-[720px]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── Background Image ── */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={`bg-${currentIndex}`}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={slide.image}
            alt={`Slide ${currentIndex + 1}`}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            onError={handleImageError}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Subtle noise */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Watermark slide number (desktop) ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 lg:right-12 hidden md:flex flex-col items-center gap-1 z-10 pointer-events-none">
        <span className="text-white/[0.06] font-black text-[100px] lg:text-[140px] leading-none select-none tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex flex-col justify-between py-5 sm:py-6 md:py-8">
        {/* Top: progress bars + tag */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToSlide(i)}
                className="flex-1 group py-2 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <ProgressBar
                  duration={DURATION}
                  isActive={i === currentIndex}
                  isPaused={isPaused}
                />
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${currentIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="h-[2px] w-6 sm:w-10 bg-red-500" />
              <span className="text-red-400 font-mono uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold">
                {slide.badge}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Middle: text block */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 flex-1 flex items-center">
          <div className="w-full max-w-[95%] sm:max-w-[80%] md:max-w-[65%] lg:max-w-[55%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Heading — smaller clamp for reduced height */}
                <div className="mb-3 sm:mb-4 md:mb-5 overflow-hidden">
                  {slide.heading.map((line, i) => (
                    <motion.div key={i} custom={i} variants={textVariants}>
                      <span
                        className={`
                          block font-black uppercase leading-[0.9] tracking-tight
                          text-[clamp(2.2rem,7vw,5rem)]
                          ${
                            line === slide.headingAccent
                              ? 'text-red-500'
                              : 'text-white'
                          }
                        `}
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {line}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Subheading */}
                <motion.p
                  custom={3}
                  variants={textVariants}
                  className="
                    text-white/75 leading-relaxed font-medium
                    mb-5 sm:mb-6 md:mb-7
                    text-sm sm:text-base
                    max-w-md
                  "
                >
                  {slide.subheading}
                </motion.p>

                {/* CTAs — inline-flex so they don't stretch full width */}
                <motion.div
                  custom={4}
                  variants={textVariants}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
                >
                  <Link
                    to={slide.ctaPrimary.to}
                    className="
                      group relative inline-flex items-center justify-center gap-2
                      bg-red-600 hover:bg-red-500
                      text-white font-bold uppercase tracking-[0.12em]
                      px-6 py-3 sm:px-7 sm:py-3.5
                      text-xs sm:text-sm
                      transition-all duration-300
                      shadow-[0_0_20px_rgba(220,38,38,0.35)]
                      hover:shadow-[0_0_30px_rgba(220,38,38,0.55)]
                      overflow-hidden
                      w-full sm:w-auto
                    "
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                    <span className="relative">{slide.ctaPrimary.label}</span>
                    <ArrowRight
                      size={16}
                      className="relative group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>

                  <Link
                    to={slide.ctaSecondary.to}
                    className="
                      group inline-flex items-center justify-center gap-2
                      border border-white/30 hover:border-red-500/70
                      bg-white/5 hover:bg-red-500/10
                      backdrop-blur-sm text-white font-bold uppercase tracking-[0.12em]
                      px-6 py-3 sm:px-7 sm:py-3.5
                      text-xs sm:text-sm
                      transition-all duration-300
                      w-full sm:w-auto
                    "
                  >
                    <span>{slide.ctaSecondary.label}</span>
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`
                  h-2 rounded-full transition-all duration-400 focus:outline-none
                  ${
                    i === currentIndex
                      ? 'w-6 bg-red-500'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }
                `}
              />
            ))}
            <span className="text-white/40 text-[10px] sm:text-xs font-mono ml-2 tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="
                w-9 h-9 sm:w-10 sm:h-10 rounded-full
                border border-white/25 bg-white/10 backdrop-blur-sm
                flex items-center justify-center
                hover:bg-red-500/20 hover:border-red-500/60
                transition-all duration-300
                text-white
              "
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>

            <div className="hidden md:flex items-center gap-2 text-white/30">
              <div className="flex gap-0.5 items-end">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full bg-red-500/50"
                    animate={{ height: ['6px', '14px', '6px'] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest">
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;