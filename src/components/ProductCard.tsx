import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Plus, Minus, Check, Zap } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { navigateTo, addToCart, updateCartQuantity, cart, toggleWishlist, isWishlisted } = useShop();
  const [imageError, setImageError] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => navigateTo('product-details', { productId: product.id })}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative cursor-pointer"
    >
      {/* Top Badges & Wishlist Trigger */}
      <div className="relative w-full aspect-square bg-[#F3F4F6] p-4 flex items-center justify-center overflow-hidden">
        {/* Deal / Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs tracking-tight">
            {discountPercent}% OFF
          </span>
        )}

        {discountPercent === 0 && product.badge && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#172554] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all shadow-xs ${
            wishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 backdrop-blur-xs'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image with verified object-fit: contain */}
        <div className="w-full h-full flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              loading="lazy"
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-200 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
              <span className="text-3xl mb-1">📦</span>
              <span className="text-[11px] font-semibold">{product.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category micro-line */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="font-bold text-slate-700">{product.brand}</span>
            <span className="text-slate-400 truncate max-w-[120px]">{product.subcategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#172554] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="inline-flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-900 border border-amber-200/80">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount.toLocaleString()})
            </span>
          </div>

          {/* Prime-Style Delivery Promise */}
          <div className="mt-2 text-[11px] font-medium text-slate-600 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">{product.deliveryInfo}</span>
          </div>
        </div>

        {/* Price & Action Bottom Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-emerald-600 font-bold">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}
              </div>
            )}
          </div>

          {/* Add to Cart Stepper / Button */}
          {quantityInCart === 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-[#172554] text-white rounded-xl shadow-xs overflow-hidden shrink-0"
            >
              <button
                type="button"
                onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                className="p-1.5 hover:bg-[#1e3a8a] transition-colors cursor-pointer"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-black min-w-[20px] text-center">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                className="p-1.5 hover:bg-[#1e3a8a] transition-colors cursor-pointer"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
