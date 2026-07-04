import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  favorites: Product[];
  recentlyViewed: Product[];
  isCartOpen: boolean;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;

  addToRecentlyViewed: (product: Product) => void;

  setCartOpen: (open: boolean) => void;

  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      recentlyViewed: [],
      isCartOpen: false,

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (product) => {
        set((state) => {
          const exists = state.favorites.some((item) => item.id === product.id);
          if (exists) {
            return { favorites: state.favorites.filter((item) => item.id !== product.id) };
          }
          return { favorites: [...state.favorites, product] };
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      addToRecentlyViewed: (product) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((item) => item.id !== product.id);
          return { recentlyViewed: [product, ...filtered].slice(0, 6) };
        });
      },

      setCartOpen: (open) => set({ isCartOpen: open }),

      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'merch-shop-storage',
    }
  )
);
