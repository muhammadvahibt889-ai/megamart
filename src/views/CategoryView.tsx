import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, X, Star, Check, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SortOption } from '../types';

export const CategoryView: React.FC = () => {
  const { selectedCategory, selectedSubcategory, navigateTo } = useShop();

  const currentCategoryMeta = CATEGORIES.find((c) => c.name === selectedCategory) || CATEGORIES[0];
  const categoryName = selectedCategory || currentCategoryMeta.name;

  // Filter States
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(selectedSubcategory || null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(80000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync subcategory if changed from outside
  React.useEffect(() => {
    setActiveSubcategory(selectedSubcategory || null);
  }, [selectedSubcategory]);

  // Products belonging to this category
  const baseProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.category === categoryName);
  }, [categoryName]);

  const categoryMaxPrice = useMemo(() => {
    if (baseProducts.length === 0) return 10000;
    return Math.max(...baseProducts.map((p) => p.price));
  }, [baseProducts]);

  // Set initial maxPrice based on category
  React.useEffect(() => {
    setMaxPrice(categoryMaxPrice);
  }, [categoryMaxPrice]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return baseProducts
      .filter((p) => {
        if (activeSubcategory && p.subcategory !== activeSubcategory) return false;
        if (p.price > maxPrice) return false;
        if (p.rating < minRating) return false;
        if (inStockOnly && !p.inStock) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0; // featured default
      });
  }, [baseProducts, activeSubcategory, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setActiveSubcategory(null);
    setMaxPrice(categoryMaxPrice);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = activeSubcategory !== null || minRating > 0 || inStockOnly || maxPrice < categoryMaxPrice;

  return (
    <div className="py-4 sm:py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#172554] cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">{categoryName}</span>
        {activeSubcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-amber-600">{activeSubcategory}</span>
          </>
        )}
      </div>

      {/* Category Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#172554] text-white p-6 sm:p-8 mb-6 shadow-md">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{currentCategoryMeta.icon}</span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{categoryName}</h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            {currentCategoryMeta.description}
          </p>
        </div>
      </div>

      {/* Subcategory Pills bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubcategory(null)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSubcategory === null
              ? 'bg-[#172554] text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          All {categoryName}
        </button>
        {currentCategoryMeta.subcategories.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setActiveSubcategory(sub)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeSubcategory === sub
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-900"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filter Products ({filteredProducts.length})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs font-bold bg-slate-100 p-1.5 rounded-lg border-0 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        {/* Sidebar Filters Desktop */}
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
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Subcategory
            </h4>
            <div className="space-y-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50">
                <input
                  type="radio"
                  name="subcategory"
                  checked={activeSubcategory === null}
                  onChange={() => setActiveSubcategory(null)}
                  className="accent-[#172554]"
                />
                <span className={activeSubcategory === null ? 'font-bold text-[#172554]' : 'text-slate-600'}>
                  All Subcategories
                </span>
              </label>
              {currentCategoryMeta.subcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50">
                  <input
                    type="radio"
                    name="subcategory"
                    checked={activeSubcategory === sub}
                    onChange={() => setActiveSubcategory(sub)}
                    className="accent-[#172554]"
                  />
                  <span className={activeSubcategory === sub ? 'font-bold text-[#172554]' : 'text-slate-600'}>
                    {sub}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
              <span>Max Price</span>
              <span className="text-[#172554]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={categoryMaxPrice}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#172554] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹{categoryMaxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
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
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-colors cursor-pointer ${
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

          {/* Availability */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Availability
            </h4>
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

        {/* Products Results Grid */}
        <div className="lg:col-span-3">
          {/* Top Sort and Results Header for Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
            <div className="text-xs text-slate-600">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products for{' '}
              <strong className="text-slate-900">{activeSubcategory || categoryName}</strong>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="sort-desktop" className="font-semibold text-slate-500">Sort by:</label>
              <div className="relative">
                <select
                  id="sort-desktop"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 outline-none cursor-pointer appearance-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="text-slate-400 font-medium">Applied filters:</span>
              {activeSubcategory && (
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  Subcategory: {activeSubcategory}
                  <button onClick={() => setActiveSubcategory(null)}>×</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  Rating: {minRating}★+
                  <button onClick={() => setMinRating(0)}>×</button>
                </span>
              )}
              {inStockOnly && (
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>×</button>
                </span>
              )}
              {maxPrice < categoryMaxPrice && (
                <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  Up to ₹{maxPrice.toLocaleString()}
                  <button onClick={() => setMaxPrice(categoryMaxPrice)}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-black text-slate-800">No products match your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range or clearing selected subcategory and rating filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-5 py-2.5 bg-[#172554] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#1E3A8A] transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
