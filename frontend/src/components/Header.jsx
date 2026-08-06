// //frontend/src/components/Header.jsx

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart, 
  MessageCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import MegaMenu from '@/components/MegaMenu';
import ShopByBikeMenu, { bikeGroups } from '@/components/ShopByBikeMenu';
import SearchBar from '@/components/SearchBar';
import { productsUrl } from '@/utils/urlUtils';
import { getWhatsAppUrl } from '@/config/contact';

const Header = forwardRef((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'categories' | 'bike' | null
  const [showAuth, setShowAuth] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('main'); // 'main' | 'bike'
  const [expandedBikeBrand, setExpandedBikeBrand] = useState(bikeGroups[0]?.brand || '');

  const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const wishlistCount = useWishlistStore(state => state.products?.length || 0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const announcementRef = useRef(null);
  const navbarRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash navigation scroll support
  useEffect(() => {
    if (location.hash === '#shop-by-brand') {
      setTimeout(() => {
        document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const handleBrandScroll = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobilePanel('main');
  };

  const handleLogout = async () => {
    await logout();
    setShowAccountMenu(false);
    setIsMobileMenuOpen(false);
  };

  // Expose refs to parent component
  React.useImperativeHandle(ref, () => ({
    announcementRef,
    navbarRef
  }));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl border-b border-[#1f1f1f]' 
        : 'bg-[#0f0f0f]/90 backdrop-blur-sm border-b border-[#1a1a1a]'
    }`}>
      {/* Top Red Glow Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#e63946] to-transparent opacity-80" />

      {/* ═══════ ANNOUNCEMENT TICKER ═══════ */}
      <div 
        ref={announcementRef} 
        className="relative overflow-hidden bg-gradient-to-r from-[#d62828] via-[#e63946] to-[#d62828] text-white text-[11px] font-black py-1.5 tracking-widest uppercase shadow-inner"
      >
        <motion.div
          className="flex w-max whitespace-nowrap items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-6 px-6">
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="text-amber-300 animate-pulse" />
                Free Shipping on Orders Above ₹5,000
              </span>
              <span className="text-white/40">•</span>
              <span className="bg-black/30 text-white px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10">
                CODE: RIDEFREE
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1 text-slate-100">
                <ShieldCheck size={13} className="text-emerald-400" />
                100% Genuine Motorcycle Gear
              </span>
              <span className="text-white/40">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════ MAIN NAVBAR ═══════ */}
      <div ref={navbarRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img 
              src="https://horizons-cdn.hostinger.com/b0732b2e-a5cb-4f69-b759-3a6f5999db16/111a7deab5a62c41f8251ab9212d4b7d.png" 
              alt="Moto Gears - Bike Accessories" 
              className="h-9 sm:h-11 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden xl:flex items-center gap-7 relative">
            
            {/* Shop Categories Dropdown Trigger */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setActiveMenu('categories')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button 
                className={`flex items-center gap-1 font-extrabold text-xs tracking-wider uppercase transition-colors py-2 ${
                  activeMenu === 'categories' ? 'text-[#e63946]' : 'text-slate-200 hover:text-[#e63946]'
                }`}
              >
                Shop Categories
              </button>

              <AnimatePresence>
                {activeMenu === 'categories' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[85vw] max-w-[1200px] pt-2 z-50"
                  >
                    <MegaMenu onClose={() => setActiveMenu(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/products" 
              className="text-slate-200 hover:text-[#e63946] transition-colors font-extrabold text-xs tracking-wider uppercase whitespace-nowrap py-2"
            >
              All Products
            </Link>

            {/* Shop By Bike Dropdown Trigger */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setActiveMenu('bike')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button 
                className={`flex items-center gap-1 font-extrabold text-xs tracking-wider uppercase transition-colors py-2 ${
                  activeMenu === 'bike' ? 'text-[#e63946]' : 'text-slate-200 hover:text-[#e63946]'
                }`}
              >
                Shop By Bike
              </button>

              <AnimatePresence>
                {activeMenu === 'bike' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[85vw] max-w-[1200px] pt-2 z-50"
                  >
                    <ShopByBikeMenu onClose={() => setActiveMenu(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/about" 
              className="text-slate-200 hover:text-[#e63946] transition-colors font-extrabold text-xs tracking-wider uppercase whitespace-nowrap py-2"
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className="text-slate-200 hover:text-[#e63946] transition-colors font-extrabold text-xs tracking-wider uppercase whitespace-nowrap py-2"
            >
              Contact
            </Link>
          </nav>

          {/* SEARCH BAR (Desktop & Tablet) */}
          <div className="hidden md:block flex-1 max-w-md lg:max-w-xl relative mx-2">
            <SearchBar />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* WhatsApp Support */}
            <a 
              href={getWhatsAppUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-slate-300 hover:text-[#25D366] transition-colors group p-2 rounded-lg hover:bg-white/5"
              title="WhatsApp Support"
            >
              <MessageCircle size={20} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black tracking-wider uppercase hidden xl:block">Support</span>
            </a>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="hidden md:flex items-center text-slate-300 hover:text-[#e63946] transition-colors relative p-2 rounded-lg hover:bg-white/5 group"
              title="Wishlist"
            >
              <Heart size={20} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#e63946] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0f0f0f]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="flex items-center gap-2 text-slate-300 hover:text-[#e63946] transition-colors relative p-2 rounded-lg hover:bg-white/5 group"
              title="Cart"
            >
              <div className="relative">
                <ShoppingCart size={20} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0f0f0f] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-xs font-black tracking-wider uppercase">Cart</span>
            </Link>

            {/* User Account / Login */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setShowAccountMenu((prev) => !prev);
                    return;
                  }
                  setShowAuth(true);
                }}
                className="hidden md:flex items-center gap-2 text-slate-300 hover:text-[#e63946] transition-colors p-2 rounded-lg hover:bg-white/5 max-w-[150px]"
                title={isAuthenticated ? 'Account menu' : 'Login / Sign up'}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                  <User size={16} strokeWidth={2.5} />
                </div>
                {isAuthenticated && (
                  <span className="truncate text-xs font-black uppercase tracking-wider hidden lg:block text-slate-200">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                )}
              </button>

              {/* Account Popover Dropdown */}
              <AnimatePresence>
                {isAuthenticated && showAccountMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setShowAccountMenu(false)} 
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-[70] w-60 rounded-2xl border border-[#262626] bg-[#121212]/95 backdrop-blur-xl p-3 text-slate-100 shadow-2xl"
                    >
                      <div className="border-b border-[#222] px-3 py-2.5 mb-1">
                        <p className="truncate text-sm font-black uppercase tracking-wide text-white">
                          {user?.name || 'Rider'}
                        </p>
                        {user?.email && (
                          <p className="truncate text-[11px] font-mono text-slate-400 mt-0.5">
                            {user.email}
                          </p>
                        )}
                      </div>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-red-600/10 hover:text-[#e63946] transition-colors"
                        >
                          <LayoutDashboard size={15} className="text-[#e63946]" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/5 transition-colors"
                      >
                        <Clock size={15} className="text-slate-400" />
                        Order History
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/5 transition-colors"
                      >
                        <Heart size={15} className="text-slate-400" />
                        Saved Gear ({wishlistCount})
                      </Link>

                      <div className="border-t border-[#222] mt-2 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#e63946] hover:bg-red-600/10 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="xl:hidden text-slate-200 hover:text-[#e63946] transition-colors p-2 rounded-lg hover:bg-white/5"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden mt-3">
          <SearchBar onSearchTriggered={closeMobileMenu} />
        </div>
      </div>

      {/* ═══════ MOBILE FULLSCREEN DRAWER ═══════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'calc(100vh - 100px)', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden fixed inset-x-0 bottom-0 top-[110px] md:top-[85px] bg-[#0b0b0b] z-40 overflow-y-auto border-t border-[#1a1a1a]"
          >
            {mobilePanel === 'main' ? (
              <nav className="min-h-full pb-32 text-slate-200 divide-y divide-[#181818]">
                
                {/* Shop By Bike Drawer Switcher */}
                <button
                  onClick={() => setMobilePanel('bike')}
                  className="flex w-full items-center justify-between px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors bg-white/[0.02]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
                    Shop By Bike
                  </span>
                  <ChevronRight size={18} className="text-slate-500" />
                </button>

                <Link 
                  to="/products" 
                  onClick={closeMobileMenu} 
                  className="block px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors"
                >
                  All Products
                </Link>

                <Link 
                  to={productsUrl({ filter: 'deals' })} 
                  onClick={closeMobileMenu} 
                  className="flex items-center justify-between px-6 py-4.5 font-black text-sm tracking-widest uppercase text-[#e63946]"
                >
                  <span>Hot Deals</span>
                  <span className="text-[10px] bg-red-600/20 text-[#e63946] px-2 py-0.5 rounded font-mono border border-red-600/30">
                    SALE
                  </span>
                </Link>

                <Link 
                  to="/#shop-by-brand" 
                  onClick={(e) => { handleBrandScroll(e); closeMobileMenu(); }} 
                  className="block px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors"
                >
                  Shop By Brand
                </Link>

                <Link 
                  to="/about" 
                  onClick={closeMobileMenu} 
                  className="block px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors"
                >
                  About Us
                </Link>

                <Link 
                  to="/contact" 
                  onClick={closeMobileMenu} 
                  className="block px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors"
                >
                  Contact Us
                </Link>

                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={closeMobileMenu} 
                    className="flex items-center gap-2 px-6 py-4.5 font-black text-sm tracking-widest uppercase text-[#e63946] bg-red-600/5"
                  >
                    <LayoutDashboard size={16} />
                    Admin Panel
                  </Link>
                )}

                <Link 
                  to="/wishlist" 
                  onClick={closeMobileMenu} 
                  className="flex items-center justify-between px-6 py-4.5 font-black text-sm tracking-widest uppercase hover:text-[#e63946] transition-colors"
                >
                  <span>My Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Account Section Mobile */}
                <div className="p-6 bg-slate-900/40">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-[#222]">
                        <div className="w-10 h-10 rounded-full bg-red-600/20 text-[#e63946] flex items-center justify-center font-black">
                          {user?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase text-white">{user?.name || 'User'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{user?.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/orders"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white py-1.5"
                      >
                        <Clock size={16} /> Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-bold text-[#e63946] py-1.5"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        setShowAuth(true);
                      }}
                      className="w-full py-3 bg-[#e63946] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-red-600/20"
                    >
                      Login / Register
                    </button>
                  )}
                </div>

                <a 
                  href={getWhatsAppUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 px-6 py-4 font-black text-xs tracking-widest uppercase text-[#25D366] bg-[#25D366]/10"
                >
                  <MessageCircle size={18} /> WhatsApp Customer Support
                </a>
              </nav>
            ) : (
              /* MOBILE BIKE CATEGORY SUBPANEL */
              <div className="min-h-full pb-32 text-slate-200">
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3.5">
                  <button
                    onClick={() => setMobilePanel('main')}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                    aria-label="Back to main menu"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <span className="font-black text-sm tracking-widest uppercase text-white">
                    Select Your Bike
                  </span>
                </div>

                <div className="divide-y divide-[#181818]">
                  {bikeGroups.map((group) => {
                    const isExpanded = expandedBikeBrand === group.brand;
                    return (
                      <div key={group.brand}>
                        <button
                          onClick={() => setExpandedBikeBrand(isExpanded ? '' : group.brand)}
                          className="flex w-full items-center justify-between px-6 py-4 text-left font-black text-xs tracking-widest uppercase hover:text-[#e63946] transition-colors"
                        >
                          <span className={isExpanded ? 'text-[#e63946]' : 'text-slate-200'}>
                            {group.brand}
                          </span>
                          {isExpanded ? <Minus size={18} className="text-[#e63946]" /> : <Plus size={18} className="text-slate-500" />}
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-black/40"
                            >
                              <div className="space-y-1.5 px-6 pb-4 pt-1">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.target}
                                    to={productsUrl({ bike: item.target })}
                                    onClick={closeMobileMenu}
                                    className="block py-2 text-xs font-semibold text-slate-400 hover:text-[#e63946] transition-colors border-l-2 border-transparent hover:border-[#e63946] pl-3"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;