import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

const readStoredCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Snapshots title/price/thumbnail at add-time purely for display —
  // checkout always re-reads the authoritative price from the DB server-side.
  const addToCart = useCallback((course) => {
    setItems((prev) => {
      if (prev.some((item) => item.courseId === course._id)) return prev;
      return [
        ...prev,
        {
          courseId: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          price: course.price,
          currency: course.currency,
          slug: course.slug,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((courseId) => {
    setItems((prev) => prev.filter((item) => item.courseId !== courseId));
  }, []);

  const removeItems = useCallback((courseIds) => {
    const toRemove = new Set(courseIds);
    setItems((prev) => prev.filter((item) => !toRemove.has(item.courseId)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback((courseId) => items.some((item) => item.courseId === courseId), [items]);

  const value = {
    items,
    count: items.length,
    subtotal: items.reduce((sum, item) => sum + (item.price || 0), 0),
    addToCart,
    removeFromCart,
    removeItems,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
