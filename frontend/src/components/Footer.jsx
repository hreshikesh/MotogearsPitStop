import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, ArrowRight, MapPin } from 'lucide-react';
import { getWhatsAppUrl, INSTAGRAM_URL, YOUTUBE_URL } from '@/config/contact';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_PHONE_DISPLAY,
  STORE_LOCATION_PATH,
} from '@/config/business';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Footer = () => {
  return (
    <footer className="font-montserrat-bold bg-[#FDE047] border-t border-[#e5c940] pt-16 pb-8 text-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <Link to="/" className="block mb-6">
              <img 
                src="/logo.webp"
                alt="Moto Gears - Bike Accessories" 
                className="h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-[#0a0a0a]/85 text-sm mb-6 leading-relaxed">
              Your one-stop destination for premium motorcycle accessories and riding gear. Built for riders, engineered for roads.
            </p>
            <div className="flex gap-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-white/70 p-2 rounded-sm text-[#0a0a0a] hover:bg-[#e63946] hover:text-white transition-all" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              {YOUTUBE_URL ? (
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="bg-white/70 p-2 rounded-sm text-[#0a0a0a] hover:bg-[#e63946] hover:text-white transition-all" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              ) : (
                <span className="bg-white/70 p-2 rounded-sm text-[#0a0a0a]" title="Add VITE_YOUTUBE_URL to link this icon">
                  <Youtube size={20} aria-hidden />
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop', to: '/products' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Whitefield Store', to: STORE_LOCATION_PATH },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[#0a0a0a]/90 hover:text-[#e63946] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#e63946] transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-lg mb-6 tracking-wider">CONTACT US</h4>
            <div className="space-y-4 text-sm text-[#0a0a0a]/90">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#e63946] flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  {BUSINESS_ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </p>
              </div>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#128C7E] transition-colors group">
                <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 fill-[#25D366]" />
                <span>{BUSINESS_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg mb-6 tracking-wider">STAY UPDATED</h4>
            <p className="text-[#0a0a0a]/85 text-sm mb-4">Subscribe for latest products and exclusive deals.</p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white text-[#0a0a0a] font-montserrat-bold placeholder:font-montserrat-bold px-4 py-3 w-full focus:outline-none border border-[#0a0a0a]/20 focus:border-[#e63946]"
              />
              <button className="bg-[#0a0a0a] px-4 text-white hover:bg-[#e63946] transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#0a0a0a]/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#0a0a0a]/70 text-xs">
            © 2026 MotoGearsPitstop. All rights reserved.
          </p>
          <div className="flex gap-3">
             {['UPI', 'VISA', 'Mastercard', 'RuPay'].map((payment) => (
                <span key={payment} className="text-[#0a0a0a]/80 text-xs border border-[#0a0a0a]/25 bg-white/40 px-2 py-1 rounded-sm">{payment}</span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
