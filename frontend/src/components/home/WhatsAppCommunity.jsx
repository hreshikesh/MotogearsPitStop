import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bike, Tag, Users } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { WHATSAPP_COMMUNITY_URL } from '@/config/contact';

const PERKS = [
  {
    icon: Bike,
    title: 'Weekend Rides',
    text: 'Group rides and meetups with fellow riders around Bengaluru.',
  },
  {
    icon: Tag,
    title: 'Exclusive Offers',
    text: 'Members-only deals and early access to sales.',
  },
  {
    icon: Users,
    title: 'And More',
    text: 'New arrivals, gear tips and a community that rides together.',
  },
];

const WhatsAppCommunity = () => (
  <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#25D366]/10 blur-3xl pointer-events-none" />
    <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

    <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 sm:w-12 bg-[#25D366]" />
            <span className="text-[#128C7E] font-mono text-xs md:text-sm tracking-[0.25em] uppercase font-bold">
              WhatsApp Community
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[0.95] tracking-tight uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Join Our <span className="text-[#25D366]">Riders</span> Community
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed max-w-xl">
            Join weekend rides, get exclusive offers and more — straight on WhatsApp.
          </p>

          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 group rounded-full bg-[#25D366] hover:bg-[#1ebe5b] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-950 shadow-lg shadow-[#25D366]/25 transition-all duration-300"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 fill-gray-950" />
            Join the Community
            <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
                <Icon size={20} className="text-[#128C7E]" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm sm:text-base">{title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default WhatsAppCommunity;
