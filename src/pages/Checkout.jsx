import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BillingDetailForm from "../components/BillingDetailForm";
import OrderDetail from "../components/OrderDetail";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Form state
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value); // Add this line

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

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.township) newErrors.township = "Township is required";
    if (!formData.fullAddress)
      newErrors.fullAddress = "Full address is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to place an order");
      navigate("/profile/loginPage");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        cartItems: cart,
        billingDetails: formData,
        paymentMethod: formData.paymentMethod,
      };

      const response = await fetch(`${BACKEND_URL}/api/auth/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();

        // Clear cart after successful order
        clearCart();

        // Redirect to success page or order confirmation
        // Route based on payment method
        if (formData.paymentMethod === "cod") {
          alert("Order placed successfully! Pay at your house when delivered.");
          navigate("/profile/orders"); // or wherever you want
        } else if (formData.paymentMethod === "kbzpay") {
          navigate(`/qr/${result.orderId}`);
        }
      } else {
        const error = await response.json();
        alert("Error creating order: " + error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-col items-center mb-10 mt-10">
        <div className="w-[95%] flex flex-col sm:flex-row gap-5">
          <BillingDetailForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
          <OrderDetail
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
            selectedCity={formData.city}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
