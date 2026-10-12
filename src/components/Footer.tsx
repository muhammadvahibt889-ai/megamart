import React from 'react';
import {
  ChevronUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Heart,
  Globe,
  CreditCard,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#172554] text-slate-300 mt-16 border-t border-slate-800">
      {/* Back to Top Amazon-style bar */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#1E3A8A] hover:bg-[#1e40af] text-center text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to Top</span>
      </button>

      {/* Trust & Guarantee strip */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Express 15-Min Delivery</div>
              <div className="text-xs text-slate-400">Micro-warehouses in your pin</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% Genuine Guarantee</div>
              <div className="text-xs text-slate-400">Direct authorized brands</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Free Shipping &gt; ₹499</div>
              <div className="text-xs text-slate-400">No hidden handling fees</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">No-Questions Return</div>
              <div className="text-xs text-slate-400">Doorstep pickup & refund</div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Brand Column */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl">
              M
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Mega<span className="text-amber-400">Mart</span>
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-sm">
            MegaMart is an Indian e-commerce marketplace built for discovering more and shopping smarter.
            Serving millions of households with authentic electronics, fashion apparel, home appliances,
            educational books, sports gear, and 15-minute grocery essentials.
          </p>

          <div className="pt-2 text-slate-400">
            <span>Customer Care Toll Free: </span>
            <strong className="text-white">1800-419-MEGAMART (24x7)</strong>
          </div>
        </div>

        {/* Explore Categories */}
        <div className="space-y-2">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Shop Departments
          </div>
          <ul className="space-y-2 text-slate-400">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => navigateTo('category', { category: cat.name })}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => navigateTo('food-groceries')}
                className="text-amber-400 font-bold hover:underline"
              >
                Food & Groceries (10 Aisles)
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-2">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Help & Customer Care
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => navigateTo('orders')} className="hover:text-amber-300">
                Track Active Order
              </button>
            </li>
            <li><a href="#" className="hover:text-amber-300">Shipping & Delivery Rates</a></li>
            <li><a href="#" className="hover:text-amber-300">Returns & Replacements</a></li>
            <li><a href="#" className="hover:text-amber-300">MegaMart Assistant</a></li>
            <li><a href="#" className="hover:text-amber-300">Help Center & FAQ</a></li>
          </ul>
        </div>

        {/* Business & Policies */}
        <div className="space-y-2">
          <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Connect & Legal
          </div>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-amber-300">Sell on MegaMart</a></li>
            <li><a href="#" className="hover:text-amber-300">Fulfillment by MegaMart</a></li>
            <li><a href="#" className="hover:text-amber-300">Privacy Notice</a></li>
            <li><a href="#" className="hover:text-amber-300">Conditions of Use</a></li>
            <li><a href="#" className="hover:text-amber-300">Interest-Based Ads</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="bg-[#0f172a] py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Payment Partners:</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">UPI</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">RuPay</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Visa</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Mastercard</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">NetBanking</span>
          </div>

          <p>© 2026 MegaMart Marketplace Private Limited. All rights reserved. Demo sample marketplace.</p>
        </div>
      </div>
    </footer>
  );
};
