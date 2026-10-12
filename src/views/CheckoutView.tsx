import React, { useState } from 'react';
import {
  Truck,
  Clock,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    promoDiscount,
    cartTotal,
    userProfile,
    placeOrder,
    navigateTo,
  } = useShop();

  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.selectedAddress);
  const [deliverySlot, setDeliverySlot] = useState('Today (Within 2 Hours)');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (cart.length === 0 && step === 'checkout') {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 bg-[#172554] text-white rounded-xl text-sm font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in your name, contact phone number, and delivery address.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    let paymentLabel = 'Cash on Delivery';
    if (paymentMethod === 'upi') {
      paymentLabel = `UPI (${upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm'})`;
    } else if (paymentMethod === 'card') {
      paymentLabel = 'Credit/Debit Card (Online)';
    }

    setTimeout(() => {
      const order = placeOrder({
        paymentMethod: paymentLabel,
        shippingAddress: address,
        deliverySlot,
      });
      setCreatedOrder(order);
      setIsSubmitting(false);
      setStep('confirmed');
    }, 1000);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {step === 'checkout' ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Checkout & Delivery
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Please review your shipping destination, choose payment option, and confirm order
            </p>
          </div>

          {/* Demo Notice Banner adhering strictly to section 10 */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Demonstration Environment Notice:</strong> This is a sample
              e-commerce storefront simulation. No real money or payment credentials will be deducted. All
              orders placed are saved locally in your demo account history for complete testing.
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Customer Contact & Address */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#172554] text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Contact & Delivery Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#172554] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#172554] outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Street Address, Flat, Landmark, Pincode</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#172554] outline-none"
                  />
                </div>
              </div>

              {/* 2. Delivery Speed & Slot */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#172554] text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Delivery Speed & Slot</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('Today (Express 15-min to 2-hour)')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      deliverySlot.includes('Express')
                        ? 'border-[#172554] bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">⚡ Express Delivery</span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">FAST</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Priority dispatch from nearest local hub</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySlot('Tomorrow Morning (8:00 AM - 12:00 PM)')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      deliverySlot.includes('Tomorrow')
                        ? 'border-[#172554] bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">Standard Scheduled</span>
                      <span className="text-emerald-600 font-bold text-[11px]">Free</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Delivered tomorrow morning at your door</p>
                  </button>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#172554] text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Payment Method (Simulated Demo)</span>
                </h2>

                <div className="space-y-2.5 text-xs">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#172554] bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-bold text-slate-900">UPI Instant Payment (QR / App)</div>
                          <div className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                        </div>
                      </div>
                      <span className="text-emerald-700 font-black text-[11px]">Instant 0% Fee</span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/60 flex gap-2">
                        {(['gpay', 'phonepe', 'paytm'] as const).map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpiApp(app);
                            }}
                            className={`px-3 py-1 rounded-lg font-bold text-xs uppercase ${
                              upiApp === app
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#172554] bg-blue-50/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#172554]" />
                      <div>
                        <div className="font-bold text-slate-900">Credit / Debit Card / Net Banking</div>
                        <div className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Amex</div>
                      </div>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#172554] bg-amber-50/40 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="font-bold text-slate-900">Cash on Delivery (COD)</div>
                        <div className="text-[11px] text-slate-500">Pay cash or UPI QR upon package arrival</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {formError}
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Place Order (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-28">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Review Items ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h3>

                {/* Items quick list */}
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-8 h-8 rounded-lg object-contain bg-slate-100 shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-slate-900">{item.product.name}</span>
                          <span className="text-slate-400 block text-[11px]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{cartDeliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${cartDeliveryFee}`}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Total to Pay</span>
                    <span className="text-[#172554] text-xl">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>Place Order · ₹{cartTotal.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-400 text-center">
                  By placing this order you agree to MegaMart terms of service and simulated demo conditions.
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Order Confirmed Success Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
            Order Confirmed & Placed!
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank you for shopping at MegaMart
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Order Reference: <strong className="text-slate-900 font-bold">{createdOrder?.id}</strong>
          </p>

          {/* Details Card */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-3">
            <div className="flex justify-between pb-2 border-b border-slate-200 font-bold">
              <span>Delivery Address</span>
              <span className="text-slate-500">{createdOrder?.shippingAddress.split(',')[0]}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-700">{createdOrder?.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Payment Option</span>
              <span className="font-bold text-slate-800">{createdOrder?.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1">
              <span>Total Paid</span>
              <span className="text-[#172554]">₹{createdOrder?.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigateTo('orders')}
              className="px-6 py-3.5 bg-[#172554] hover:bg-[#1E3A8A] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              View in My Orders →
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
