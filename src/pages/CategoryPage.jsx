import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import BillingDetailForm from "../components/BillingDetailForm";
import OrderDetail from "../components/OrderDetail";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    region: "",
    city: "",
    township: "",
    fullAddress: "",
    orderNotes: "",
    paymentMethod: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.region) {
      newErrors.region = "Region is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.township) {
      newErrors.township = "Township is required";
    }

    if (!formData.fullAddress) {
      newErrors.fullAddress = "Full address is required";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to place an order");
        navigate("/login");
        return;
      }

      // Prepare order data
      const orderData = {
        cartItems: cart,
        billingDetails: {
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          city: formData.city,
          township: formData.township,
          fullAddress: formData.fullAddress,
          orderNotes: formData.orderNotes,
        },
        paymentMethod: formData.paymentMethod,
      };

      // Make API call to create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      // Save address to user profile (optional - you can implement this later)
      await saveUserAddress();

      // Clear cart after successful order
      clearCart();

      // Route based on payment method
      if (formData.paymentMethod === "cod") {
        // Show success message for COD
        alert(
          "Order placed successfully! You can pay when the order is delivered to your address."
        );
        navigate("/orders"); // or wherever you want to redirect
      } else if (formData.paymentMethod === "kbzpay") {
        // Navigate to QR page for KBZ Pay
        navigate(`/qr/${result.orderId}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save address to user profile (optional)
  const saveUserAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const addressData = {
        region: formData.region,
        city: formData.city,
        township: formData.township,
        fullAddress: formData.fullAddress,
        phone: formData.phone,
      };

      await fetch("/api/users/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
    } catch (error) {
      console.log("Failed to save address:", error.message);
      // Don't block the order process if address saving fails
    }
  };

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-[94%] mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Checkout</h1>
          <div className="text-center text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Cart</span>
            <span className="mx-2">›</span>
            <span>Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Billing Form */}
          <BillingDetailForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />

          {/* Order Summary */}
          <OrderDetail
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
            selectedCity={formData.city}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
