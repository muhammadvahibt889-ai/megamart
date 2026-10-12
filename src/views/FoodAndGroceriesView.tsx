import React, { useState, useMemo } from 'react';
import { Search, Zap, Clock, ShieldCheck, ArrowUpDown, ChevronRight, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GROCERIES_PRODUCTS } from '../data/products/groceries';
import { ProductCard } from '../components/ProductCard';
import { SortOption } from '../types';

export const GROCERY_SUBCATEGORIES = [
  { name: 'All Aisles', icon: '🛒', desc: 'Browse all 100 fresh grocery and pantry staples' },
  { name: 'Fruits & Vegetables', icon: '🥕', desc: 'Crisp organic fruits and daily vegetables picked fresh' },
  { name: 'Snacks & Chips', icon: '🍿', desc: 'Kettle crisps, roasted cashews, makhana and dips' },
  { name: 'Drinks & Beverages', icon: '🧃', desc: 'Cold pressed juices, cold brews, green tea & spring water' },
  { name: 'Rice, Flour & Grains', icon: '🌾', desc: 'Aged basmati, MP sharbati atta, quinoa, poha and oats' },
  { name: 'Dairy & Eggs', icon: '🥛', desc: 'A2 Gir cow milk, farm eggs, paneer, butter and greek yogurt' },
  { name: 'Bakery', icon: '🍞', desc: 'Zero maida wheat breads, sourdough, croissants and muffins' },
  { name: 'Chocolates & Sweets', icon: '🍫', desc: '70% dark chocolates, kaju katli, dates and caramel sweets' },
  { name: 'Cooking Essentials', icon: '🧂', desc: 'Cold-pressed oils, Himalayan salt, whole spices and ketchup' },
  { name: 'Frozen Foods', icon: '🧊', desc: 'Frozen green peas, sweet corn, fries, spring rolls and samosas' },
  { name: 'Packaged & Canned Foods', icon: '🥫', desc: 'Instant ramen, Italian pasta, peanut butter and canned chickpeas' },
];

export const FoodAndGroceriesView: React.FC = () => {
  const { navigateTo } = useShop();
  const [selectedSub, setSelectedSub] = useState<string>('All Aisles');
  const [searchInGrocery, setSearchInGrocery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    return GROCERIES_PRODUCTS.filter((p) => {
      if (selectedSub !== 'All Aisles' && p.subcategory !== selectedSub) return false;
      if (searchInGrocery.trim()) {
        const q = searchInGrocery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSub = p.subcategory.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });
  }, [selectedSub, searchInGrocery, sortBy]);

  const activeSubMeta = GROCERY_SUBCATEGORIES.find((s) => s.name === selectedSub) || GROCERY_SUBCATEGORIES[0];

  return (
    <div className="py-4 sm:py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <button onClick={() => navigateTo('home')} className="hover:text-[#172554] cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">Food & Groceries</span>
        {selectedSub !== 'All Aisles' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-emerald-600">{selectedSub}</span>
          </>
        )}
      </div>

      {/* Hero Supermarket Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 mb-8 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>MEGAMART SUPERMARKET · 15-MINUTE LIGHTNING DELIVERY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Food & Groceries
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Explore 10 curated supermarket aisles featuring 100 farm-fresh vegetables, cold-pressed oils,
              dairy essentials, snacks, and frozen favorites delivered in 15 minutes.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 max-w-xs shrink-0 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Clock className="w-4 h-4" />
              <span>Estimated Delivery: 12 - 15 Mins</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Triple Hygiene & Quality Inspection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Sort inside Groceries */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within groceries (apples, oil, milk, pasta...)"
            value={searchInGrocery}
            onChange={(e) => setSearchInGrocery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
          {searchInGrocery && (
            <button
              onClick={() => setSearchInGrocery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            <strong>{filteredProducts.length}</strong> items available
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 font-bold text-slate-800 outline-none cursor-pointer appearance-none"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Ten Grocery Subcategories Navigation Tabs */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Select Supermarket Aisle (10 Subcategories)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {GROCERY_SUBCATEGORIES.map((sub) => {
            const isSelected = selectedSub === sub.name;
            const count = sub.name === 'All Aisles'
              ? GROCERIES_PRODUCTS.length
              : GROCERIES_PRODUCTS.filter((p) => p.subcategory === sub.name).length;

            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => setSelectedSub(sub.name)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{sub.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count} items
                  </span>
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{sub.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Aisle Description */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{activeSubMeta.icon}</span>
            <span>{selectedSub}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeSubMeta.desc}</p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="text-5xl mb-3">🥦</div>
          <h3 className="text-lg font-black text-slate-800">No groceries match your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try another keyword or select All Aisles.</p>
          <button
            onClick={() => {
              setSelectedSub('All Aisles');
              setSearchInGrocery('');
            }}
            className="mt-4 px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
          >
            Reset Supermarket Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
