import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, ShieldCheck, Award, MessageSquare, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Pan India Shipping',
    description: 'Free delivery on orders above ₹5,000',
    highlight: 'Fast Dispatch',
    stat: '24H',
    statLabel: 'Dispatch',
  },
  {
    icon: CheckCircle2,
    title: 'Tested Products',
    description: 'Quality assured by expert riders',
    highlight: '100% Verified',
    stat: '5K+',
    statLabel: 'Reviews',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Encrypted & 100% safe checkout',
    highlight: 'SSL Secured',
    stat: '256',
    statLabel: 'Bit SSL',
  },
  {
    icon: Award,
    title: 'Trusted Brands',
    description: 'Directly sourced authentic gear',
    highlight: 'Guaranteed',
    stat: '40+',
    statLabel: 'Brands',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Support',
    description: '24/7 expert customer assistance',
    highlight: 'Instant Help',
    stat: '24/7',
    statLabel: 'Support',
  },
];

const TrustBenefits = () => {
  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-white overflow-hidden border-y border-gray-100">
      {/* Racing stripes */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-40" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-40" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════ OPTIONAL MINI HEADER ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6 sm:mb-8 lg:mb-10"
        >
          <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
          <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
            <Sparkles size={11} /> Why Choose Us
          </span>
          <div className="h-[2px] w-8 sm:w-12 bg-red-600" />
        </motion.div>

        {/* ═══════ BENEFITS GRID ═══════
            Mobile:  2 cols (last spans full width)
            Small:   2 cols (last spans full width)
            Medium:  3 cols (last 2 fill row)
            Large:   5 cols in single row
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-0">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            const isLast = idx === BENEFITS.length - 1;
            const isSecondLast = idx === BENEFITS.length - 2;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`
                  group relative flex flex-col items-center text-center
                  p-4 sm:p-5 lg:p-6
                  rounded-2xl lg:rounded-none
                  bg-white lg:bg-transparent
                  border border-gray-100 lg:border-none
                  shadow-sm hover:shadow-xl hover:shadow-red-600/10 lg:hover:shadow-none
                  hover:border-red-200 lg:hover:border-none
                  transition-all duration-300
                  ${isLast ? 'col-span-2 md:col-span-3 lg:col-span-1' : ''}
                  ${idx > 0 ? 'lg:border-l lg:border-gray-100' : ''}
                `}
              >
                {/* Red hover glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl lg:rounded-none" />

                {/* ── Top badge row (tag + stat) ── */}
                <div className="flex items-center justify-between w-full mb-4">
                  {/* Micro tag */}
                  <span className="text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    {benefit.highlight}
                  </span>

                  {/* Stat pill (right) */}
                  <div className="flex flex-col items-end">
                    <span
                      className="text-red-600 font-black text-sm sm:text-base leading-none tabular-nums"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {benefit.stat}
                    </span>
                    <span className="text-gray-400 text-[7px] sm:text-[8px] uppercase font-bold tracking-widest">
                      {benefit.statLabel}
                    </span>
                  </div>
                </div>

                {/* ── Icon Container ── */}
                <div className="relative mb-3 sm:mb-4">
                  {/* Glow behind icon */}
                  <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon square */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black border-2 border-black text-white flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300">
                    <Icon
                      size={22}
                      className="text-red-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      strokeWidth={2.2}
                    />
                  </div>
                </div>

                {/* ── Text ── */}
                <h3
                  className="text-gray-900 font-black text-xs sm:text-sm tracking-tight uppercase mb-1 sm:mb-1.5"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
                >
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-[11px] sm:text-xs leading-snug max-w-[180px] sm:max-w-[200px] font-medium">
                  {benefit.description}
                </p>

                {/* ── Bottom red accent line ── */}
                <div className="absolute bottom-0 inset-x-4 sm:inset-x-6 h-[2px] bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />

                {/* Corner accent (mobile cards only) */}
                <div className="lg:hidden absolute top-0 right-0 w-6 h-6 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-[2px] bg-red-500 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />
                  <div className="absolute top-0 right-0 h-full w-[2px] bg-red-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══════ BOTTOM MICRO STRIP (optional trust text) ═══════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-bold">Trusted by 50,000+ Riders</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span>4.8★ Rated on Google</span>
          <span className="hidden sm:inline">·</span>
          <span>Since 2019</span>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBenefits;