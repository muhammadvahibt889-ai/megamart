import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Flame,
  Tag,
  Mail,
  Check,
  Percent,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';
import { ALL_PRODUCTS } from '../data/products';
import { GROCERIES_PRODUCTS } from '../data/products/groceries';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';

export const HomeView: React.FC = () => {
  const { navigateTo, recentlyViewed } = useShop();

  // Deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 18 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  // Curated datasets
  const todayDeals = ALL_PRODUCTS.filter((p) => p.isDeal || p.price < p.originalPrice * 0.75).slice(0, 6);
  const bestsellers = ALL_PRODUCTS.filter((p) => p.isBestseller).slice(0, 10);
  const trending = ALL_PRODUCTS.filter((p) => p.isTrending || p.rating >= 4.8).slice(0, 10);
  const newArrivals = ALL_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 8);
  const recommended = ALL_PRODUCTS.filter((p) => p.rating >= 4.7 && !p.isBestseller).slice(0, 10);
  const grocerySpotlight = GROCERIES_PRODUCTS.slice(0, 8);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#0f172a] text-white shadow-xl mt-4 sm:mt-6 border border-slate-700/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Great MegaMart Shopping Carnival</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Discover More. <br />
              <span className="text-amber-400">Shop Smarter.</span>
            </h1>

            <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
              India's premier online marketplace. Shop the latest electronics, trendsetting fashion,
              home essentials, sports gear, and fresh supermarket groceries delivered in minutes.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('todays-deals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('food-groceries')}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>🥦 15-Min Groceries</span>
              </button>
            </div>
          </div>

          {/* Hero Feature cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto shrink-0 max-w-sm">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <Truck className="w-6 h-6 text-sky-400 mb-2" />
              <div className="font-bold text-sm text-white">Free Delivery</div>
              <div className="text-[11px] text-slate-300 mt-0.5">On all orders above ₹499</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <Zap className="w-6 h-6 text-amber-400 mb-2" />
              <div className="font-bold text-sm text-white">15-Min Express</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Micro-hubs across city</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="font-bold text-sm text-white">100% Genuine</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Direct brand authorized</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <RotateCcw className="w-6 h-6 text-rose-400 mb-2" />
              <div className="font-bold text-sm text-white">Easy Returns</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Instant refund policy</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S DEALS SECTION */}
      <section id="todays-deals" className="scroll-mt-24">
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 sm:p-8 border border-amber-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wide mb-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>TODAY'S MEGA DEALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Up to 50% OFF Limited Time Offers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Handpicked blockbuster discounts expiring shortly
              </p>
            </div>

            {/* Live Ticking Countdown */}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-amber-200">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-600">Ends in:</span>
              <div className="flex items-center gap-1 text-sm font-black text-[#172554]">
                <span className="w-7 text-center bg-slate-100 rounded px-1 py-0.5">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="w-7 text-center bg-slate-100 rounded px-1 py-0.5">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="w-7 text-center bg-slate-100 rounded px-1 py-0.5 text-red-600">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {todayDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore 9 curated departments covering millions of products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.id === 'food-groceries') {
                  navigateTo('food-groceries');
                } else {
                  navigateTo('category', { category: cat.name });
                }
              }}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#172554] hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-xl mr-1.5">{cat.icon}</span>
                    <span className="text-lg font-black text-white">{cat.name}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#172554] group-hover:text-amber-600 transition-colors">
                  <span>Explore Department</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLING PRODUCTS */}
      <ProductCarousel
        title="Bestselling Products"
        subtitle="Most loved and frequently ordered by customers this week"
        badge="Top Sellers"
        products={bestsellers}
        onViewAll={() => navigateTo('category', { category: 'Electronics' })}
      />

      {/* 5. TRENDING PRODUCTS */}
      <ProductCarousel
        title="Trending Right Now"
        subtitle="High-velocity favorites with exceptional customer reviews"
        badge="Popular"
        products={trending}
        onViewAll={() => navigateTo('category', { category: 'Fashion' })}
      />

      {/* 6. NEW ARRIVALS */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh additions just landed in our catalog"
        badge="Latest"
        products={newArrivals}
        onViewAll={() => navigateTo('category', { category: 'Home & Kitchen' })}
      />

      {/* 7. RECOMMENDED PRODUCTS */}
      <ProductCarousel
        title="Recommended for You"
        subtitle="Curated based on trending styles and seasonal essentials"
        badge="Recommended"
        products={recommended}
      />

      {/* 8. FOOD & GROCERIES SECTION */}
      <section className="rounded-3xl bg-emerald-900 text-white p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>MEGAMART GROCERIES · 15-MINUTE DELIVERY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Farm-Fresh Produce & Daily Staples
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              10 Aisle Subcategories with 100+ fresh items: Alphonso mangoes, organic oils, dairy, snacks, and sweets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('food-groceries')}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer shrink-0"
          >
            Open Full Grocery Supermarket →
          </button>
        </div>

        {/* Grocery Spotlight Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {grocerySpotlight.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. SPECIAL OFFERS & SEASONAL PROMOTIONS */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Special Offers & Seasonal Promotions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Exclusive bank cards, exchange offers, and coupon bonuses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900 to-blue-900 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Mega Coupon</span>
              <h3 className="text-xl font-black mt-1">Extra 10% Instant Off</h3>
              <p className="text-xs text-indigo-200 mt-1">
                Apply coupon code <strong className="text-white">MEGAMART10</strong> at checkout on orders above ₹500.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-700/60 flex items-center justify-between text-xs font-bold text-amber-300">
              <span>Code: MEGAMART10</span>
              <span>Active</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-600 to-orange-700 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-black uppercase text-amber-200 tracking-wider">New Customer Bonus</span>
              <h3 className="text-xl font-black mt-1">Flat ₹50 Welcome Cash</h3>
              <p className="text-xs text-amber-100 mt-1">
                Use code <strong className="text-white">WELCOME50</strong> on your first order. Zero minimum cart value.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-500/60 flex items-center justify-between text-xs font-bold text-white">
              <span>Code: WELCOME50</span>
              <span>Available</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-teal-900 to-emerald-900 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">Zero Delivery Fee</span>
              <h3 className="text-xl font-black mt-1">Free Shipping Pass</h3>
              <p className="text-xs text-emerald-100 mt-1">
                Use code <strong className="text-white">FREEDEL</strong> to waive delivery fees on any single order.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-teal-700/60 flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>Code: FREEDEL</span>
              <span>Claim Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewed.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Recently Viewed Products
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly return to items you inspected in recent sessions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {recentlyViewed.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 11. NEWSLETTER SUBSCRIPTION */}
      <section className="bg-[#172554] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-4 font-black">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Get Weekly Deals & Secret Promo Codes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Subscribe to the MegaMart Insider Bulletin for exclusive discounts, lightning flash sales, and new arrival alerts.
          </p>

          {!newsletterSuccess ? (
            <form onSubmit={handleNewsletter} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm flex-1 outline-none focus:border-amber-400 focus:bg-white/15"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-md shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold">
              <Check className="w-4 h-4" />
              <span>Thank you! You're subscribed to MegaMart Insider.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
