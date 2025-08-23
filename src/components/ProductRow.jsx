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
      try {
        const res = await fetch("http://localhost:5000/api/products/by-color"); // Update this URL to match your backend
        const data = await res.json();

        // Filter by category if needed
        let filteredProducts = data;
        if (category !== "all") {
          filteredProducts = data.filter(
            (product) =>
              product.mainCategory
                .toLowerCase()
                .includes(category.toLowerCase()) || product.gender === category
          );
        }

        setProducts(filteredProducts);
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
        {currentProducts.map((item) => (
          <div
            key={item._id}
            onClick={() => handleProductClick(item.originalId)}
            className="flex flex-col items-start w-full bg-white hover:shadow-lg border border-gray-200 p-2 sm:p-4 cursor-pointer transition-shadow"
          >
            <img
              src={item.images[0]} // Show first image
              alt={item.name}
              className="w-full h-[250px] sm:h-[300px] object-contain mb-4"
            />
            <div className="flex flex-col w-full text-sm">
              <span className="line-clamp-2 font-semibold">{item.name}</span>
              <span className="text-gray-600">{item.color}</span>
              <span className="font-bold">${item.price}</span>
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
