// //frontend/src/components/Header.jsx

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Clock, ChevronDown, Instagram } from 'lucide-react';
import { INSTAGRAM_FOLLOW_LABEL, INSTAGRAM_URL } from '@/config/contact';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import { shopCategories } from '@/components/MegaMenu';
import ShopByBikeMenu, { bikeGroups } from '@/components/ShopByBikeMenu';
import SearchBar from '@/components/SearchBar';
import { productsUrl } from '@/utils/urlUtils';
const Header = forwardRef((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobileBikeOpen, setIsMobileBikeOpen] = useState(false);
  const [expandedBikeBrand, setExpandedBikeBrand] = useState('');
  const [expandedMobileCategory, setExpandedMobileCategory] = useState('');
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [instagramCtaShowsFollow, setInstagramCtaShowsFollow] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setInstagramCtaShowsFollow((current) => !current);
    }, 3500);
    return () => window.clearInterval(intervalId);
  }, []);


  const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  
  const announcementRef = useRef(null);
  const navbarRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash === '#shop-by-brand') {
      setTimeout(() => {
        document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    setDesktopMenu(null);
  }, [location.pathname]);

  const handleBrandScroll = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('shop-by-brand')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileBikeOpen(false);
    setExpandedBikeBrand('');
    setExpandedMobileCategory('');
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

  const mobileMenuTextClass =
    'text-base font-bold tracking-wide text-gray-950 transition-colors hover:text-[#e63946]';
  const mobileMenuRowClass = `block w-full border-b border-gray-100 px-5 py-3.5 text-left ${mobileMenuTextClass}`;
  const mobileMenuButtonRowClass = `flex w-full items-center justify-between border-b border-gray-100 px-5 py-3.5 text-left ${mobileMenuTextClass}`;
  const mobileMenuSubTextClass =
    'text-base font-bold tracking-wide text-white transition-colors hover:text-[#e63946]';
  const mobileMenuSubRowClass = `block w-full border-b border-[#222] px-5 py-3.5 text-left ${mobileMenuSubTextClass}`;
  const mobileMenuSubButtonRowClass = `flex w-full items-center justify-between border-b border-[#222] px-5 py-3.5 text-left ${mobileMenuSubTextClass}`;

  const desktopNavLinkClass =
    'whitespace-nowrap text-lg uppercase tracking-[0.08em] text-[#0a0a0a] transition-colors hover:text-[#e63946] xl:text-xl 2xl:text-2xl';
  const desktopNavTriggerClass = `${desktopNavLinkClass} inline-flex items-center gap-1.5`;

  const instagramCtaLink = (variant) => (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      layout
      className={`font-montserrat-bold inline-flex shrink-0 items-center justify-center self-center overflow-hidden rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-base text-white shadow-sm transition-opacity hover:opacity-95 md:text-lg ${
        variant === 'desktop'
          ? `hidden py-3 md:inline-flex md:ml-10 lg:ml-16 xl:ml-20 md:py-3 ${instagramCtaShowsFollow ? 'gap-3.5' : 'gap-0'}`
          : `py-2 md:hidden ${instagramCtaShowsFollow ? 'gap-3' : 'gap-0'}`
      }`}
      animate={{
        paddingLeft: instagramCtaShowsFollow ? (variant === 'desktop' ? 20 : 14) : 14,
        paddingRight: instagramCtaShowsFollow ? (variant === 'desktop' ? 20 : 14) : 14,
      }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      aria-label={
        instagramCtaShowsFollow ? `Follow us on Instagram` : 'Instagram'
      }
    >
      <Instagram size={22} strokeWidth={2.25} className="shrink-0" aria-hidden />
      <motion.span
        className="block overflow-hidden whitespace-nowrap"
        initial={false}
        animate={{
          maxWidth: instagramCtaShowsFollow ? 80 : 0,
          opacity: instagramCtaShowsFollow ? 1 : 0,
          marginLeft: instagramCtaShowsFollow ? 4 : 0,
          x: instagramCtaShowsFollow ? 0 : 16,
        }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        {INSTAGRAM_FOLLOW_LABEL}
      </motion.span>
    </motion.a>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div ref={announcementRef} className="overflow-hidden bg-[#e63946] text-white text-xs font-bold py-1 tracking-widest uppercase">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <span key={idx} className="px-8">
              Free Shipping on Orders Above ₹5000 | Use Code: RIDEFREE
            </span>
          ))}
        </motion.div>
      </div>

      <div ref={navbarRef}>
        <div
          className={`relative transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/25' : ''}`}
          onMouseLeave={() => setDesktopMenu(null)}
        >
        <div className="w-full bg-[#FDE047] px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-6 xl:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-2 sm:gap-x-4 sm:gap-y-3 md:min-h-[6.75rem] md:gap-x-5 md:gap-y-5 xl:min-h-[7.25rem]">
              <div className="relative z-10 col-start-1 row-start-1 flex shrink-0 items-center gap-1 self-center pl-2 sm:gap-2 sm:pl-5 md:pl-8 lg:pl-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen((open) => !open);
                    setDesktopMenu(null);
                  }}
                  className="flex items-center p-1 text-[#0a0a0a] transition-colors hover:text-[#e63946] xl:hidden"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? (
                    <X size={28} strokeWidth={2.25} className="sm:h-8 sm:w-8" />
                  ) : (
                    <Menu size={28} strokeWidth={2.25} className="sm:h-8 sm:w-8" />
                  )}
                </button>
                <Link to="/" className="flex shrink-0 items-center">
                  <img
                    src="/logo.webp"
                    alt="Moto Gears - Bike Accessories"
                    className="h-14 w-auto object-contain sm:h-20 md:h-28 xl:h-[7.5rem]"
                  />
                </Link>
              </div>

              <div
                id="header-search-panel"
                className="relative z-30 col-span-3 row-start-2 flex min-w-0 flex-col items-stretch gap-2 overflow-visible sm:flex-row sm:items-center sm:justify-center sm:gap-3 md:col-span-1 md:col-start-2 md:row-start-1 md:w-full md:max-w-none md:px-2 lg:gap-4"
              >
                <div className="min-w-0 w-full md:max-w-2xl md:flex-1">
                  <SearchBar compact />
                </div>
                {instagramCtaLink('desktop')}
              </div>

              <div className="relative z-10 col-start-3 row-start-1 flex shrink-0 items-center justify-self-end gap-2 sm:gap-3 md:gap-6">
                {instagramCtaLink('mobile')}
                <Link to="/cart" className="relative flex items-center p-1 text-[#0a0a0a] transition-colors hover:text-[#e63946] group" aria-label="Cart">
                  <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e63946] text-[11px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowAccountMenu((current) => !current);
                      return;
                    }
                    setShowAuth(true);
                  }}
                  className="flex items-center p-1 text-[#0a0a0a] transition-colors hover:text-[#e63946] sm:max-w-[8rem] md:max-w-36"
                  title={isAuthenticated ? 'Account menu' : 'Login / Sign up'}
                  aria-label={isAuthenticated ? 'Account menu' : 'Login or sign up'}
                >
                  {isAuthenticated ? (
                    <>
                      <User className="h-7 w-7 shrink-0 sm:hidden sm:h-8 sm:w-8" strokeWidth={2.25} />
                      <span className="hidden truncate text-base font-bold uppercase sm:inline">
                        {user?.name || 'Account'}
                      </span>
                    </>
                  ) : (
                    <User className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} />
                  )}
                </button>

                <AnimatePresence>
                  {isAuthenticated && showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-full z-[70] mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-xl"
                    >
                      <div className="border-b border-gray-100 px-3 py-2">
                        <p className="truncate text-sm font-bold">{user?.name || 'Account'}</p>
                        {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowAccountMenu(false)}
                          className="mt-2 block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-gray-900 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setShowAccountMenu(false)}
                        className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-gray-900 hover:bg-gray-100"
                      >
                        <Clock size={16} />
                        Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-bold text-[#e63946] hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <nav
              className="font-montserrat-bold hidden min-w-0 flex-col items-stretch gap-5 pb-1 pl-5 pt-5 uppercase tracking-[0.08em] sm:pl-6 md:pl-8 lg:pl-10 xl:flex"
              aria-label="Shop categories"
            >
              <div className="flex min-w-0 flex-wrap items-center justify-start gap-x-8 gap-y-3 xl:gap-x-10 2xl:gap-x-12">
                <div
                  className="relative shrink-0"
                  onMouseEnter={() => setDesktopMenu('bike')}
                >
                  <button
                    type="button"
                    className={`${desktopNavTriggerClass} ${desktopMenu === 'bike' ? 'text-[#e63946]' : ''}`}
                  >
                    Shop By Bike
                    <ChevronDown
                      size={22}
                      strokeWidth={2.5}
                      className={`shrink-0 transition-transform duration-200 ${desktopMenu === 'bike' ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {shopCategories.slice(0, 4).map((category) => (
                  <Link
                    key={category.name}
                    to={category.isBrand ? '/products' : productsUrl({ category: category.name })}
                    className={`${desktopNavLinkClass} shrink-0`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="flex min-w-0 flex-wrap items-center justify-start gap-x-8 gap-y-3 xl:gap-x-10 2xl:gap-x-12">
                {shopCategories.slice(4).map((category) => (
                  <Link
                    key={category.name}
                    to={category.isBrand ? '/products' : productsUrl({ category: category.name })}
                    className={`${desktopNavLinkClass} shrink-0`}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link to="/products" className={`${desktopNavLinkClass} shrink-0`}>
                  All Products
                </Link>
              </div>
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {desktopMenu === 'bike' && (
            <div className="absolute left-0 right-0 top-full z-50 hidden pt-2 xl:block">
              <ShopByBikeMenu onClose={() => setDesktopMenu(null)} />
            </div>
          )}
        </AnimatePresence>

        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 xl:hidden"
            aria-hidden={!isMobileMenuOpen}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="absolute bottom-0 left-0 right-0 flex max-h-[min(88vh,820px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex shrink-0 items-center justify-center border-b border-gray-100 py-3 px-4">
                <span className="h-1 w-10 rounded-full bg-gray-300" aria-hidden />
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={2.25} />
                </button>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto pb-8 text-left text-gray-950">
                <button
                  type="button"
                  onClick={() => setIsMobileBikeOpen((open) => !open)}
                  className={mobileMenuButtonRowClass}
                  aria-expanded={isMobileBikeOpen}
                >
                  <span>Shop By Bike</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-200 ${isMobileBikeOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isMobileBikeOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden bg-[#0a0a0a]"
                    >
                      {bikeGroups.map((group) => {
                        const isBrandExpanded = expandedBikeBrand === group.brand;
                        return (
                          <div key={group.brand}>
                            <button
                              type="button"
                              onClick={() => setExpandedBikeBrand(isBrandExpanded ? '' : group.brand)}
                              className={mobileMenuSubButtonRowClass}
                              aria-expanded={isBrandExpanded}
                            >
                              <span>{group.brand}</span>
                              <ChevronDown
                                size={20}
                                className={`shrink-0 transition-transform duration-200 ${isBrandExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {isBrandExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-[#0a0a0a]"
                                >
                                  {group.items.map((item) => (
                                    <Link
                                      key={item.target}
                                      to={productsUrl({ bike: item.target })}
                                      onClick={closeMobileMenu}
                                      className={`${mobileMenuSubRowClass} pl-8 text-gray-200 hover:text-[#e63946]`}
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
                {shopCategories.map((category) => {
                  const isCategoryOpen = expandedMobileCategory === category.name;
                  return (
                    <div key={category.name}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMobileCategory(isCategoryOpen ? '' : category.name)
                        }
                        className={mobileMenuButtonRowClass}
                        aria-expanded={isCategoryOpen}
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isCategoryOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden bg-[#0a0a0a]"
                          >
                            {category.items.map((item) => {
                              const path = category.isBrand
                                ? productsUrl({ brand: item })
                                : productsUrl({ category: category.name, subcategory: item });
                              return (
                                <Link
                                  key={item}
                                  to={path}
                                  onClick={closeMobileMenu}
                                  className={`${mobileMenuSubRowClass} pl-8 text-gray-200 hover:text-[#e63946]`}
                                >
                                  {item}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <Link to="/products" onClick={closeMobileMenu} className={mobileMenuRowClass}>
                  All Products
                </Link>
                <Link
                  to={productsUrl({ filter: 'deals' })}
                  onClick={closeMobileMenu}
                  className={`${mobileMenuRowClass} text-[#e63946] hover:text-[#d62839]`}
                >
                  Best Deals
                </Link>
                <Link
                  to="/#shop-by-brand"
                  onClick={(e) => {
                    handleBrandScroll(e);
                    closeMobileMenu();
                  }}
                  className={mobileMenuRowClass}
                >
                  Shop By Brand
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className={`${mobileMenuRowClass} text-[#e63946] hover:text-[#d62839]`}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link to="/wishlist" onClick={closeMobileMenu} className={mobileMenuRowClass}>
                  My Wishlist
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowAccountMenu((current) => !current);
                      return;
                    }
                    closeMobileMenu();
                    setShowAuth(true);
                  }}
                  className={mobileMenuRowClass}
                >
                  {isAuthenticated ? user?.name || 'Account' : 'Login / Sign Up'}
                </button>
                {isAuthenticated && showAccountMenu && (
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-2">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => {
                          setShowAccountMenu(false);
                          closeMobileMenu();
                        }}
                        className={`${mobileMenuRowClass} border-b-0 py-2.5`}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => {
                        setShowAccountMenu(false);
                        closeMobileMenu();
                      }}
                      className={`flex items-center gap-2 border-b-0 py-2.5 px-0 ${mobileMenuTextClass}`}
                    >
                      <Clock size={18} />
                      Order History
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`block w-full border-b-0 py-2.5 text-left text-base font-bold tracking-wide text-[#e63946] hover:text-[#d62839]`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
