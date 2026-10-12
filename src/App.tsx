import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AccountModal } from './components/AccountModal';
import { PincodeModal } from './components/PincodeModal';

import { HomeView } from './views/HomeView';
import { CategoryView } from './views/CategoryView';
import { FoodAndGroceriesView } from './views/FoodAndGroceriesView';
import { ProductDetailsView } from './views/ProductDetailsView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrdersView } from './views/OrdersView';
import { WishlistView } from './views/WishlistView';
import { SearchView } from './views/SearchView';
import { Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const { view, toastMessage } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#172554] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Amazon-Style Header */}
      <Header />

      {/* Dynamic View Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 w-full">
        {view === 'home' && <HomeView />}
        {view === 'category' && <CategoryView />}
        {view === 'food-groceries' && <FoodAndGroceriesView />}
        {view === 'product-details' && <ProductDetailsView />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'orders' && <OrdersView />}
        {view === 'wishlist' && <WishlistView />}
        {view === 'search' && <SearchView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <AccountModal />
      <PincodeModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
