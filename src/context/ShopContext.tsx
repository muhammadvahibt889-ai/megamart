import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, UserProfile, ViewType } from '../types';
import { ALL_PRODUCTS, getProductById } from '../data/products';

interface ShopContextType {
  view: ViewType;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  searchQuery: string;
  searchCategory: string;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  recentlyViewed: Product[];
  userProfile: UserProfile;
  activePromo: string | null;
  promoDiscount: number;
  isAccountModalOpen: boolean;
  isPincodeModalOpen: boolean;
  toastMessage: string | null;

  // Navigation
  navigateTo: (
    view: ViewType,
    params?: {
      category?: string | null;
      subcategory?: string | null;
      productId?: string | null;
      searchQuery?: string;
      searchCategory?: string;
    }
  ) => void;

  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Product View
  recordProductView: (productId: string) => void;

  // Coupons
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Checkout & Orders
  placeOrder: (orderData: {
    paymentMethod: string;
    shippingAddress: string;
    deliverySlot: string;
  }) => Order;

  // User Profile
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setIsAccountModalOpen: (open: boolean) => void;
  setIsPincodeModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [view, setView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('All');

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('megamart_v2_cart');
      if (saved) return JSON.parse(saved);
      // Sample initial items for realistic feel
      const p1 = ALL_PRODUCTS.find((p) => p.id === 'elec-phone-ultra') || ALL_PRODUCTS[0];
      const p2 = ALL_PRODUCTS.find((p) => p.id === 'fash-tee-cotton') || ALL_PRODUCTS[1];
      return [
        { product: p1, quantity: 1 },
        { product: p2, quantity: 2 },
      ];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('megamart_v2_wishlist');
      return saved ? JSON.parse(saved) : ['elec-headphones-anc', 'hk-cookware-granite', 'sport-cricket-kashmir'];
    } catch {
      return [];
    }
  });

  // Orders State (Persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('megamart_v2_orders');
      if (saved) return JSON.parse(saved);
      // Sample past order
      const sampleProd = ALL_PRODUCTS.find((p) => p.id === 'elec-speaker-boom') || ALL_PRODUCTS[2];
      return [
        {
          id: 'MM-2026-849201',
          date: 'Yesterday, 4:30 PM',
          items: [{ product: sampleProd, quantity: 1 }],
          subtotal: sampleProd.price,
          discount: 0,
          deliveryFee: 0,
          total: sampleProd.price,
          paymentMethod: 'UPI (Google Pay)',
          shippingAddress: 'Flat 402, Green Glen Heights, Indiranagar, Bengaluru - 560038',
          status: 'Out for Delivery',
          estimatedDelivery: 'Today by 2:00 PM',
        },
      ];
    } catch {
      return [];
    }
  });

  // Recently Viewed State (Persisted)
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('megamart_v2_recent');
      return saved ? JSON.parse(saved) : ['elec-laptop-zen', 'beauty-sun-matte', 'groc-fv-mangoes', 'acc-watch-chrono'];
    } catch {
      return [];
    }
  });

  // User Profile State (Persisted)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('megamart_v2_user');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Vikram Sharma',
            email: 'vikram.sharma@example.com',
            phone: '+91 98765 43210',
            savedAddresses: [
              'Flat 402, Green Glen Heights, Indiranagar, Bengaluru - 560038',
              'Tech Park Campus, Tower B, 3rd Floor, Bellandur, Bengaluru - 560103',
              'House 18, 5th Cross, Koramangala 4th Block, Bengaluru - 560034',
            ],
            selectedAddress: 'Flat 402, Green Glen Heights, Indiranagar, Bengaluru - 560038',
          };
    } catch {
      return {
        name: 'Guest User',
        email: 'guest@megamart.com',
        phone: '+91 98765 43210',
        savedAddresses: ['Bengaluru - 560038'],
        selectedAddress: 'Bengaluru - 560038',
      };
    }
  });

  // Promo Engine
  const [activePromo, setActivePromo] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('megamart_v2_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('megamart_v2_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('megamart_v2_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('megamart_v2_recent', JSON.stringify(recentIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentIds]);

  useEffect(() => {
    try {
      localStorage.setItem('megamart_v2_user', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Selected Product Computed
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return getProductById(selectedProductId) || null;
  }, [selectedProductId]);

  // Recently Viewed Computed
  const recentlyViewed = useMemo(() => {
    return recentIds
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined);
  }, [recentIds]);

  // Toast Function
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Navigation Handler
  const navigateTo = (
    newView: ViewType,
    params?: {
      category?: string | null;
      subcategory?: string | null;
      productId?: string | null;
      searchQuery?: string;
      searchCategory?: string;
    }
  ) => {
    setView(newView);
    if (params) {
      if (params.category !== undefined) setSelectedCategory(params.category);
      if (params.subcategory !== undefined) setSelectedSubcategory(params.subcategory);
      if (params.productId !== undefined) {
        setSelectedProductId(params.productId);
        if (params.productId) recordProductView(params.productId);
      }
      if (params.searchQuery !== undefined) setSearchQuery(params.searchQuery);
      if (params.searchCategory !== undefined) setSearchCategory(params.searchCategory);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record Product View
  const recordProductView = (productId: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Cart Calculations
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartDeliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 499 ? 0 : 49;
  }, [cartSubtotal]);

  const promoDiscount = useMemo(() => {
    if (!activePromo) return 0;
    if (activePromo === 'MEGAMART10') return Math.round(cartSubtotal * 0.1);
    if (activePromo === 'WELCOME50') return Math.min(cartSubtotal, 50);
    if (activePromo === 'FREEDEL') return cartDeliveryFee;
    return 0;
  }, [activePromo, cartSubtotal, cartDeliveryFee]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal + cartDeliveryFee - promoDiscount);
  }, [cartSubtotal, cartDeliveryFee, promoDiscount]);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${product.name} to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'MEGAMART10') {
      if (cartSubtotal < 500) {
        return { success: false, message: 'MEGAMART10 requires minimum order of ₹500' };
      }
      setActivePromo('MEGAMART10');
      return { success: true, message: '10% instant discount applied!' };
    }
    if (formatted === 'WELCOME50') {
      setActivePromo('WELCOME50');
      return { success: true, message: '₹50 welcome discount applied!' };
    }
    if (formatted === 'FREEDEL') {
      setActivePromo('FREEDEL');
      return { success: true, message: 'Free delivery coupon applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try MEGAMART10 or WELCOME50' };
  };

  const removeCoupon = () => {
    setActivePromo(null);
    showToast('Coupon removed');
  };

  // Place Order Action
  const placeOrder = (orderData: {
    paymentMethod: string;
    shippingAddress: string;
    deliverySlot: string;
  }): Order => {
    const newOrderId = 'MM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: newOrderId,
      date: 'Just now',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: promoDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      status: 'Processing',
      estimatedDelivery: orderData.deliverySlot,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActivePromo(null);
    return newOrder;
  };

  // User Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated successfully');
  };

  return (
    <ShopContext.Provider
      value={{
        view,
        selectedCategory,
        selectedSubcategory,
        selectedProductId,
        selectedProduct,
        searchQuery,
        searchCategory,
        cart,
        wishlist,
        orders,
        recentlyViewed,
        userProfile,
        activePromo,
        promoDiscount,
        isAccountModalOpen,
        isPincodeModalOpen,
        toastMessage,
        navigateTo,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        toggleWishlist,
        isWishlisted,
        recordProductView,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateUserProfile,
        setIsAccountModalOpen,
        setIsPincodeModalOpen,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
