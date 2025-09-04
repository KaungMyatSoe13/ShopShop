import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}api/admin/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      console.error("Fetch order error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder.order);
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update order status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-black"></div>
          <p className="ml-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center text-red-500">
            <p className="text-lg mb-4">Error loading order</p>
            <p className="mb-6">{error || "Order not found"}</p>
            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 "
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-gray-600 hover:text-black mb-4 flex items-center hover:cursor-pointer "
          >
            ← Back to All Orders
          </button>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600 font-mono text-sm">{order.orderId}</p>
            </div>

            {/* Status Update */}
            <div className="flex flex-col sm:items-end gap-2">
              <div
                className={`px-3 py-2  border ${getStatusColor(
                  order.status || "pending"
                )}`}
              >
                {(order.status || "pending").charAt(0).toUpperCase() +
                  (order.status || "pending").slice(1)}
              </div>

              <select
                value={order.status || "pending"}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={updating}
                className="px-3 py-2 border border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {updating && <p className="text-sm text-gray-500">Updating...</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            {/* Basic Order Info */}
            <div className="bg-white border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Order Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Type:</span>
                  <span className="font-medium">
                    {order.isGuestOrder ? "Guest Order" : "Registered User"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {order.payment?.method || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`font-medium ${
                      order.payment?.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.payment?.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Customer Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {order.shippingAddress?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {order.shippingAddress?.email || order.guestEmail || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {order.shippingAddress?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.fullAddress}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.township},{" "}
                  {order.shippingAddress?.city}
                </p>
                <p className="text-gray-600">{order.shippingAddress?.region}</p>
                {order.shippingAddress?.deliveryNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-600 font-medium">Delivery Notes:</p>
                    <p className="text-gray-700">
                      {order.shippingAddress.deliveryNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items and Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border ">
                    <div className="w-16 h-16 bg-gray-100  overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.itemName || item.name || "Unknown Item"}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                        <p>Quantity: {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          {item.price?.toLocaleString()} MMK each
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {(item.price * item.quantity)?.toLocaleString()} MMK
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {order.subtotal?.toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {order.shippingCost?.toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {order.total?.toLocaleString()} MMK
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-gray-50 border -lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Admin Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-600 text-white py-2 px-4  hover:bg-gray-700 transition hover:cursor-pointer"
                >
                  Print Order
                </button>
                <button
                  onClick={() => {
                    const email =
                      order.shippingAddress?.email || order.guestEmail;
                    if (email) {
                      window.location.href = `mailto:${email}?subject=Order ${order.orderId}`;
                    }
                  }}
                  className="w-full bg-black text-white py-2 px-4  hover:bg-gray-700 transition hover:cursor-pointer"
                  disabled={!order.shippingAddress?.email && !order.guestEmail}
                >
                  Email Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
