import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  MapPin,
  User,
  ChevronDown,
  Package,
  X,
  Menu,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';
import { ALL_PRODUCTS } from '../data/products';

export const Header: React.FC = () => {
  const {
    view,
    navigateTo,
    cartCount,
    cartSubtotal,
    wishlist,
    userProfile,
    searchQuery,
    searchCategory,
    setIsAccountModalOpen,
    setIsPincodeModalOpen,
  } = useShop();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(searchCategory || 'All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync when search query updates from outside
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Click outside listener for search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions
  const suggestions = localSearch.trim().length >= 1
    ? ALL_PRODUCTS.filter((p) => {
        const matchesCategory = localCategory === 'All' || p.category === localCategory;
        const matchesText =
          p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.brand.toLowerCase().includes(localSearch.toLowerCase());
        return matchesCategory && matchesText;
      }).slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);
    navigateTo('search', {
      searchQuery: localSearch.trim(),
      searchCategory: localCategory,
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#172554] text-white shadow-md">
      {/* Top micro-bar: Announcements and perks */}
      <div className="bg-[#0f172a] text-slate-300 text-[11px] px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px]">
              SALE
            </span>
            <span>MegaMart Great Shopping Festival is LIVE! Extra 10% OFF with code <strong>MEGAMART10</strong></span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-amber-300">Free Express Delivery on orders above ₹499</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <button
              onClick={() => navigateTo('orders')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Mobile menu hamburger toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo and Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                Mega<span className="text-amber-400">Mart</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold mt-0.5 hidden sm:block">
                Discover More. Shop Smarter.
              </span>
            </div>
          </button>

          {/* Delivery Location Selector */}
          <button
            type="button"
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 transition-all text-left cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-300 block">Deliver to {userProfile.name.split(' ')[0]}</span>
              <span className="font-bold text-white truncate max-w-[140px] block">
                {userProfile.selectedAddress.split(',')[0]}
              </span>
            </div>
          </button>
        </div>

        {/* Large Amazon-Style Search Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-stretch bg-white rounded-xl overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-amber-400"
          >
            {/* Category Dropdown */}
            <div className="relative hidden md:block shrink-0 border-r border-slate-200 bg-slate-100 hover:bg-slate-200 transition-colors">
              <select
                value={localCategory}
                onChange={(e) => setLocalCategory(e.target.value)}
                className="h-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer pr-6 appearance-none"
                aria-label="Select Category"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input field */}
            <input
              type="text"
              placeholder="Search smartphones, kurtis, cookware, books, cricket, groceries..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="flex-1 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none min-w-0"
            />

            {/* Clear Button if input active */}
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setIsSearchFocused(false);
                }}
                className="px-2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Submit Button in vibrant Amber */}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 sm:px-5 flex items-center justify-center transition-colors cursor-pointer shrink-0 font-bold"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete suggestions dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900 divide-y divide-slate-100">
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-[10px] text-amber-700 font-semibold">Press Enter to search all</span>
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => {
                    navigateTo('product-details', { productId: item.id });
                    setIsSearchFocused(false);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-amber-50/60 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.category} · {item.subcategory}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-[#172554] shrink-0 ml-2">
                    ₹{item.price}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Account & Profile */}
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors text-left cursor-pointer"
          >
            <User className="w-5 h-5 text-amber-400" />
            <div className="hidden lg:flex flex-col text-[11px] leading-tight">
              <span className="text-slate-300">Hello, {userProfile.name.split(' ')[0]}</span>
              <span className="font-bold text-white flex items-center gap-0.5">
                Account <ChevronDown className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          </button>

          {/* My Orders link */}
          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className={`hidden md:flex flex-col px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
              view === 'orders' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span className="text-[11px] text-slate-300 leading-tight">Returns &</span>
            <span className="text-xs font-bold text-white leading-tight">Orders</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => navigateTo('wishlist')}
            className={`relative p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              view === 'wishlist' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-200'}`} />
            <span className="hidden lg:inline text-xs font-bold">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 sm:static bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className={`flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 sm:px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
              view === 'cart' ? 'ring-2 ring-white' : ''
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#172554] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-500">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] uppercase font-bold text-slate-900">Cart</span>
              <span className="text-xs font-black text-slate-950">₹{cartSubtotal}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar below Header (Amazon-style strip) */}
      <nav className="bg-[#1e3a8a] text-white border-t border-blue-900/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 text-xs font-semibold py-1.5 whitespace-nowrap">
          {/* All Departments button */}
          <button
            onClick={() => navigateTo('home')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              view === 'home' ? 'bg-white text-[#172554] font-black shadow-xs' : 'hover:bg-white/10 text-white'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>All Departments</span>
          </button>

          {/* Nine Main Categories */}
          {CATEGORIES.map((cat) => {
            const isFood = cat.id === 'food-groceries';
            const isActive =
              (view === 'category' && (cat.name === 'Food & Groceries' ? false : cat.name === cat.name)) ||
              (view === 'food-groceries' && isFood);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (isFood) {
                    navigateTo('food-groceries');
                  } else {
                    navigateTo('category', { category: cat.name, subcategory: null });
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : isFood
                    ? 'bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold'
                    : 'hover:bg-white/10 text-slate-100 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {isFood && (
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded-sm ml-0.5">
                    15m
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Perks: Today's Deals */}
          <button
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('todays-deals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-amber-300 font-bold flex items-center gap-1 cursor-pointer ml-auto shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Today's Deals</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation if toggled */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            Browse All Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (cat.id === 'food-groceries') {
                    navigateTo('food-groceries');
                  } else {
                    navigateTo('category', { category: cat.name });
                  }
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left text-xs font-bold flex items-center gap-2 text-white"
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-300">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="flex items-center gap-1 hover:text-white"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Change Location</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('orders');
              }}
              className="hover:text-white"
            >
              My Orders
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
