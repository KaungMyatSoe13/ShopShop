import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RxCross2 } from "react-icons/rx";

function WishlistItem({ name, price, image, color, size }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg hover:cursor-pointer transition border border-gray-200 gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="sm:hidden text-red-500 hover:text-red-700 font-medium text-xl self-end sm:self-auto">
          <RxCross2 className="hover:cursor-pointer" />
        </button>
        <img
          src={image}
          alt={name}
          className="w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] object-contain rounded-md"
        />
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-gray-500 text-sm mt-2">
            Color: {color} | Size: {size}
          </p>
          <p className="text-gray-600 text-sm mt-1">${price}</p>
        </div>
      </div>
      <button className="hidden sm:flex text-red-500 hover:text-red-700 font-medium text-xl self-end sm:self-auto">
        <RxCross2 className="hover:cursor-pointer" />
      </button>
    </div>
  );
}

// Sample wishlist data
const wishlistItems = [
  {
    id: 1,
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: "12.99",
    image: "/images/model1.png",
    color: "White",
    size: "M",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 88.5,
    image: "/images/model2.png",
    color: "Black",
    size: "N/A",
  },
  {
    id: 3,
    name: "Leather Backpack",
    price: 112.0,
    image: "/images/model3.png",
    color: "Brown",
    size: "L",
  },
];

function Favourite() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <h1 className="font-playfair text-4xl font-semibold text-gray-800 sm:ml-11 mt-6 ml-4">
        My Wishlist
      </h1>

      <main className="flex flex-col w-[95%] mx-auto mt-5 sm:mt-10 p-6 rounded-lg bg-white shadow border">
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            Your wishlist is currently empty.
          </p>
        ) : (
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[500px]">
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                color={item.color}
                size={item.size}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Favourite;
