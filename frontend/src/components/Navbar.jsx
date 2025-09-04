import React, { useState, useEffect } from "react";
import { BsBagHeartFill } from "react-icons/bs";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import "../index.css";
import { useCart } from "../context/CartContext"; // Adjust path as needed

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount } = useCart();

  const shopCategories = [
    "Men",
    "Women",
    "New Arrivals",
    "Tees",
    "T-Shirts",
    "Hoodies",
    "Crewnecks",
    "Outwear",
    "Shorts",
    "Accessories",
    "All",
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowScroll = window.pageYOffset || window.scrollY;
      const documentScroll = document.documentElement.scrollTop;
      const bodyScroll = document.body.scrollTop;

      const scrollPosition = windowScroll || documentScroll || bodyScroll;

      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add listeners to multiple targets
    document.body.addEventListener("scroll", handleScroll, { passive: true });

    // Check for token in localStorage to determine login state
    setIsLoggedIn(!!localStorage.getItem("token"));
    // Optionally, listen for storage changes (e.g., login/logout in other tabs)
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div
      className="sticky top-0 z-50 w-full bg-white transition-all duration-300 ease-in-out font-medium font-playfair text-primary"
      style={{
        height: scrolled ? "60px" : "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Center Logo */}
      <NavLink to="/" className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/images/logoWhite.png"
          alt="logo"
          className={`transition-all duration-300 ${
            scrolled ? "h-5 w-5" : "h-6 w-6"
          }`}
        />
      </NavLink>

      {/* Nav Content */}
      <ul className="w-full flex items-center justify-between px-3 sm:px-6 text-sm h-25">
        {/* Left Nav */}
        <div className="ml-5 sm:ml-0 flex items-center justify-between sm:px-4 relative">
          <div className="text-xl sm:hidden flex items-center">
            <GiHamburgerMenu
              onClick={() => setVisible(true)}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop nav */}
          <ul className="hidden sm:flex gap-5">
            <NavLink to="/" className="flex flex-col items-center gap-1 mx-3">
              <p>Home</p>
            </NavLink>
            <div className="relative ">
              <button
                onClick={() => setShopOpen((prev) => !prev)}
                className="flex items-center gap-1 mx-3 focus:outline-none hover:cursor-pointer"
              >
                Shop <RiArrowDropDownLine className="text-lg" />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <ul className="py-2 text-sm text-gray-800">
                    {shopCategories.map((label) => (
                      <li key={label}>
                        <NavLink
                          to={`/product-category/${label
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShopOpen(false)} // close on click
                        >
                          {label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* <NavLink
              to="/gallery"
              className="flex flex-col items-center gap-1 mx-3"
            >
              <p>Gallery</p>
            </NavLink> */}
          </ul>

          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform ${
              visible ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out sm:hidden flex flex-col`}
          >
            <button
              className="absolute top-10 left-10 text-2xl cursor-pointer"
              onClick={() => setVisible(false)}
            >
              ✕
            </button>

            <nav className="flex flex-col gap-4 text-xl text-gray-800 ml-12.5 mt-23 border-l-2 border-gray-200 pl-4">
              {/* Shop expandable menu */}
              <div>
                <button
                  onClick={() => setShopOpen(!shopOpen)}
                  className="flex items-center justify-between w-full py-2 font-semibold"
                >
                  Shop
                  <RiArrowDropDownLine
                    className={`transition-transform duration-300 ${
                      shopOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {shopOpen && (
                  <ul className="pl-4 mt-2 flex flex-col gap-2 text-base text-gray-700">
                    {shopCategories.map((label) => (
                      <li key={label}>
                        <NavLink
                          to={`/product-category/${label
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          onClick={() => setVisible(false)}
                          className="block py-1 hover:text-black"
                        >
                          {label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <NavLink
                to="/gallery"
                onClick={() => setVisible(false)}
                className="block py-2"
              >
                Gallery
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Right Icons */}
        <li className="flex gap-0 sm:gap-5 items-center ml-auto">
          <NavLink
            to="/profile/favourites"
            className="flex flex-col items-center gap-1 mx-2"
          >
            <FaHeart
              className={`transition-all duration-300 ${
                scrolled ? "h-5 w-5" : "h-6 w-6"
              }`}
            />
          </NavLink>

          <NavLink
            to="/cart"
            className="relative flex flex-col items-center gap-1 mx-2 pt-0.5"
          >
            <FaShoppingBag
              className={`transition-all duration-300 ${
                scrolled ? "h-5 w-5" : "h-6 w-6"
              }`}
            />
            {cartCount > 0 && (
              <p className="absolute -bottom-1 -left-1 w-4 text-center leading-4 bg-black text-white rounded-full text-[8px]">
                {cartCount}
              </p>
            )}
          </NavLink>

          {isLoggedIn ? (
            <NavLink to="/profile">
              <div className="group relative flex flex-col items-center cursor-pointer mx-2 mt-0.5">
                <MdAccountCircle
                  className={`transition-all duration-300 ${
                    scrolled ? "h-6 w-6" : "h-7 w-7"
                  }`}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 delay-100">
                  <ul className="flex flex-col text-gray-400 text-sm">
                    <NavLink
                      to="/profile/order"
                      className="hover:text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Order
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className="hover:text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </NavLink>
                  </ul>
                </div>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/profile/loginPage">
              <div className="group relative flex flex-col items-center cursor-pointer mx-2 mt-0.5">
                <MdAccountCircle
                  className={`transition-all duration-300 ${
                    scrolled ? "h-6 w-6" : "h-7 w-7"
                  }`}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 delay-100">
                  <ul className="flex flex-col text-gray-400 text-sm">
                    <NavLink
                      to="/profile/loginPage"
                      className="hover:text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </NavLink>
                  </ul>
                </div>
              </div>
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
