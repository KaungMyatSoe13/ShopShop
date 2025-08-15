import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-center gap-8">
        {/* Left Section: Logo + Description */}
        <div className="flex items-center gap-4 max-w-xl text-center sm:text-left">
          <img src="/images/logoWhite.png" alt="Logo" className="h-12 w-auto" />
          <p className="text-xs text-gray-600 leading-relaxed sm:text-sm">
            Rooted in the streets of Myanmar, our brand blends local culture
            with bold, contemporary design. We create streetwear that speaks to
            individuality, expression, and everyday hustle — crafted for those
            who move differently.
          </p>
        </div>

        {/* Right Section: Links */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 text-sm text-gray-700">
          <NavLink to="/about" className="hover:underline">
            About
          </NavLink>
          <NavLink to="/faq" className="hover:underline">
            FAQ
          </NavLink>
          <NavLink to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </NavLink>
          <NavLink to="/terms" className="hover:underline">
            Terms
          </NavLink>
          <NavLink to="/contact" className="hover:underline">
            Contact
          </NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
