import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, ArrowRight, MapPin } from 'lucide-react';
import { getWhatsAppUrl, INSTAGRAM_URL } from '@/config/contact';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_PHONE_DISPLAY,
  STORE_LOCATION_PATH,
} from '@/config/business';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <Link to="/" className="block mb-6">
              <img 
                src="/logo.webp"
                alt="Moto Gears - Bike Accessories" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your one-stop destination for premium motorcycle accessories and riding gear. Built for riders, engineered for roads.
            </p>
            <div className="flex gap-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-gray-100 p-2 rounded-sm text-gray-600 hover:bg-[#e63946] hover:text-white transition-all" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              {[Facebook, Youtube, Twitter].map((Icon, i) => (
                <span key={i} className="bg-gray-100 p-2 rounded-sm text-gray-400 cursor-not-allowed" aria-hidden="true">
                  <Icon size={20} />
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop', to: '/products' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Whitefield Store', to: STORE_LOCATION_PATH },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-600 hover:text-[#e63946] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#e63946] transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#25D366] text-sm font-medium transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[1px] bg-[#25D366] transition-all" />
                  <WhatsAppIcon className="h-4 w-4 shrink-0 fill-[#25D366]" />
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">CONTACT US</h4>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#e63946] flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  {BUSINESS_ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </p>
              </div>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors group">
                <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 fill-[#25D366]" />
                <span>{BUSINESS_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wider">STAY UPDATED</h4>
            <p className="text-gray-600 text-sm mb-4">Subscribe for latest products and exclusive deals.</p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-50 text-gray-900 px-4 py-3 w-full focus:outline-none border border-gray-300 focus:border-[#e63946]"
              />
              <button className="bg-[#e63946] px-4 text-white hover:bg-[#d62839] transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 MotoGearsPitstop. All rights reserved.
          </p>
          <div className="flex gap-3">
             {['UPI', 'VISA', 'Mastercard', 'RuPay'].map((payment) => (
                <span key={payment} className="text-gray-500 text-xs border border-gray-300 px-2 py-1 rounded-sm">{payment}</span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
