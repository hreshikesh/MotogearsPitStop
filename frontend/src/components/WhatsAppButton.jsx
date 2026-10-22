import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWhatsAppUrl } from '@/config/contact';

const WhatsAppButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    window.open(
      getWhatsAppUrl(
        "Hi Moto Gears! I'm interested in your products. Can you help me find the right accessories for my bike?"
      ),
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.92 }}
        className="relative group flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 border-2 border-white transition-all duration-300 overflow-hidden"
        aria-label="Contact us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" style={{ animationDuration: '2.5s' }} />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />

        <div className="relative flex items-center gap-2 px-4 py-4 sm:py-3.5">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 sm:w-7 sm:h-7 fill-white shrink-0 transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          >
            <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.253.586 4.457 1.7 6.395L3.2 28.8l6.556-1.723a12.7 12.7 0 006.245 1.607c7.06 0 12.799-5.74 12.799-12.799 0-3.421-1.332-6.638-3.75-9.056A12.717 12.717 0 0016 3.2zm0 23.309a10.5 10.5 0 01-5.35-1.465l-.384-.228-3.973 1.043 1.06-3.874-.25-.4a10.51 10.51 0 01-1.61-5.585c0-5.83 4.743-10.574 10.574-10.574 2.825 0 5.48 1.1 7.478 3.099a10.51 10.51 0 013.097 7.478c0 5.83-4.744 10.573-10.574 10.573zm5.799-7.917c-.318-.16-1.882-.929-2.174-1.035-.292-.106-.504-.16-.716.16-.212.318-.822 1.035-1.008 1.248-.186.212-.371.239-.69.08-.318-.16-1.342-.494-2.556-1.577-.945-.842-1.583-1.883-1.769-2.201-.185-.318-.02-.49.14-.649.144-.143.318-.371.478-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.026-.557-.08-.16-.716-1.725-.981-2.362-.258-.62-.52-.536-.716-.546-.185-.008-.398-.01-.61-.01-.212 0-.557.08-.849.398-.291.318-1.113 1.088-1.113 2.653 0 1.566 1.14 3.08 1.299 3.293.16.212 2.243 3.425 5.436 4.803.76.328 1.352.523 1.815.67.762.242 1.457.208 2.006.126.612-.091 1.882-.769 2.148-1.512.266-.743.266-1.38.186-1.512-.08-.132-.291-.211-.61-.371z" />
          </svg>

          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden sm:inline-block text-sm font-black uppercase tracking-widest whitespace-nowrap overflow-hidden pr-1"
              >
                Chat Now
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
