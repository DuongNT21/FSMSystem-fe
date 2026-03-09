import { useState, useEffect, useCallback } from "react";
import { getCartSummary } from "../utils/cartUtils";

const CART_CHANGE_EVENT = "cartChanged";

// Dispatch custom event when cart changes
export const notifyCartChange = () => {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
};

/**
 * Custom hook to track cart changes across components
 * Usage: const { totalQuantity, totalItems } = useCartCount();
 */
export const useCartCount = () => {
  const [cartData, setCartData] = useState(() => getCartSummary());

  useEffect(() => {
    const handleCartChange = () => {
      setCartData(getCartSummary());
    };

    // Listen for custom cart change events
    window.addEventListener(CART_CHANGE_EVENT, handleCartChange);
    // Also listen for storage events (for cross-tab updates)
    window.addEventListener("storage", handleCartChange);

    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
      window.removeEventListener("storage", handleCartChange);
    };
  }, []);

  return cartData;
};
