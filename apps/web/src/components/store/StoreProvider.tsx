"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductAddOn } from "@oudyn/contracts";

const CART_KEY = "oudyn.cart.v1";
const WISHLIST_KEY = "oudyn.wishlist.v1";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  ref: string;
  specLabel: string;
  price: number;
  quantity: number;
  addOnId: string | null;
  addOnLabel: string | null;
  addOnPrice: number;
  image?: string;
};

type StoreValue = {
  hydrated: boolean;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, addOn?: ProductAddOn | null) => void;
  removeLine: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

function readCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).key === "string" &&
        typeof (line as CartLine).price === "number" &&
        typeof (line as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setWishlist(readWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* Storage can be unavailable in private browsing; the cart still works in-memory. */
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* See above. */
    }
  }, [wishlist, hydrated]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const addToCart = useCallback((product: Product, addOn: ProductAddOn | null = null) => {
    const key = `${product.slug}::${addOn?.id ?? "base"}`;
    setCart((current) => {
      const found = current.find((line) => line.key === key);
      if (found) {
        return current.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(9, line.quantity + 1) }
            : line,
        );
      }
      const line: CartLine = {
        key,
        slug: product.slug,
        name: product.name,
        ref: product.ref,
        specLabel: product.specLabel,
        price: product.price + (addOn?.priceDelta ?? 0),
        quantity: 1,
        addOnId: addOn?.id ?? null,
        addOnLabel: addOn?.label ?? null,
        addOnPrice: addOn?.priceDelta ?? 0,
        image: product.images[0],
      };
      return [...current, line];
    });
    setCartOpen(true);
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((current) => current.filter((line) => line.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) =>
            line.key === key ? { ...line, quantity: Math.min(9, quantity) } : line,
          ),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }, []);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  );

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      cartCount,
      subtotal,
      cartOpen,
      openCart,
      closeCart,
      addToCart,
      removeLine,
      setQuantity,
      clearCart,
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted,
    }),
    [
      hydrated,
      cart,
      cartCount,
      subtotal,
      cartOpen,
      openCart,
      closeCart,
      addToCart,
      removeLine,
      setQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
