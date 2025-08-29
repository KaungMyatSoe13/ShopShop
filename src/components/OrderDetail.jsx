import React from "react";
import { useCart } from "../context/CartContext";

function OrderDetail({ onPlaceOrder, isSubmitting, selectedCity }) {
  const { cart } = useCart();
  const cartItems = cart;

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Dynamic shipping calculation based on selected city
  const calculateShipping = (city) => {
    const shippingRates = {
      yangon: 3000,
      mandalay: 5000,
      naypyitaw: 6000,
    };
    return shippingRates[city?.toLowerCase()] || 7000; // default for others
  };

  const shipping = calculateShipping(selectedCity);
  const total = subtotal + shipping;

  return (
    <div className="sm:w-[50%] w-full p-6 shadow-md space-y-6 border bg-gray-100 rounded">
      <h2 className="text-2xl font-semibold">Your Order</h2>

      {/* Product List */}
      <div className="space-y-4 border-t border-b py-4">
        {cartItems.map((item, index) => (
          <div
            key={item._id}
            className="flex justify-between text-sm items-center"
          >
            <div className="flex flex-row w-[70%] items-center space-x-4">
              <img
                key={index}
                src={item.image || "/fallback.png"} // fallback if no image
                alt={item.itemName || "Product"}
                className="w-[15%] h-full object-cover"
              />
              <div className="flex flex-col">
                <p className="font-medium">
                  {item.itemName} - {item.size} - {item.color}
                </p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium">
              {(item.price * item.quantity).toLocaleString()} MMK
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-black font-semibold">Subtotal</span>
          <span className="font-medium">{subtotal.toLocaleString()} MMK</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black font-semibold">
            Shipping to {selectedCity ? `(${selectedCity})` : "(City)"}
          </span>
          <span className="font-medium">{shipping.toLocaleString()} MMK</span>
        </div>

        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{total.toLocaleString()} MMK</span>
        </div>
      </div>

      {/* Notice */}
      <div className="text-xs text-gray-600 mt-4 space-y-2">
        <p>
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our{" "}
          <a
            href="/privacy-policy"
            className="underline text-blue-600 hover:text-blue-800"
          >
            privacy policy
          </a>
          .
        </p>
        <p className="text-red-500 font-medium">
          Please carefully double-check your order.*
        </p>
        <p className="text-gray-700 font-medium">
          Once you place this order, your order can't be exchanged or canceled.
          All sales are final.
        </p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isSubmitting || cartItems.length === 0}
        className={`w-full py-3 transition rounded font-medium ${
          isSubmitting || cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-black text-white hover:bg-gray-800 hover:cursor-pointer"
        }`}
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}

export default OrderDetail;
