import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, X, Star, Check, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SortOption } from '../types';

export const SearchView: React.FC = () => {
  const { searchQuery, searchCategory, navigateTo } = useShop();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(80000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search filter query
  const searchResults = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();

    return ALL_PRODUCTS.filter((p) => {
      // Category filter
      if (searchCategory && searchCategory !== 'All' && p.category !== searchCategory) {
        return false;
      }

      // Query match (name, category, subcategory, brand, description)
      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSub = p.subcategory.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSub && !matchesBrand && !matchesDesc) {
          return false;
        }
      }

      // Subcategory filter
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
        return false;
      }

      // Rating filter
      if (p.rating < minRating) return false;

      // Price filter
      if (p.price > maxPrice) return false;

      // Stock filter
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [searchQuery, searchCategory, selectedSubcategory, minRating, maxPrice, inStockOnly, sortBy]);

  // Unique subcategories present in the search result
  const availableSubcategories = useMemo(() => {
    const subs = new Set<string>();
    ALL_PRODUCTS.forEach((p) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const matches = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
      if (matches) subs.add(p.subcategory);
    });
    return Array.from(subs).slice(0, 10);
  }, [searchQuery]);

  const resetFilters = () => {
    setSelectedSubcategory(null);
    setMinRating(0);
    setInStockOnly(false);
    setMaxPrice(80000);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedSubcategory !== null || minRating > 0 || inStockOnly || maxPrice < 80000;

  return (
    <div className="py-4 sm:py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#172554] cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">Search Results</span>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Results for <span className="text-[#172554]">"{searchQuery || 'All Items'}"</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {searchResults.length} products found in {searchCategory || 'All Departments'}
          </p>
        </div>

        {/* Mobile Filter toggle */}
        <div className="lg:hidden flex items-center justify-between gap-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filters ({searchResults.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside
          className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Subcategories */}
          {availableSubcategories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Subcategories
              </h4>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50">
                  <input
                    type="radio"
                    name="search-sub"
                    checked={selectedSubcategory === null}
                    onChange={() => setSelectedSubcategory(null)}
                    className="accent-[#172554]"
                  />
                  <span className={selectedSubcategory === null ? 'font-bold text-[#172554]' : 'text-slate-600'}>
                    All ({searchResults.length})
                  </span>
                </label>
                {availableSubcategories.map((sub) => (
                  <label key={sub} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50">
                    <input
                      type="radio"
                      name="search-sub"
                      checked={selectedSubcategory === sub}
                      onChange={() => setSelectedSubcategory(sub)}
                      className="accent-[#172554]"
                    />
                    <span className={selectedSubcategory === sub ? 'font-bold text-[#172554]' : 'text-slate-600'}>
                      {sub}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-colors ${
                    minRating === stars
                      ? 'border-amber-400 bg-amber-50/60 font-bold text-amber-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span>{stars}★ & above</span>
                  </div>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
              <span>Max Price</span>
              <span className="text-[#172554]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50}
              max={80000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#172554] cursor-pointer"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#172554] accent-[#172554]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-3">
          {/* Top Sort Header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Showing <strong>{searchResults.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="search-sort" className="font-semibold text-slate-500">Sort by:</label>
              <div className="relative">
                <select
                  id="search-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 outline-none cursor-pointer appearance-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Customer Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-black text-slate-800">
                No products found for "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Check spelling, try broader keywords, or browse through one of our 9 main categories.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="mt-4 px-6 py-2.5 bg-[#172554] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Browse All Marketplace Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
