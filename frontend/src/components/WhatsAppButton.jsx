import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/contact';

const WhatsAppButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show notification bubble after 3s (once)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('wa-notif-dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open(
      getWhatsAppUrl(
        "Hi Moto Gears! I'm interested in your products. Can you help me find the right accessories for my bike?"
      ),
      '_blank'
    );
    setShowNotification(false);
    sessionStorage.setItem('wa-notif-dismissed', 'true');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setShowNotification(false);
    setIsDismissed(true);
    sessionStorage.setItem('wa-notif-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* ═══════ NOTIFICATION BUBBLE ═══════ */}
      <AnimatePresence>
        {showNotification && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-[272px] sm:w-[300px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200/80 overflow-hidden mr-2"
          >
            <div className="h-1 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E]" aria-hidden />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100/90 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors z-10"
              aria-label="Close notification"
            >
              <X size={14} strokeWidth={2.5} />
            </button>

            <div
              onClick={handleClick}
              className="group px-4 pt-3.5 pb-4 pr-11 cursor-pointer hover:bg-gray-50/80 transition-colors text-left"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
                  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-hidden>
                    <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.253.586 4.457 1.7 6.395L3.2 28.8l6.556-1.723a12.7 12.7 0 006.245 1.607c7.06 0 12.799-5.74 12.799-12.799 0-3.421-1.332-6.638-3.75-9.056A12.717 12.717 0 0016 3.2zm0 23.309a10.5 10.5 0 01-5.35-1.465l-.384-.228-3.973 1.043 1.06-3.874-.25-.4a10.51 10.51 0 01-1.61-5.585c0-5.83 4.743-10.574 10.574-10.574 2.825 0 5.48 1.1 7.478 3.099a10.51 10.51 0 013.097 7.478c0 5.83-4.744 10.573-10.574 10.573zm5.799-7.917c-.318-.16-1.882-.929-2.174-1.035-.292-.106-.504-.16-.716.16-.212.318-.822 1.035-1.008 1.248-.186.212-.371.239-.69.08-.318-.16-1.342-.494-2.556-1.577-.945-.842-1.583-1.883-1.769-2.201-.185-.318-.02-.49.14-.649.144-.143.318-.371.478-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.026-.557-.08-.16-.716-1.725-.981-2.362-.258-.62-.52-.536-.716-.546-.185-.008-.398-.01-.61-.01-.212 0-.557.08-.849.398-.291.318-1.113 1.088-1.113 2.653 0 1.566 1.14 3.08 1.299 3.293.16.212 2.243 3.425 5.436 4.803.76.328 1.352.523 1.815.67.762.242 1.457.208 2.006.126.612-.091 1.882-.769 2.148-1.512.266-.743.266-1.38.186-1.512-.08-.132-.291-.211-.61-.371z"/>
                  </svg>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-gray-900 leading-none tracking-tight">
                    MotoGears Support
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium leading-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Online now
                  </span>
                </div>
              </div>

              {/* Message + CTA */}
              <div className="mt-3.5 space-y-3">
                <p className="text-[13px] text-gray-600 leading-relaxed font-normal">
                  Need help choosing gear for your ride? We&apos;re here to help.
                </p>
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-[#1fb855] group-active:scale-[0.98]">
                  Chat on WhatsApp
                  <span className="text-base leading-none" aria-hidden>
                    →
                  </span>
                </span>
              </div>
            </div>

            {/* Arrow pointer (bottom) */}
            <div className="absolute -bottom-1.5 right-7 w-3 h-3 bg-white border-r border-b border-gray-200/80 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ MAIN BUTTON ═══════ */}
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
        {/* Pulsing rings (attention grabbers) */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" style={{ animationDuration: '2.5s' }} />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />

        {/* Content wrapper (relative to stay above pulse) */}
        <div className="relative flex items-center gap-2 px-4 py-4 sm:py-3.5">
          {/* WhatsApp icon (official SVG) */}
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 sm:w-7 sm:h-7 fill-white shrink-0 transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.253.586 4.457 1.7 6.395L3.2 28.8l6.556-1.723a12.7 12.7 0 006.245 1.607c7.06 0 12.799-5.74 12.799-12.799 0-3.421-1.332-6.638-3.75-9.056A12.717 12.717 0 0016 3.2zm0 23.309a10.5 10.5 0 01-5.35-1.465l-.384-.228-3.973 1.043 1.06-3.874-.25-.4a10.51 10.51 0 01-1.61-5.585c0-5.83 4.743-10.574 10.574-10.574 2.825 0 5.48 1.1 7.478 3.099a10.51 10.51 0 013.097 7.478c0 5.83-4.744 10.573-10.574 10.573zm5.799-7.917c-.318-.16-1.882-.929-2.174-1.035-.292-.106-.504-.16-.716.16-.212.318-.822 1.035-1.008 1.248-.186.212-.371.239-.69.08-.318-.16-1.342-.494-2.556-1.577-.945-.842-1.583-1.883-1.769-2.201-.185-.318-.02-.49.14-.649.144-.143.318-.371.478-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.026-.557-.08-.16-.716-1.725-.981-2.362-.258-.62-.52-.536-.716-.546-.185-.008-.398-.01-.61-.01-.212 0-.557.08-.849.398-.291.318-1.113 1.088-1.113 2.653 0 1.566 1.14 3.08 1.299 3.293.16.212 2.243 3.425 5.436 4.803.76.328 1.352.523 1.815.67.762.242 1.457.208 2.006.126.612-.091 1.882-.769 2.148-1.512.266-.743.266-1.38.186-1.512-.08-.132-.291-.211-.61-.371z"/>
          </svg>

          {/* Expanding label (desktop) */}
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

        {/* Notification badge (top-right) */}
        {!isDismissed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 400 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg z-20"
          >
            <span className="text-white text-[10px] font-black">1</span>
            {/* Pulse ring for badge */}
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;