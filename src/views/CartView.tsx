import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    activePromo,
    promoDiscount,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = 499;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center text-4xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore thousands of deals across
          electronics, fashion, kitchen, books, and fresh groceries.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-6 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all cursor-pointer"
        >
          Start Shopping Deals →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your chosen items, apply discount coupons, and proceed to checkout
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Milestone Progress */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            {isFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 bg-emerald-200 rounded-full p-0.5" />
                <span>Great! Your order qualifies for FREE Express Delivery!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-bold text-amber-900 mb-1.5">
                  <span>Add ₹{freeDeliveryThreshold - cartSubtotal} more for FREE Delivery</span>
                  <span>₹{cartSubtotal} / ₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    onClick={() => navigateTo('product-details', { productId: item.product.id })}
                    className="w-20 h-20 rounded-2xl bg-slate-100 p-2 shrink-0 flex items-center justify-center cursor-pointer border border-slate-200"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.product.brand} · {item.product.subcategory}
                    </div>
                    <h3
                      onClick={() => navigateTo('product-details', { productId: item.product.id })}
                      className="text-sm font-bold text-slate-900 hover:text-[#172554] cursor-pointer line-clamp-2"
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-600">
                        {item.product.inStock ? 'In Stock' : 'Limited Stock'}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{item.product.deliveryInfo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition-colors cursor-pointer"
                      title="Decrease"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition-colors cursor-pointer"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[11px] text-slate-400">
                        ₹{item.product.price.toLocaleString()} each
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer hidden sm:block"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs font-bold text-[#172554] hover:text-amber-600 flex items-center gap-1 cursor-pointer pt-2"
          >
            <span>← Continue Shopping</span>
          </button>
        </div>

        {/* Right Side: Order Summary & Coupon Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Order Summary
            </h2>

            {/* Coupon Code input */}
            <div>
              {!activePromo ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. MEGAMART10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold outline-none focus:border-[#172554]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{activePromo} Applied (-₹{promoDiscount.toLocaleString()})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Bill Details */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    `₹${cartDeliveryFee}`
                  )}
                </span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{promoDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-2xl font-black text-[#172554]">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
