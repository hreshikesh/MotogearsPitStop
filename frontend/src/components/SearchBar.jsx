import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchSuggestions from './SearchSuggestions';
import { shopCategories } from '@/components/MegaMenu';
import { getBikeSearchTarget, searchProducts } from '@/utils/searchUtils';
import { productUrl, productsUrl } from '@/utils/urlUtils';
import { getProductImage, handleProductImageError } from '@/utils/imageUtils';
import { trackMetaSearch } from '@/utils/metaPixel';

const SearchBar = ({ onSearchTriggered, autoFocus = false, compact = false }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        setResults(searchProducts(query).slice(0, 5));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (searchTerm) => {
    const term = typeof searchTerm === 'string' ? searchTerm : query;
    if (term.trim()) {
      const trimmedTerm = term.trim();
      const bikeSearchTarget = getBikeSearchTarget(trimmedTerm);

      saveRecentSearch(trimmedTerm);
      trackMetaSearch(trimmedTerm);
      navigate(
        bikeSearchTarget
          ? productsUrl({ bike: bikeSearchTarget })
          : productsUrl({ search: trimmedTerm })
      );
      setIsFocused(false);
      setQuery('');
      if (onSearchTriggered) onSearchTriggered();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <strong key={i} className="text-[#e63946]">{part}</strong> : part
        )}
      </span>
    );
  };

  const closeCategoryMenu = () => setShowCategoryMenu(false);

  return (
    <div
      className={`relative group ${compact ? 'w-full min-w-0' : 'w-full'}`}
      ref={searchRef}
    >
      {compact ? (
        <div className="relative flex min-h-[48px] items-stretch rounded-full border border-gray-300 bg-white shadow-sm transition-colors focus-within:border-[#e63946] sm:min-h-[56px] md:min-h-[76px]">
          <button
            type="button"
            onClick={() => {
              setShowCategoryMenu((open) => !open);
              setIsFocused(false);
            }}
            className="font-montserrat-bold flex shrink-0 items-center gap-1.5 self-stretch rounded-l-full pl-4 pr-2 text-xs uppercase tracking-[0.08em] text-[#CA8A04] transition-colors hover:text-[#e63946] sm:pl-5 sm:pr-2.5 sm:text-sm"
            aria-expanded={showCategoryMenu}
            aria-haspopup="true"
          >
            <span className="hidden sm:inline">All Categories</span>
            <span className="sm:hidden">Categories</span>
            <ChevronDown
              size={16}
              strokeWidth={2.25}
              className={`shrink-0 text-[#CA8A04] transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className="my-2 w-px shrink-0 self-stretch bg-gray-300 md:my-3.5"
            aria-hidden
          />

          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowCategoryMenu(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="WHAT ARE YOU LOOKING FOR?"
              className="font-montserrat h-full min-h-[48px] w-full border-0 bg-transparent py-2 pl-3 pr-12 text-sm uppercase tracking-[0.06em] text-[#0a0a0a] placeholder:uppercase placeholder:tracking-[0.06em] placeholder:text-gray-400 focus:outline-none sm:min-h-[56px] sm:py-2.5 sm:pl-4 sm:pr-14 sm:text-base md:min-h-[76px] md:py-4 md:pl-5 md:pr-16"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-14 top-1/2 z-20 -translate-y-1/2 text-gray-400 hover:text-gray-900 sm:right-16"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            <button
              onClick={() => handleSearch()}
              type="button"
              aria-label="Search"
              className="absolute right-0 top-0 z-20 flex h-full min-w-[2.75rem] items-center justify-center rounded-r-full px-3 text-[#CA8A04] transition-colors hover:text-[#e63946] sm:min-w-[3.25rem] sm:px-5 md:min-w-[3.5rem] md:px-6"
            >
              <Search className="h-5 w-5 md:h-[26px] md:w-[26px]" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for helmets, jackets, brands..."
            className="relative z-10 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-20 text-sm font-medium text-gray-900 shadow-sm placeholder-gray-500 transition-all focus:border-[#e63946] focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-12 z-20 text-gray-400 hover:text-gray-900"
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={() => handleSearch()}
            type="button"
            aria-label="Search"
            className="absolute right-0 top-0 z-20 flex h-full items-center justify-center rounded-r-md bg-[#e63946] px-4 text-white transition-colors hover:bg-[#d62839]"
          >
            <Search size={18} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {compact && showCategoryMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-montserrat-bold absolute left-0 top-full z-[110] mt-2 w-72 max-h-[min(70vh,420px)] overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-xl"
          >
            <Link
              to="/products"
              onClick={closeCategoryMenu}
              className="block px-4 py-2.5 text-sm uppercase tracking-wide text-[#0a0a0a] transition-colors hover:bg-gray-50 hover:text-[#e63946]"
            >
              All Categories
            </Link>
            <div className="my-1 border-t border-gray-100" />
            {shopCategories.map((category) => (
              <Link
                key={category.name}
                to={category.isBrand ? '/products' : productsUrl({ category: category.name })}
                onClick={closeCategoryMenu}
                className="block px-4 py-2.5 text-sm text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#e63946]"
              >
                {category.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            className="absolute top-full mt-1 left-0 right-0 z-[100]"
          >
            {!query ? (
              <SearchSuggestions 
                query={query}
                recentSearches={recentSearches}
                onSelect={handleSearch}
                onClearRecent={clearRecentSearches}
              />
            ) : results.length > 0 ? (
              <div className="bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                {results.map((product, index) => (
                  <button 
                    key={`${product.id}-${product.name}-${index}`} 
                    onClick={() => {
                      navigate(productUrl(product));
                      setIsFocused(false);
                      setQuery('');
                      if (onSearchTriggered) onSearchTriggered();
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-left"
                  >
                    <div className="w-12 h-12 bg-gray-100 p-1 flex-shrink-0">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        onError={(event) => handleProductImageError(event, product)}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-gray-900 text-sm font-medium line-clamp-1">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                         <span className="text-gray-500 text-xs">{product.brand}</span>
                         <span className="text-[#e63946] text-xs font-bold">₹{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
                <button 
                  onClick={() => handleSearch()}
                  className="w-full p-3 text-center text-sm text-white bg-[#e63946]/10 hover:bg-[#e63946]/20 text-[#e63946] font-bold transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 shadow-lg rounded-md p-6 text-center text-gray-500 text-sm">
                No products found matching "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
