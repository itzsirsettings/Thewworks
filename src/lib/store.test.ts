import { describe, it, expect } from 'vitest';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  cartItems: CartItem[];
  isDenseLayout: boolean;
  addToCart: (product: { id: number; name: string; price: number; image: string }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleDenseLayout: () => void;
}

const createStore = (): StoreState => {
  let cartItems: CartItem[] = [];
  let isDenseLayout = false;

  return {
    get cartItems() { return cartItems; },
    get isDenseLayout() { return isDenseLayout; },
    addToCart(product) {
      const existing = cartItems.find((item) => item.id === product.id);
      if (existing) {
        cartItems = cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        cartItems = [...cartItems, { ...product, quantity: 1 }];
      }
    },
    removeFromCart(id) {
      cartItems = cartItems.filter((item) => item.id !== id);
    },
    updateQuantity(id, quantity) {
      if (quantity <= 0) {
        cartItems = cartItems.filter((item) => item.id !== id);
      } else {
        cartItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }
    },
    clearCart() {
      cartItems = [];
    },
    toggleDenseLayout() {
      isDenseLayout = !isDenseLayout;
    },
  };
};

describe('Cart Operations', () => {
  describe('addToCart', () => {
    it('should add a new item to cart', () => {
      const store = createStore();
      const product = { id: 1, name: 'Business Cards', price: 15000, image: '/test.jpg' };

      store.addToCart(product);

      expect(store.cartItems).toHaveLength(1);
      expect(store.cartItems[0]).toMatchObject({
        id: 1,
        name: 'Business Cards',
        price: 15000,
        quantity: 1,
      });
    });

    it('should increment quantity for existing item', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Test', price: 1000, image: '/test.jpg' });
      store.addToCart({ id: 1, name: 'Test', price: 1000, image: '/test.jpg' });

      expect(store.cartItems[0].quantity).toBe(2);
    });

    it('should add multiple different products', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product A', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 2, name: 'Product B', price: 20000, image: '/test.jpg' });

      expect(store.cartItems).toHaveLength(2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item by id', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 2, name: 'Product 2', price: 20000, image: '/test.jpg' });

      store.removeFromCart(1);

      expect(store.cartItems).toHaveLength(1);
      expect(store.cartItems[0].id).toBe(2);
    });

    it('should handle removal of non-existent item', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });

      store.removeFromCart(999);

      expect(store.cartItems).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });

      store.updateQuantity(1, 5);

      expect(store.cartItems[0].quantity).toBe(5);
    });

    it('should remove item when quantity is zero', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });

      store.updateQuantity(1, 0);

      expect(store.cartItems).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });

      store.updateQuantity(1, -1);

      expect(store.cartItems).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 2, name: 'Product 2', price: 20000, image: '/test.jpg' });

      store.clearCart();

      expect(store.cartItems).toHaveLength(0);
    });
  });

  describe('toggleDenseLayout', () => {
    it('should toggle dense layout', () => {
      const store = createStore();
      expect(store.isDenseLayout).toBe(false);

      store.toggleDenseLayout();
      expect(store.isDenseLayout).toBe(true);

      store.toggleDenseLayout();
      expect(store.isDenseLayout).toBe(false);
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate total correctly', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 2, name: 'Product 2', price: 5000, image: '/test.jpg' });

      const total = store.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(25000);
    });

    it('should calculate item count correctly', () => {
      const store = createStore();
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 1, name: 'Product 1', price: 10000, image: '/test.jpg' });
      store.addToCart({ id: 2, name: 'Product 2', price: 5000, image: '/test.jpg' });

      const count = store.cartItems.reduce((sum, item) => sum + item.quantity, 0);

      expect(count).toBe(3);
    });
  });
});