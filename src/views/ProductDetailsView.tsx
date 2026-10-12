import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MapPin,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getRelatedProducts } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProduct,
    navigateTo,
    addToCart,
    toggleWishlist,
    isWishlisted,
    userProfile,
    setIsPincodeModalOpen,
    showToast,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 bg-[#172554] text-white rounded-xl text-sm font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(selectedProduct.id);
  const discountPercent = selectedProduct.originalPrice > selectedProduct.price
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const galleryImages = selectedProduct.gallery && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [selectedProduct.image];

  const relatedProducts = getRelatedProducts(selectedProduct, 5);

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    navigateTo('cart');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard!');
  };

  return (
    <div className="py-4 sm:py-6 space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
        <button onClick={() => navigateTo('home')} className="hover:text-[#172554] cursor-pointer shrink-0">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => {
            if (selectedProduct.category === 'Food & Groceries') {
              navigateTo('food-groceries');
            } else {
              navigateTo('category', { category: selectedProduct.category });
            }
          }}
          className="hover:text-[#172554] cursor-pointer shrink-0"
        >
          {selectedProduct.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-medium text-slate-700 shrink-0">{selectedProduct.subcategory}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-900 truncate max-w-[200px]">{selectedProduct.name}</span>
      </div>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-2xl bg-[#F3F4F6] p-6 flex items-center justify-center overflow-hidden border border-slate-200/80">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-14 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-xs cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-xs cursor-pointer transition-colors ${
                wishlisted
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            <img
              src={galleryImages[selectedImageIndex] || selectedProduct.image}
              alt={selectedProduct.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
            />
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl bg-slate-100 p-1 border-2 overflow-hidden transition-all ${
                    selectedImageIndex === idx ? 'border-[#172554] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Truck className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <span className="font-bold block text-[11px]">Free Shipping</span>
              <span className="text-[10px] text-slate-400">&gt; ₹499</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold block text-[11px]">100% Genuine</span>
              <span className="text-[10px] text-slate-400">Direct Brand</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <RotateCcw className="w-4 h-4 text-rose-600 mx-auto mb-1" />
              <span className="font-bold block text-[11px]">7-Day Return</span>
              <span className="text-[10px] text-slate-400">Instant Refund</span>
            </div>
          </div>
        </div>

        {/* Center Column: Details & Specs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Brand: {selectedProduct.brand}</span>
              <span>·</span>
              <span>{selectedProduct.subcategory}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {selectedProduct.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-slate-100">
              <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold text-amber-900 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {selectedProduct.reviewsCount.toLocaleString()} verified customer ratings
              </span>
            </div>

            {/* Price Box */}
            <div className="py-4 border-b border-slate-100">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-[#172554]">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()} ({discountPercent}%)
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inclusive of all taxes. EMI starts at ₹{Math.round(selectedProduct.price / 6)}/month.
              </div>
            </div>

            {/* Description */}
            <div className="py-4 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                About this item
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Specifications Table */}
            {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
              <div className="py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
                  Specifications
                </h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                    <div key={key} className="py-2 flex justify-between gap-4">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-bold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout & Cart Action Card (3 cols) */}
        <div className="lg:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              ₹{(selectedProduct.price * quantity).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Delivery Location Check */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Deliver to {userProfile.name.split(' ')[0]}</span>
            </div>
            <div className="font-bold text-slate-800 truncate mb-1">
              {userProfile.selectedAddress.split(',')[0]}
            </div>
            <button
              onClick={() => setIsPincodeModalOpen(true)}
              className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer"
            >
              Change delivery address
            </button>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{selectedProduct.deliveryInfo}</span>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quantity
            </label>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-black text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => addToCart(selectedProduct, quantity)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 rounded-xl bg-[#172554] hover:bg-[#1E3A8A] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">
          Customer Ratings & Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-4xl font-black text-slate-900">{selectedProduct.rating}</span>
            <div className="flex text-amber-500 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {selectedProduct.reviewsCount.toLocaleString()} verified ratings
            </span>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-500 font-bold">5 star</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-amber-500 rounded-full" />
              </div>
              <span className="w-10 text-slate-400 text-right">78%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-500 font-bold">4 star</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[16%] h-full bg-amber-500 rounded-full" />
              </div>
              <span className="w-10 text-slate-400 text-right">16%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-500 font-bold">3 star</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[4%] h-full bg-amber-500 rounded-full" />
              </div>
              <span className="w-10 text-slate-400 text-right">4%</span>
            </div>
          </div>
        </div>

        {/* Individual review samples */}
        <div className="pt-6 space-y-4 divide-y divide-slate-100 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">Arun Mehta</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Verified Purchase
              </span>
            </div>
            <div className="flex text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500" />
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              Outstanding quality! Exactly as described on the website. Fast delivery by MegaMart and packaging was sturdy.
            </p>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">Pooja K.</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Verified Purchase
              </span>
            </div>
            <div className="flex text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500" />
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              Value for money purchase. Highly recommend this brand to everyone looking for reliable quality.
            </p>
          </div>
        </div>
      </section>

      {/* Similar & Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Similar & Related Products
            </h2>
            <p className="text-xs text-slate-500">
              Customers who viewed this item also explored
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
