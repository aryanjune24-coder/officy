"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Product } from "../types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Restore cart from localStorage
  useEffect(() => {
    const savedCart =
      localStorage.getItem("officy-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(
      "officy-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        const updatedQty =
          existing.quantity + quantity;

        if (updatedQty <= 0) {
          return prev.filter(
            (item) =>
              item.product.id !== product.id
          );
        }

        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: updatedQty,
              }
            : item
        );
      }

      if (quantity <= 0) return prev;

      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.product.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}