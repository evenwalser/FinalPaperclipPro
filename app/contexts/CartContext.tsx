"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  category: string;
  size?: string;
  quantity: number;
}

type CartItemWithoutQuantity = Omit<CartItem, "quantity">;

const CartContext = createContext<{
  items: CartItem[];
  addItem: (newItem: CartItemWithoutQuantity) => void;
  addItems: (items: CartItemWithoutQuantity[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
} | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  // Load cart from localStorage only on the client-side after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setIsLoading(false); // Done loading after checking localStorage
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = (newItem: CartItemWithoutQuantity) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const addItems = (newItems: CartItemWithoutQuantity[]) => {
    setItems((currentItems) => {
      const updatedItems = [...currentItems];
      newItems.forEach((newItem) => {
        const existingItemIndex = updatedItems.findIndex(
          (item) => item.id === newItem.id
        );
        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex].quantity += 1;
        } else {
          updatedItems.push({ ...newItem, quantity: 1 });
        }
      });
      return updatedItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItems,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}