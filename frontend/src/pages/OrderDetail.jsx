import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const url = new URL(`/api/auth/orders/${orderId}`, BACKEND_URL);
        let options = { headers: {} };

        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        } else {
          // For guest orders, use guest endpoint
          url = new URL(`/api/auth/guest-orders/${orderId}`, BACKEND_URL);
        }

        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`Order not found: ${res.status}`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin -full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-2  hover:bg-gray-800 transition"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-sm">
      <Navbar />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto bg-white p-6 mt-6 shadow-md ">
          <h2 className="text-lg font-bold mb-4">
            Order {order.orderId} was placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            and is currently{" "}
            <span
              className={`${
                order.status === "pending"
                  ? "text-yellow-600"
                  : order.status === "completed"
                  ? "text-green-600"
                  : order.status === "cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {order.status || "Processing"}
            </span>
            .
          </h2>

          <h3 className="text-md font-semibold border-b pb-2 mb-4">
            Order Details
          </h3>
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="mb-4 border-b pb-4 flex items-center space-x-4"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-30 h-30 object-cover "
                />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {item.itemName} × {item.quantity}
                </p>
                <p className="text-gray-500">Size: {item.size}</p>
                {item.color && (
                  <p className="text-gray-500">Color: {item.color}</p>
                )}
                <p className="font-semibold mt-1">
                  {(item.price * item.quantity).toLocaleString()} MMK
                </p>
              </div>
            </div>
          ))}

          <div className=" space-y-2 text-left">
            <p>
              Subtotal:{" "}
              <span className="font-medium">
                {order.subtotal?.toLocaleString()} MMK
              </span>
            </p>
            <p>
              Shipping:{" "}
              <span className="font-medium">
                {order.shippingCost?.toLocaleString()} MMK
              </span>
            </p>
            <p className="text-lg font-bold mt-2 border-t pt-2">
              Total: {order.total?.toLocaleString()} MMK
            </p>
          </div>

          <h3 className="text-md font-semibold border-b pb-2 mt-8 mb-4">
            Shipping & Billing Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">
                Delivery Information
              </h4>
              <div className="space-y-1">
                <p>
                  {" "}
                  <strong>Name:</strong> {order.shippingAddress?.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.shippingAddress?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.shippingAddress?.phone}
                </p>
                <p>
                  <strong>Region:</strong> {order.shippingAddress?.region}
                </p>
                <p>
                  <strong>City:</strong> {order.shippingAddress?.city}
                </p>
                <p>
                  <strong>Township:</strong> {order.shippingAddress?.township}
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress?.fullAddress}
                </p>
                {order.shippingAddress?.deliveryNotes && (
                  <p>
                    <strong>Notes:</strong>{" "}
                    {order.shippingAddress.deliveryNotes}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">
                Payment Information
              </h4>
              <div className="space-y-1">
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.payment?.method === "cod"
                    ? "Cash on Delivery"
                    : order.payment?.method === "kbzpay"
                    ? "KBZ Pay"
                    : order.payment?.method || "N/A"}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`capitalize ${
                      order.payment?.status === "pending"
                        ? "text-yellow-600"
                        : order.payment?.status === "completed"
                        ? "text-green-600"
                        : order.payment?.status === "failed"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {order.payment?.status || "Pending"}
                  </span>
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Order ID: {order.orderId}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline/Status */}
          <div className="mt-8 p-4 bg-gray-50 ">
            <h4 className="font-semibold mb-2">Order Status</h4>
            <div className="text-sm text-gray-600">
              <p>
                Current Status:{" "}
                <span className="capitalize font-medium">
                  {order.status || "Processing"}
                </span>
              </p>
              {/* <p className="text-xs mt-1">
                Last Updated: {new Date(order.updatedAt).toLocaleString()}
              </p> */}
              {order.payment?.method === "cod" &&
                order.payment?.status === "pending" && (
                  <p className="text-orange-600 font-medium mt-2">
                    *Please have exact cash ready for delivery.
                  </p>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-gray-600 text-white px-6 py-2  hover:bg-gray-700 transition hover:cursor-pointer"
            >
              Print Order
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-2  hover:bg-gray-800 transition hover:cursor-pointer"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetail;
