import React, { createContext, useContext, useState, useEffect } from "react";

// Add this at the top after imports
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      const newLoginState = !!token;

      if (newLoginState !== isLoggedIn) {
        setIsLoggedIn(newLoginState);
        if (newLoginState) {
          // User logged in - fetch their cart
          fetchCartFromDB();
        } else {
          // User logged out - clear cart state and load guest cart
          setCart([]);
          loadCartFromStorage();
        }
      } else if (newLoginState && cart.length === 0) {
        // Already logged in but cart is empty, fetch from DB
        fetchCartFromDB();
      } else if (!newLoginState && cart.length === 0) {
        // Not logged in and cart empty, load guest cart
        loadCartFromStorage();
      }
    };

    // Check auth state on mount
    checkAuthState();

    // Listen for localStorage changes (when user logs in/out in same tab)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuthState();
      }
    };

    // Listen for custom events (for same-tab login/logout)
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, [isLoggedIn]); // Keep this dependency

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("guestCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        setCart([]);
      }
    }
  };

  const saveCartToStorage = (cartData) => {
    localStorage.setItem("guestCart", JSON.stringify(cartData));
  };

  const fetchCartFromDB = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(Array.isArray(data.cart) ? data.cart : []);
      } else {
        console.error("Failed to fetch cart");
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
    }
  };

  const addToCart = async (
    productId,
    quantity,
    size,
    image = "",
    color = "",
    price = 0,
    subCategory = ""
  ) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId,
            quantity,
            size,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCart(Array.isArray(data.cart) ? data.cart : []);
          alert("Item added to cart");
        } else {
          console.error("Failed to add to cart");
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      const existingItem = cart.find(
        (item) => item.productId === productId && item.size === size
      );

      let newCart;
      if (existingItem) {
        newCart = cart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [
          ...cart,
          {
            _id: Date.now(),
            productId,
            quantity,
            size,
            image,
            color,
            price,
            subCategory,
          },
        ];
      }

      setCart(newCart);
      saveCartToStorage(newCart);
      alert("Item added to cart");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (isLoggedIn) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/cart/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity }),
        });

        if (response.ok) {
          const data = await response.json();
          setCart(Array.isArray(data.cart) ? data.cart : []);
        } else {
          console.error("Failed to update cart");
        }
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    } else {
      const newCart = cart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
      setCart(newCart);
      saveCartToStorage(newCart);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/cart/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCart(Array.isArray(data.cart) ? data.cart : []);
        } else {
          console.error("Failed to remove from cart");
        }
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    } else {
      const newCart = cart.filter((item) => item._id !== itemId);
      setCart(newCart);
      saveCartToStorage(newCart);
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/cart`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setCart([]);
        } else {
          console.error("Failed to clear cart");
        }
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setCart([]);
      localStorage.removeItem("guestCart");
    }
  };

  const value = {
    cart: cart || [],
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount: (cart || []).reduce((sum, item) => sum + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
