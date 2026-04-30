import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './checkout';
import type { StoreProduct } from './marketplace-data';

interface StoreState {
  cartItems: CartItem[];
  isDenseLayout: boolean;
  addToCart: (product: StoreProduct) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleDenseLayout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cartItems: [],
      isDenseLayout: false,

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cartItems: [
              ...state.cartItems,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== id),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ cartItems: [] }),

      toggleDenseLayout: () => set((state) => ({ isDenseLayout: !state.isDenseLayout })),
    }),
    {
      name: 'thewworksict-preferences', 
    }
  )
);
