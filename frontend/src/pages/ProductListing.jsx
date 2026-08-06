import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, PackageSearch, ArrowUpRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import SearchResultsHeader from '@/components/SearchResultsHeader';
import { products } from '@/data/products';
import { combineFilters, productMatchesBike, sortProducts } from '@/utils/searchUtils';

const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50" />
    <div className="p-3 sm:p-3.5 space-y-2">
      <div className="h-2 bg-gray-100 rounded w-1/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="w-9 h-9 bg-gray-100 rounded-full" />
      </div>
    </div>
  </div>
);

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);
  const isSyncingFromUrl = useRef(false);
  const isWritingToUrl = useRef(false);

  // Initial filters from URL
  const initialFilters = useMemo(() => ({
    searchQuery: searchParams.get('search') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    brands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
    bikes: searchParams.get('bike') ? [searchParams.get('bike')] : [],
    priceRange: [
      Number(searchParams.get('minPrice')) || 100,
      Number(searchParams.get('maxPrice')) || 150000,
    ],
    minRating: Number(searchParams.get('minRating')) || 0,
    hasDiscount: searchParams.get('hasDiscount') === 'true',
  }), [searchParams]);

  const [filters, setFilters] = useState(initialFilters);

  // Fake short loading state on filter change for smooth feel
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [filters, sortBy]);

  useEffect(() => {
    if (isWritingToUrl.current) {
      isWritingToUrl.current = false;
      return;
    }
    setFilters((prev) => {
      const next = {
        ...prev,
        searchQuery: searchParams.get('search') || '',
        categories: searchParams.get('category') ? [searchParams.get('category')] : [],
        brands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
        bikes: searchParams.get('bike') ? [searchParams.get('bike')] : [],
        minRating: Number(searchParams.get('minRating')) || 0,
        hasDiscount: searchParams.get('hasDiscount') === 'true',
      };
      const minPrice = Number(searchParams.get('minPrice')) || 100;
      const maxPrice = Number(searchParams.get('maxPrice')) || 150000;
      next.priceRange = [minPrice, maxPrice];
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      isSyncingFromUrl.current = true;
      return next;
    });
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlBackedFiltersChanged =
      (searchParams.get('search') || '') !== filters.searchQuery ||
      (searchParams.get('category') || '') !== (filters.categories[0] || '') ||
      (searchParams.get('brand') || '') !== (filters.brands[0] || '') ||
      (searchParams.get('bike') || '') !== (filters.bikes[0] || '') ||
      (Number(searchParams.get('minRating')) || 0) !== filters.minRating ||
      (searchParams.get('hasDiscount') === 'true') !== filters.hasDiscount ||
      (Number(searchParams.get('minPrice')) || 100) !== filters.priceRange[0] ||
      (Number(searchParams.get('maxPrice')) || 150000) !== filters.priceRange[1];

    if (urlBackedFiltersChanged && isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    if (filters.searchQuery) params.set('search', filters.searchQuery);
    else params.delete('search');
    if (filters.categories.length === 1) params.set('category', filters.categories[0]);
    else if (filters.categories.length !== 1 && params.has('category')) params.delete('category');
    if (filters.brands.length === 1) params.set('brand', filters.brands[0]);
    else if (filters.brands.length !== 1 && params.has('brand')) params.delete('brand');
    if (filters.bikes.length === 1) params.set('bike', filters.bikes[0]);
    else if (filters.bikes.length !== 1 && params.has('bike')) params.delete('bike');
    if (filters.priceRange[0] > 100) params.set('minPrice', filters.priceRange[0]);
    else params.delete('minPrice');
    if (filters.priceRange[1] < 150000) params.set('maxPrice', filters.priceRange[1]);
    else params.delete('maxPrice');
    if (filters.minRating > 0) params.set('minRating', filters.minRating);
    else params.delete('minRating');
    if (filters.hasDiscount) params.set('hasDiscount', 'true');
    else params.delete('hasDiscount');

    if (params.toString() !== searchParams.toString()) {
      isWritingToUrl.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const subcategoryParam = searchParams.get('subcategory');
  const bikeParam = searchParams.get('bike');
  const brandParam = searchParams.get('brand');
  const subcategoryName = subcategoryParam || null;
  const bikeName = bikeParam || null;
  const brandName = brandParam || null;

  const filteredProducts = useMemo(() => {
    let result = products;
    if (subcategoryParam) {
      const subcategoryLower = subcategoryParam.toLowerCase().trim();
      result = result.filter((product) =>
        product.subcategory?.toLowerCase().trim() === subcategoryLower
      );
    }
    if (bikeParam) {
      result = result.filter((product) => productMatchesBike(product, bikeParam));
    }
    if (brandParam) {
      const brandLower = brandParam.toLowerCase().trim();
      result = result.filter(
        (product) => product.brand?.toLowerCase().trim() === brandLower
      );
    }
    const combined = combineFilters(result, filters);
    return sortProducts(combined, sortBy);
  }, [subcategoryParam, bikeParam, brandParam, filters, sortBy]);

  const handleFilterChange = useCallback((newFilterUpdates) => {
    setFilters((prev) => ({ ...prev, ...newFilterUpdates }));
  }, []);

  const handleRemoveFilter = useCallback(
    (type, value) => {
      if (type === 'subcategory') {
        const params = new URLSearchParams(searchParams);
        params.delete('subcategory');
        setSearchParams(params);
        return;
      }
      if (type === 'bike') {
        const params = new URLSearchParams(searchParams);
        params.delete('bike');
        setSearchParams(params);
        setFilters((prev) => ({ ...prev, bikes: [] }));
        return;
      }
      if (type === 'brand') {
        const params = new URLSearchParams(searchParams);
        params.delete('brand');
        setSearchParams(params);
        setFilters((prev) => ({ ...prev, brands: [] }));
        return;
      }
      setFilters((prev) => {
        const next = { ...prev };
        if (type === 'search') next.searchQuery = '';
        if (type === 'category') next.categories = next.categories.filter((c) => c !== value);
        if (type === 'priceRange') next.priceRange = [100, 150000];
        if (type === 'minRating') next.minRating = 0;
        if (type === 'hasDiscount') next.hasDiscount = false;
        return next;
      });
    },
    [searchParams, setSearchParams]
  );

  const handleClearAll = useCallback(() => {
    setSearchParams({});
    setFilters({
      searchQuery: '',
      categories: [],
      brands: [],
      bikes: [],
      priceRange: [100, 150000],
      minRating: 0,
      hasDiscount: false,
    });
  }, [setSearchParams]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  const pageHeading = brandName
    ? brandName
    : bikeName
    ? `Products for ${bikeName}`
    : subcategoryName
    ? subcategoryName
    : null;

  // Count active filters for mobile button badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.brands.length) count += filters.brands.length;
    if (filters.bikes.length) count += filters.bikes.length;
    if (filters.priceRange[0] > 100 || filters.priceRange[1] < 150000) count++;
    if (filters.minRating > 0) count++;
    if (filters.hasDiscount) count++;
    return count;
  }, [filters]);

  return (
    <>
      <Helmet>
        <title>
          {brandName
            ? `${brandName} Products - Shop Motorcycle Gear - MotoGearsPitstop`
            : bikeName
            ? `${bikeName} Accessories - Shop Motorcycle Gear - MotoGearsPitstop`
            : subcategoryName
            ? `${subcategoryName} - Shop Motorcycle Gear - MotoGearsPitstop`
            : 'Shop Motorcycle Gear & Accessories - MotoGearsPitstop'}
        </title>
        <meta
          name="description"
          content={
            brandName
              ? `Browse our collection of ${brandName} products. Premium quality motorcycle accessories and gear.`
              : bikeName
              ? `Browse our collection of accessories and gear for ${bikeName}. Premium quality riding gear and parts.`
              : subcategoryName
              ? `Browse our collection of ${subcategoryName} for motorcycles. Premium quality riding gear and accessories.`
              : 'Browse our complete collection of motorcycle accessories, riding gear, and performance parts.'
          }
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* ═══════ HEADER ═══════ */}
          <SearchResultsHeader
            totalResults={filteredProducts.length}
            query={filters.searchQuery}
            filters={filters}
            categoryName={pageHeading}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="flex gap-4 lg:gap-6 xl:gap-8 mt-4 sm:mt-6">
            {/* ═══════ DESKTOP SIDEBAR ═══════ */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearAll}
                />
              </div>
            </aside>

            {/* ═══════ MAIN CONTENT ═══════ */}
            <div className="flex-1 min-w-0">
              {/* ── Mobile Filter Button (Sticky) ── */}
              <div className="lg:hidden sticky top-16 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-md border-b border-gray-100 mb-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="group relative flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-red-600 text-white px-4 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-lg"
                >
                  <SlidersHorizontal size={15} />
                  <span>Filters & Sort</span>
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-red-600 group-hover:bg-white group-hover:text-red-600 text-white text-[10px] font-black rounded-full shadow-md">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* ═══════ PRODUCTS GRID ═══════ */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
                  >
                    {[...Array(8)].map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </motion.div>
                ) : filteredProducts.length > 0 ? (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={`${product.id}-${product.name}-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(index * 0.03, 0.3), // cap delay
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  // ═══════ EMPTY STATE ═══════
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center"
                  >
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <PackageSearch size={36} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-[2px] w-8 bg-red-600" />
                      <span className="text-red-600 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                        No Match
                      </span>
                      <div className="h-[2px] w-8 bg-red-600" />
                    </div>

                    <h3
                      className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-3"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      No Products Found
                    </h3>

                    <p className="text-gray-500 text-sm sm:text-base max-w-md mb-8">
                      We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                    </p>

                    <button
                      onClick={handleClearAll}
                      className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-red-600/40 hover:shadow-red-600/70 active:scale-95"
                    >
                      Clear All Filters
                      <ArrowUpRight
                        size={14}
                        className="group-hover:rotate-45 transition-transform duration-300"
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ═══════ RESULTS FOOTER ═══════ */}
              {!isLoading && filteredProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 sm:mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 text-gray-500 uppercase tracking-widest">
                 
                    <span>·</span>
                    <span>
                      Showing <span className="font-black text-gray-900 tabular-nums">{filteredProducts.length}</span> of{' '}
                      <span className="tabular-nums">{products.length}</span> products
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE FILTER DRAWER (slides from left) ═══════ */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto"
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-red-600" />
                  <h2
                    className="text-lg font-black uppercase tracking-tight text-gray-900"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Filters {activeFilterCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-600 text-white text-[10px] font-black rounded-full ml-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close filters"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Panel content */}
              <div className="p-4 pb-24">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearAll}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>

              {/* Sticky bottom CTA */}
              <div className="sticky bottom-0 border-t border-gray-100 bg-white p-3 flex gap-2 shadow-2xl">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-black uppercase tracking-widest text-xs hover:bg-gray-900 hover:text-white transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-[2] py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-red-600/40 flex items-center justify-center gap-2"
                >
                  Show {filteredProducts.length} Products
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductListing;