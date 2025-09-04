import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ProductRow from "../components/ProductRow";
import OurApproach from "../components/OurApproach";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Shop() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const menSectionRef = useRef(null);
  const topRef = useRef(null);

  const { pageNum } = useParams();
  const currentPage = parseInt(pageNum || "1");

  // Scroll to "ALL PRODUCTS" section when pageNum changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pageNum]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollHint(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (menSectionRef.current) {
      observer.observe(menSectionRef.current);
    }

    return () => {
      if (menSectionRef.current) {
        observer.unobserve(menSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      {/* Hero Image */}
      <div className="w-full">
        <img
          src="/images/vertical image.jpg"
          alt="hero"
          className="sm:w-full sm:h-[400px] object-cover "
        />
      </div>

      {/* Section Title */}
      <div
        ref={(el) => {
          menSectionRef.current = el;
          topRef.current = el;
        }}
        className="text-2xl sm:text-3xl mt-10 ml-5 sm:ml-8 sm:ml-10 font-playfair font-extrabold"
      >
        ALL PRODUCTS
      </div>

      {/* Pass currentPage to ProductRow */}
      <ProductRow currentPage={currentPage} basePath="/shop" />

      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-500 animate-bounce z-50">
          ↓ Scroll down for more
        </div>
      )}

      {/* Extras */}
      <OurApproach />
      <Footer />
    </div>
  );
}

export default Shop;
