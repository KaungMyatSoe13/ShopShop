import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RxCross2 } from "react-icons/rx";

function WishlistItem({ id, name, price, image, color, size, onRemove }) {
  const handleItemClick = () => {
    window.location.href = `/product/${id}`;
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div
      onClick={handleItemClick}
      className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4  -lg hover:cursor-pointer transition border border-gray-200 gap-3 sm:gap-0 hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleRemove}
          className="sm:hidden text-red-500 hover:text-red-700 font-medium text-xl self-end sm:self-auto"
        >
          <RxCross2 className="hover:cursor-pointer" />
        </button>
        <img
          src={image || "/images/placeholder.png"}
          alt={name || "Product"}
          className="w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] object-contain  -md"
        />
        <div>
          <h2 className="text-lg font-semibold">{name || "Unnamed Product"}</h2>
          <p className="text-gray-500 text-sm mt-2">
            {color && `Color: ${color}`}
            {color && size && " | "}
            {size && `Size: ${size}`}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {price ? `${price} MMK` : "Price not available"}
          </p>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="hidden sm:flex text-red-500 hover:text-red-700 font-medium text-xl self-end sm:self-auto"
      >
        <RxCross2 className="hover:cursor-pointer" />
      </button>
    </div>
  );
}

function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setError("Please login or create account to view your favorites");
        return;
      }

      const response = await fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        let favs = data.favorites || [];

        // Fetch missing product details
        const enrichedFavs = await Promise.all(
          favs.map(async (item) => {
            if (!item.productName || !item.productImage || !item.productPrice) {
              try {
                const productRes = await fetch(
                  `http://localhost:5000/api/products/${item.productId}`
                );
                if (productRes.ok) {
                  const product = await productRes.json();
                  return {
                    ...item,
                    productName: product.itemName,
                    productImage: product.variants?.[0]?.images?.[0] || "",
                    productPrice: product.price,
                  };
                }
              } catch (err) {
                console.error("Failed to fetch product details", err);
              }
            }
            return item;
          })
        );

        setFavorites(enrichedFavs);
      } else if (response.status === 401) {
        setError("Please login to view your favorites");
      } else {
        setError("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to manage favorites");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/favorites/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        setFavorites(favorites.filter((item) => item.productId !== productId));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      alert("Failed to remove from favorites");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow flex flex-col">
        <h1 className="font-playfair text-4xl font-semibold text-gray-800 sm:ml-11 mt-6 ml-4">
          My Wishlist
        </h1>

        <main className="flex-grow flex flex-col w-[95%] mx-auto mt-5 sm:mt-10 p-6  -lg bg-white shadow border">
          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin  -full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-lg">Loading favorites...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
              <p className="text-red-500 italic text-lg mb-4">{error}</p>
              {error.includes("login") && (
                <button
                  onClick={() => (window.location.href = "/profile/loginPage")}
                  className="bg-black text-white px-6 py-3 hover:opacity-80 transition hover:cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
              <p className="text-gray-500 text-lg mb-4">
                Your wishlist is currently empty.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Start adding products you love to see them here!
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-black text-white px-6 py-3 hover:opacity-80 transition hover:cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {favorites.length} item{favorites.length !== 1 ? "s" : ""} in
                  your wishlist
                </p>
              </div>
              <div className="flex flex-col gap-6 overflow-y-auto max-h-[500px]">
                {favorites.map((item) => (
                  <WishlistItem
                    key={item._id}
                    id={item.productId}
                    name={item.productName}
                    price={item.productPrice}
                    image={item.productImage}
                    color={item.selectedColor}
                    size={item.selectedSize}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Favourite;
