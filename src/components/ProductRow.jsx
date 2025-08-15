import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductRow({
  currentPage,
  category = "all",
  basePath = `/product-category/${category}`, // default basePath depends on category
}) {
  const [products, setProducts] = useState([]);
  const PRODUCTS_PER_PAGE = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let url = "https://fakestoreapi.com/products";

      // Map category slugs to fakestoreapi categories
      const categoryMap = {
        men: "men's clothing",
        women: "women's clothing",
        kids: "jewelery", // fakestoreapi doesn't have kids category, using jewelery as placeholder
      };

      if (category !== "all") {
        const apiCategory = categoryMap[category] || "men's clothing";
        url = `https://fakestoreapi.com/products/category/${encodeURIComponent(
          apiCategory
        )}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [category]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageClick = (pageNumber) => {
    if (pageNumber === 1) {
      navigate(basePath);
    } else {
      navigate(`${basePath}/page/${pageNumber}`);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="w-[90%] sm:w-[95vw] mx-auto mb-8">
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 mt-6">
        {currentProducts.length === 0
          ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start w-full bg-white border border-gray-200 p-4 animate-pulse"
                >
                  <div className="w-full h-[250px] sm:h-[300px] bg-gray-200 mb-3" />
                  <div className="w-3/4 h-4 bg-gray-300 mb-2" />
                  <div className="w-1/2 h-4 bg-gray-300" />
                </div>
              ))
          : currentProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item.id)}
                className="flex flex-col items-start w-full bg-white hover:shadow-lg border border-gray-200 p-2 sm:p-4 cursor-pointer transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[250px] sm:h-[300px] object-contain mb-4"
                />
                <div className="flex justify-between w-full text-sm font-semibold">
                  <span className="line-clamp-2 w-[70%]">{item.title}</span>
                  <span className="ml-auto font-bold">${item.price}</span>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`px-4 py-2 font-semibold ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-black hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductRow;
