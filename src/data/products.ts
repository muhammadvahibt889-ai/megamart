import { Product } from '../types';
import { ELECTRONICS_PRODUCTS } from './products/electronics';
import { FASHION_PRODUCTS } from './products/fashion';
import { HOME_KITCHEN_PRODUCTS } from './products/homeKitchen';
import { BOOKS_PRODUCTS } from './products/books';
import { SPORTS_FITNESS_PRODUCTS } from './products/sportsFitness';
import { BEAUTY_CARE_PRODUCTS } from './products/beautyCare';
import { ACCESSORIES_PRODUCTS } from './products/accessories';
import { TOYS_GAMES_PRODUCTS } from './products/toysGames';
import { GROCERIES_PRODUCTS } from './products/groceries';

// Central comprehensive verified product database
export const ALL_PRODUCTS: Product[] = [
  ...ELECTRONICS_PRODUCTS,
  ...FASHION_PRODUCTS,
  ...HOME_KITCHEN_PRODUCTS,
  ...BOOKS_PRODUCTS,
  ...SPORTS_FITNESS_PRODUCTS,
  ...BEAUTY_CARE_PRODUCTS,
  ...ACCESSORIES_PRODUCTS,
  ...TOYS_GAMES_PRODUCTS,
  ...GROCERIES_PRODUCTS,
];

// Quick helper to fetch product by ID
export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find((p) => p.id === id);
};

// Quick helper to fetch related products
export const getRelatedProducts = (product: Product, limit = 5): Product[] => {
  return ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.subcategory === product.subcategory || p.category === product.category)
  ).slice(0, limit);
};
