import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = token
        ? `/api/auth/orders/${orderId}`
        : `/api/auth/guest-orders/${orderId}`;

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers,
      });
      // ... rest of the function

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin  h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/"
              className="bg-gray-600 text-white px-6 py-2  hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white -lg shadow-md overflow-hidden mb-8 border">
            {/* Order Header */}
            <div className="bg-gray-100 px-6 py-4 border-b ">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{orderDetails.orderId}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Placed on{" "}
                    {new Date(orderDetails.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 -full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {orderDetails.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 -lg"
                  >
                    <img
                      src={item.image || "/fallback.png"}
                      alt={item.itemName}
                      className="w-16 h-16 object-cover "
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {item.itemName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString()} MMK
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{orderDetails.subtotal.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping to {orderDetails.shippingAddress.city}:</span>
                  <span>{orderDetails.shippingCost.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>{orderDetails.total.toLocaleString()} MMK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white -lg shadow-md p-6 mb-8 border">
            <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Shipping Address
                </h4>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>{orderDetails.shippingAddress.email}</p>
                  <p>{orderDetails.shippingAddress.phone}</p>
                  <p>{orderDetails.shippingAddress.fullAddress}</p>
                  <p>
                    {orderDetails.shippingAddress.township},{" "}
                    {orderDetails.shippingAddress.city}
                  </p>
                  <p>{orderDetails.shippingAddress.region}</p>
                  {orderDetails.shippingAddress.deliveryNotes && (
                    <p className="mt-2 italic">
                      Note: {orderDetails.shippingAddress.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Payment Method
                </h4>
                <p className="text-gray-600 text-sm capitalize">
                  {orderDetails.payment.method === "cod"
                    ? "Cash on Delivery"
                    : orderDetails.payment.method}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status:{" "}
                  <span className="capitalize">
                    {orderDetails.payment.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-gray-600 text-white px-6 py-2  hover:bg-gray-700 transition hover:cursor-pointer"
            >
              Print Order
            </button>
            {localStorage.getItem("token") && (
              <Link
                to="/profile/order"
                className="block w-full sm:w-auto bg-gray-600 text-white px-6 py-2  hover:bg-gray-800 transition text-center"
              >
                View All Orders
              </Link>
            )}

            <Link
              to="/"
              className="block w-full sm:w-auto bg-gray-600 text-white px-6 py-2  hover:bg-gray-700 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 border-l-4 border-gray-400 p-6 ">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              What happens next?
            </h3>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• You'll receive an email confirmation shortly</p>
              <p>• We'll process your order within 1-2 business days</p>
              <p>• You'll get tracking information once your order ships</p>
              <p>
                • Expected delivery: 3-7 business days depending on your
                location
              </p>
              {orderDetails.payment.method === "cod" && (
                <p className="font-medium">
                  • Please have exact cash ready for delivery
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderSuccess;
