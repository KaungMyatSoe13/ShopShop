import React from "react";
import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import { HiPlusSmall } from "react-icons/hi2";
import { HiMinusSmall } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

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

      <div className="flex-grow flex flex-col items-center px-4 sm:pt-10 w-full">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <NavLink to="/shop/page/1">
              <span className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition">
                Continue Shopping
              </span>
            </NavLink>
          </div>
        ) : (
          <>
            {/* Grid: Cart Items + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[98%]">
              {/* Cart Section (2 columns) */}
              <div className="md:col-span-2">
                {/* Header */}
                <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 font-semibold text-gray-700 border-b">
                  <div>Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Subtotal</div>
                  <div className="text-center">Actions</div>
                </div>

                {/* Items */}
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center px-4 py-4 border-b"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center w-full">
                        <Link
                          to={`/product/${
                            item.productId?._id || item.productId
                          }`}
                        >
                          <img
                            src={item.variants?.[0]?.images?.[0] || item.image}
                            alt={item.itemName}
                            className="w-full max-w-[200px] h-auto object-cover object-top cursor-pointer"
                          />
                        </Link>
                        <p className="mt-2 text-sm text-gray-700 text-center">
                          {item.itemName} ({item.size})
                        </p>
                      </div>
                    </div>

                    {/* Price - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:flex justify-center">
                      <span className="text-sm">
                        {item.price.toLocaleString()} MMK
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100  transition"
                        disabled={item.quantity <= 1}
                      >
                        <HiMinusSmall className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 border  min-w-[50px] text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100  transition"
                      >
                        <HiPlusSmall className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:flex justify-center">
                      <span className="text-sm font-medium">
                        {(item.price * item.quantity).toLocaleString()} MMK
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50  transition hover:cursor-pointer"
                        title="Remove from cart"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile-only info */}
                    <div className="md:hidden mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {item.price.toLocaleString()} MMK each
                        </span>
                        <span className="text-sm font-medium">
                          Total: {(item.price * item.quantity).toLocaleString()}{" "}
                          MMK
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary (right column) */}
              <div className="bg-gray-100 p-6  shadow-sm h-fit border">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{subtotal.toLocaleString()} MMK</span>
                </div>
                <hr className="mb-4" />
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>{subtotal.toLocaleString()} MMK</span>
                </div>
                <NavLink to="/checkout">
                  <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition font-semibold hover:cursor-pointer">
                    Proceed to Checkout
                  </button>
                </NavLink>
                <NavLink to="/shop/page/1">
                  <button className="w-full mt-3 border border-gray-300 text-gray-700 py-3 hover:bg-gray-50 transition hover:cursor-pointer">
                    Continue Shopping
                  </button>
                </NavLink>
              </div>
            </div>

            {/* Coupon section */}
            <div className="flex w-full max-w-md mx-auto my-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-grow border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <button
                type="button"
                className="border border-l-0 border-gray-300 text-black px-6 py-2 hover:bg-gray-100 transition hover:cursor-pointer"
              >
                Apply
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
