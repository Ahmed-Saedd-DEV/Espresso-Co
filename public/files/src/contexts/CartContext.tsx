import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/cart';
import type { CartItem } from '../types/cart';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  pendingItemIds: Set<string>;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'espresso-cart';

function getLocalCart(): CartItem[] {
  const stored = localStorage.getItem(CART_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLocalCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => getLocalCart());
  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(new Set());

  function normalizeCartItem(item: {
    productId: number;
    quantity: number;
    product?: {
      id: number;
      name?: string;
      price?: number | string;
      images?: Array<{ url?: string }>;
      category?: { name?: string } | string;
    };
  }): CartItem {
    return {
      id: String(item.productId),
      name: item.product?.name ?? 'Unknown item',
      category: typeof item.product?.category === 'string' ? (item.product?.category as string) : item.product?.category?.name ?? 'Coffee',
      image: item.product?.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
      price: Number(item.product?.price ?? 0),
      quantity: item.quantity,
    };
  }

  const refreshCart = async () => {
    if (authState !== 'authenticated') {
      const stored = getLocalCart();
      setItems(stored);
      return;
    }

    try {
      const response = await cartApi.getCart();
      const normalized = (response.items ?? []).map(normalizeCartItem);
      setItems(normalized);
      persistLocalCart(normalized);
    } catch {
      const stored = getLocalCart();
      setItems(stored);
    }
  };

  useEffect(() => {
    void refreshCart();
  }, [authState]);

  const persist = (nextItems: CartItem[]) => {
    setItems(nextItems);
    persistLocalCart(nextItems);
  };

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    // guard concurrent operations per-item
    if (pendingItemIds.has(item.id)) return;
    setPendingItemIds((current) => new Set(current).add(item.id));

    try {
      if (authState === 'authenticated') {
        try {
          await cartApi.addToCart({ productId: Number(item.id), quantity: 1 });
          await refreshCart();
          push({ title: 'Added to cart', description: `${item.name} was added to your cart.`, tone: 'success' });
          return;
        } catch (err: any) {
          // check for ApiError-like object with status
          if (err && err.status === 409) {
            push({ title: 'Out of stock', description: 'Not enough stock available for this item.', tone: 'warning' });
            return;
          }
          // fall through to local storage fallback below
        }
      }

      const next = [...items];
      const existing = next.find((entry) => entry.id === item.id);
      if (existing) {
        existing.quantity += 1;
        persist(next);
      } else {
        persist([...next, { ...item, quantity: 1 }]);
      }
      push({ title: 'Added to cart', description: `${item.name} was added to your cart.`, tone: 'success' });
    } finally {
      setPendingItemIds((current) => {
        const nextSet = new Set(current);
        nextSet.delete(item.id);
        return nextSet;
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    // if reducing to zero, delegate to removeItem (it handles its own lock)
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    // guard concurrent operations per-item
    if (pendingItemIds.has(id)) return;
    setPendingItemIds((current) => new Set(current).add(id));

    try {
      if (authState === 'authenticated') {
        try {
          await cartApi.updateCartItem(id, { quantity });
          await refreshCart();
          return;
        } catch (err: any) {
          if (err && err.status === 409) {
            push({ title: 'Out of stock', description: 'Not enough stock available for this item.', tone: 'warning' });
            return;
          }
          // fall through to local storage fallback
        }
      }

      persist(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
    } finally {
      setPendingItemIds((current) => {
        const nextSet = new Set(current);
        nextSet.delete(id);
        return nextSet;
      });
    }
  };

  const removeItem = async (id: string) => {
    // guard concurrent operations per-item
    if (pendingItemIds.has(id)) return;
    setPendingItemIds((current) => new Set(current).add(id));

    try {
      if (authState === 'authenticated') {
        try {
          await cartApi.removeCartItem(id);
          await refreshCart();
          return;
        } catch {
          // fallback to local storage on backend issues
        }
      }

      persist(items.filter((item) => item.id !== id));
    } finally {
      setPendingItemIds((current) => {
        const nextSet = new Set(current);
        nextSet.delete(id);
        return nextSet;
      });
    }
  };

  const clearCart = async () => {
    if (authState === 'authenticated') {
      try {
        const current = [...items];
        await Promise.all(current.map((item) => cartApi.removeCartItem(String(item.id))));
        await refreshCart();
        return;
      } catch {
        // fallback to local storage on backend issues
      }
    }

    persist([]);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, pendingItemIds, addItem, updateQuantity, removeItem, clearCart, refreshCart }),
    [items, itemCount, subtotal, authState, pendingItemIds]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
