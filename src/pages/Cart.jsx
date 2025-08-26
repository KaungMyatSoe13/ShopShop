import React from "react";

import Footer from "../components/Footer";
import { HiPlusSmall } from "react-icons/hi2";
import { HiMinusSmall } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const cartItems = cart;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center px-4 sm:pt-10 w-full">
        {/* Grid: Cart Items + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[98%]">
          {/* Cart Section (2 columns) */}
          <div className="md:col-span-2">
            {/* Header */}
            <div className="hidden md:grid grid-cols-4 gap px-4 py-2 font-semibold text-gray-700 border-b">
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center px-4 py-4 border-b"
              >
                {/* Product Info (Image + Name) */}
                <div className="flex items-center gap-4 sm:col-span-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-30 sm:w-40 sm:h-40 object-cover object-top  shrink-0"
                  />

                  <div className="sm:hidden space-y-2">
                    {/* Show name below image on mobile */}
                    <h4 className="text-md font-medium">{item.name}</h4>
                    <p className="text-gray-500">{item.price} MMK</p>

                    {/* Quantity */}
                    <div className="flex flex-row items-center gap-2">
                      <HiMinusSmall
                        className="hover:cursor-pointer"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      />
                      <div className="text-center rounded px-2 min-w-[40px]">
                        {item.quantity}
                      </div>
                      <HiPlusSmall
                        className="hover:cursor-pointer"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      />
                    </div>

                    <p className="text-gray-700 font-medium">
                      Subtotal: {item.price * item.quantity} MMK
                    </p>
                  </div>
                </div>

                {/* Price (hidden on mobile, visible on sm+) */}
                <div className="text-center hidden sm:block">
                  {item.price} MMK
                </div>

                {/* Quantity */}
                <div className="hidden sm:flex flex-row items-center justify-center gap-2">
                  <HiMinusSmall className="hover:cursor-pointer" />
                  <div className="text-center border border-gray-300 rounded px-2 min-w-[40px]">
                    {item.quantity}
                  </div>
                  <HiPlusSmall className="hover:cursor-pointer" />
                </div>

                {/* Subtotal (hidden on mobile, visible on sm+) */}
                <div className="text-right font-medium hidden sm:block">
                  {item.price * item.quantity} MMK
                </div>
              </div>
            ))}
          </div>
          <div className="sm:hidden flex w-[40%] sm:mx-12 mx-3 my-5">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-grow border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="border text-black px-5 py-2  hover:bg-gray-300 transition hover:cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Summary (right column) */}
          <div className="bg-gray-100 p-6 rounded shadow-sm h-fit border">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="mb-4" />
            <div className="flex justify-between font-semibold text-md mb-4">
              <span>Total</span>
              <span>{subtotal.toLocaleString()} MMK</span>
            </div>
            <NavLink to="/checkout">
              {" "}
              <button className="w-full bg-black text-white py-2  hover:bg-gray-800 transition hover:cursor-pointer ">
                Proceed to Checkout
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex w-[40%] sm:mx-12 mx-5 my-5">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-grow border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          className="border text-black px-5 py-2  hover:bg-gray-300 transition hover:cursor-pointer"
        >
          Apply
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
