export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  gallery?: string[];
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  specifications: Record<string, string>;
  deliveryInfo: string;
  isBestseller?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  badge?: string;
  unit?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  savedAddresses: string[];
  selectedAddress: string;
}

export type ViewType =
  | 'home'
  | 'category'
  | 'food-groceries'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'wishlist'
  | 'search';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface FilterState {
  category?: string;
  subcategory?: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  brand?: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  subcategories: string[];
}
