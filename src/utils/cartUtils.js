const CART_KEY = "flowershop_cart";

// Helper to notify cart changes to all listeners
const notifyCartChange = () => {
  window.dispatchEvent(new Event("cartChanged"));
};

/**
 * Get all cart items from localStorage
 */
export const getCartItems = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

/**
 * Add or update a product in the cart
 * @param {Object} product - Product object with id, name, price, images, etc.
 * @param {number} quantity - Quantity to add (default 1)
 */
export const addToCart = (product, quantity = 1) => {
  try {
    const cart = getCartItems();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        quantity: quantity,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    notifyCartChange();
    return cart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return [];
  }
};

/**
 * Remove a product from the cart
 * @param {number} productId - Product ID to remove
 */
export const removeFromCart = (productId) => {
  try {
    const cart = getCartItems();
    const filteredCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
    notifyCartChange();
    return filteredCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return [];
  }
};

/**
 * Update product quantity in cart
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 */
export const updateQuantity = (productId, quantity) => {
  try {
    const cart = getCartItems();
    const item = cart.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      item.quantity = quantity;
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      notifyCartChange();
    }

    return cart;
  } catch (error) {
    console.error("Error updating quantity:", error);
    return [];
  }
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
    notifyCartChange();
    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    return [];
  }
};

/**
 * Get cart summary
 * @returns {Object} - Total items, total price, and item count
 */
export const getCartSummary = () => {
  const cart = getCartItems();
  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    totalItems,
    totalQuantity,
    totalPrice,
  };
};

/**
 * Save order from cart (for backend processing)
 * @param {Array} selectedItems - Items to order
 * @returns {Object} - Order data to be sent to backend
 */
export const createOrderFromCart = (selectedItems) => {
  const orderData = {
    createdAt: new Date().toISOString(),
    items: selectedItems.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.price * item.quantity,
    })),
    totalQuantity: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  };

  // Log order JSON for later use
  console.log("Order Data (JSON):", JSON.stringify(orderData, null, 2));

  return orderData;
};
