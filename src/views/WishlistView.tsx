import React from 'react';
import { Heart, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigateTo } = useShop();

  const wishlistedProducts = ALL_PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Save your favorite gadgets, clothes, books, and essentials by clicking the heart icon on any card.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          Explore Trending Deals →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wishlist ({wishlistedProducts.length} items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Saved items ready to be added to your shopping cart anytime
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {wishlistedProducts.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
