import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { GrSearch } from "react-icons/gr";

function ShowCase() {
  const [allProducts, setAllProducts] = useState([]); // store all products from API
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const scrollRef = useRef();
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/products`);
        const data = await res.json();

        // Filter for new arrivals only (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newArrivals = data.filter((product) => {
          const productDate = new Date(product.createdAt);
          return productDate >= thirtyDaysAgo;
        });

        setAllProducts(newArrivals);
      } catch (error) {
        console.error("Failed to fetch products sir", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Debounce the searchTerm input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProducts = allProducts.filter((item) =>
    (item.itemName || item.mainCategory || "")
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase())
  );

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 860, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -860, behavior: "smooth" });
    }
  };

  const handleClick = (product) => {
    // Use originalId if it exists (from by-color endpoint), otherwise use _id
    const productId = product.originalId || product._id;
    navigate(`/product/${productId}`);
  };

  const isProductOutOfStock = (product) => {
    if (!product.variants || product.variants.length === 0) return true;

    // Check if all sizes in all variants have 0 stock
    return product.variants.every(
      (variant) =>
        !variant.sizes ||
        variant.sizes.length === 0 ||
        variant.sizes.every((size) => size.stock === 0)
    );
  };
  return (
    <div className="ml-7.5 flex-col flex w-full h-190 sm:h-full sm:flex-row sm:ml-13">
      {/* LEFT SIDE */}
      <div className="sm:w-[40%] flex flex-col sm:mb-0 sm:h-full h-[35%]">
        <div className="flex flex-row items-center gap-1 bg-[#D9D9D9] px-3 py-1 w-[85%] h-[40px] sm:z-10 sm:w-full">
          <GrSearch />
          <input
            type="text"
            placeholder="Search"
            className="placeholder:text-right outline-none w-full h-[40px] mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="text-4xl mt-4 font-bold font-extrabold font-playfair sm:text-3xl">
          New <br /> Collection
        </span>
        <span className="text-xl font-bold font-fairplay font-thin sm:text-lg">
          Summer
        </span>
        <span className="font-bold font-fairplay font-thin text-sm">2025</span>
        <div className="mb-5 sm:mb-0 flex flex-col sm:flex-row items-center gap-3 mt-5 sm:mt-0 h-98 relative">
          {/* Go To Shop button */}
          <NavLink
            to="shop"
            className="mt-auto flex justify-center items-center h-10 sm:w-full sm:w-4/5 bg-[#D9D9D9] hover:bg-gray-400 transition-colors duration-300 px-4"
          >
            <div className="flex items-center font-playfair font-semibold text-black text-sm sm:text-md sm:w-full">
              Go To Shop
              <HiOutlineArrowLongRight className="ml-auto sm:text-3xl text-xl" />
            </div>
          </NavLink>

          {/* Arrows */}
          <div className="hidden sm:flex justify-between w-full sm:w-auto mt-auto gap-2 sm:gap-3">
            <div
              onClick={scrollLeft}
              className="border border-black p-1 cursor-pointer"
            >
              <IoMdArrowDropleft className="text-3xl" />
            </div>
            <div
              onClick={scrollRight}
              className="border border-black p-1 cursor-pointer"
            >
              <IoMdArrowDropright className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - PRODUCTS */}
      <div className="flex-grow w-full sm:w-[60%] overflow-x-auto flex flex-row sm:h-[91.3%] pb-0 font-playfair">
        <div
          ref={scrollRef}
          className="object-cover sm:mx-2 flex flex-row flex-wrap sm:flex-nowrap w-[100vw] sm:w-[90%] h-auto border-black overflow-x-scroll sm:ml-5 sm:gap-5 gap-2 items-center mr-5"
        >
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => handleClick(item)}
              className="flex flex-col items-start flex-shrink-0 w-[30vw] sm:w-[50%] sm:h-135 px-2 hover:cursor-pointer"
            >
              <img
                src={item.variants?.[0]?.images?.[0] || item.image}
                alt={item.name || item.subCategory}
                className="w-full h-auto sm:h-[90%] object-contain"
              />
              <span className="text-[10px] text-gray-500 sm:text-xs">
                {item.itemName || item.subCategory}
              </span>

              <span className="line-clamp-2 font-semibold">
                {item.name || item.itemName}
              </span>
              {isProductOutOfStock(item) ? (
                <span className="font-semibold text-red-600">Out of Stock</span>
              ) : (
                <span className="font-bold">${item.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowCase;
