import React from 'react';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ArrowRight, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrdersView: React.FC = () => {
  const { orders, navigateTo, addToCart } = useShop();

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#172554] mx-auto flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Orders Placed Yet</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Your orders will appear here once you checkout items from your shopping cart.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
        >
          Explore Today's Deals →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Orders ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track packages, review item summaries, and repurchase recent favorites
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Order Top Summary Bar */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Order Placed</span>
                  <span className="font-bold text-slate-800">{order.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Total</span>
                  <span className="font-bold text-slate-900">₹{order.total.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Ship To</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px] block">
                    {order.shippingAddress.split(',')[0]}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] text-right">Order Reference</span>
                <span className="font-black text-[#172554]">{order.id}</span>
              </div>
            </div>

            {/* Order Status & Progress */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-black text-slate-900">
                    Status: {order.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Estimated Delivery: <strong className="text-emerald-700">{order.estimatedDelivery}</strong>
                </div>
              </div>

              {/* Items in order */}
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => navigateTo('product-details', { productId: item.product.id })}
                        className="w-16 h-16 rounded-xl bg-slate-100 p-2 shrink-0 border border-slate-200 flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <h4
                          onClick={() => navigateTo('product-details', { productId: item.product.id })}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#172554] cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.product.brand} · Qty: {item.quantity} · ₹{item.product.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item.product, 1);
                        navigateTo('cart');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                    >
                      Buy Again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
