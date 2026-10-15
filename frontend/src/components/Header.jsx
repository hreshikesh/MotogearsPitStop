// //frontend/src/components/Header.jsx

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Clock, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import MegaMenu, { shopCategories } from '@/components/MegaMenu';
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
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(null);


  const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));
const wishlistCount = useWishlistStore(state => state.products?.length || 0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  
  const announcementRef = useRef(null);
  const navbarRef = useRef(null);
  const searchToggleRef = useRef(null);
  const searchPanelRef = useRef(null);

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
    setShowSearchPanel(false);
    setDesktopMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!showSearchPanel) return;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (
        searchPanelRef.current?.contains(target) ||
        searchToggleRef.current?.contains(target)
      ) {
        return;
      }
      setShowSearchPanel(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowSearchPanel(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSearchPanel]);

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
    'whitespace-nowrap text-sm font-semibold text-white transition-colors hover:text-[#e63946] xl:text-base 2xl:text-[17px]';

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
          className={`relative bg-[#0a0a0a] border-b border-[#222] transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/40' : ''}`}
        >
        <div className="max-w-[1600px] mx-auto w-full px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 xl:py-4">
          <div className="flex min-h-[56px] w-full items-center gap-3 sm:min-h-[64px] md:gap-4 xl:grid xl:min-h-[72px] xl:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] xl:items-center xl:gap-6">
            <Link to="/" className="relative z-10 flex shrink-0 items-center xl:justify-self-start">
              <img
                src="/logo.webp"
                alt="Moto Gears - Bike Accessories"
                className="h-14 w-auto object-contain sm:h-16 md:h-20 xl:h-24"
              />
            </Link>

            <nav
              className="hidden min-w-0 xl:flex xl:justify-self-center xl:items-center xl:justify-center xl:gap-5 2xl:gap-7"
              aria-label="Shop categories"
            >
              <div
                className="relative shrink-0"
                onMouseEnter={() => setDesktopMenu('bike')}
                onMouseLeave={() => setDesktopMenu(null)}
              >
                <button
                  type="button"
                  className={`${desktopNavLinkClass} ${desktopMenu === 'bike' ? 'text-[#e63946]' : ''}`}
                >
                  Shop By Bike
                </button>
              </div>
              <div
                className="relative shrink-0"
                onMouseEnter={() => setDesktopMenu('shop')}
                onMouseLeave={() => setDesktopMenu(null)}
              >
                <button
                  type="button"
                  className={`${desktopNavLinkClass} ${desktopMenu === 'shop' ? 'text-[#e63946]' : ''}`}
                >
                  Categories
                </button>
              </div>
              {shopCategories.map((category) => (
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
            </nav>

            <div className="relative z-10 ml-auto flex shrink-0 items-center gap-3 sm:gap-4 md:gap-5 xl:ml-0 xl:justify-self-end">
            <button
              ref={searchToggleRef}
              type="button"
              onClick={() => {
                setShowSearchPanel(true);
                setIsMobileMenuOpen(false);
                setDesktopMenu(null);
              }}
              className={`flex items-center transition-colors ${showSearchPanel ? 'text-[#e63946]' : 'text-white hover:text-[#e63946]'}`}
              aria-label="Search"
              aria-expanded={showSearchPanel}
              aria-controls="header-search-panel"
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            <Link to="/wishlist" className="hidden sm:flex items-center text-white hover:text-[#e63946] transition-colors relative group">
               <Heart size={22} strokeWidth={2.5} />
               {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                     {wishlistCount}
                  </span>}
            </Link>
            
            <Link to="/cart" className="flex items-center text-white hover:text-[#e63946] transition-colors relative group" aria-label="Cart">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>}
            </Link>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowAccountMenu((current) => !current);
                  return;
                }
                setShowAuth(true);
              }}
              className="hidden sm:flex max-w-[7rem] md:max-w-32 items-center text-white hover:text-[#e63946] transition-colors"
              title={isAuthenticated ? 'Account menu' : 'Login / Sign up'}
            >
               {isAuthenticated ? (
                 <span className="truncate text-sm font-bold uppercase">{user?.name || 'Account'}</span>
               ) : (
                 <User size={22} strokeWidth={2.5} />
               )}
            </button>

            <AnimatePresence>
              {isAuthenticated && showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-6 top-[calc(100%-0.75rem)] z-[70] w-56 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-xl"
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

            <button
              onClick={() => {
                setIsMobileMenuOpen((open) => !open);
                setShowSearchPanel(false);
                setDesktopMenu(null);
              }}
              className="flex xl:hidden items-center text-white hover:text-[#e63946] transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {desktopMenu === 'bike' && (
            <div
              className="absolute left-0 right-0 top-full z-50 hidden xl:block"
              onMouseEnter={() => setDesktopMenu('bike')}
              onMouseLeave={() => setDesktopMenu(null)}
            >
              <ShopByBikeMenu onClose={() => setDesktopMenu(null)} />
            </div>
          )}
          {desktopMenu === 'shop' && (
            <div
              className="absolute left-0 right-0 top-full z-50 hidden xl:block"
              onMouseEnter={() => setDesktopMenu('shop')}
              onMouseLeave={() => setDesktopMenu(null)}
            >
              <MegaMenu onClose={() => setDesktopMenu(null)} />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSearchPanel && (
            <motion.div
              id="header-search-panel"
              ref={searchPanelRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 right-0 top-full z-40 border-t border-gray-200 bg-white shadow-lg shadow-gray-200/60"
            >
              <div className="mx-auto w-full max-w-[1600px] px-4 py-3 sm:px-5 sm:py-4 md:px-6">
                <div className="relative mx-auto w-full max-w-3xl pl-1 pr-10 sm:pr-12">
                  <button
                    type="button"
                    onClick={() => setShowSearchPanel(false)}
                    className="absolute right-0 top-2 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Close search"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>
                  <SearchBar
                    autoFocus
                    onSearchTriggered={() => setShowSearchPanel(false)}
                  />
                </div>
              </div>
            </motion.div>
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
