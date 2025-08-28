import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductRow({
  currentPage,
  category = "all",
  basePath = `/product-category/${category}`,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRODUCTS_PER_PAGE = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products/by-color");
        const data = await res.json();

        // Filter by category
        let filteredProducts = data;

        if (category && category !== "all") {
          filteredProducts = data.filter((product) => {
            const categoryLower = category.toLowerCase();
            const mainCategoryLower = product.mainCategory?.toLowerCase() || "";
            const genderLower = product.gender?.toLowerCase() || "";

            // Handle different category types
            switch (categoryLower) {
              case "men":
              case "male":
                return (
                  genderLower === "men" ||
                  genderLower === "male" ||
                  genderLower === "man"
                );

              case "women":
              case "female":
                return (
                  genderLower === "women" ||
                  genderLower === "female" ||
                  genderLower === "woman"
                );

              case "new-arrivals":
                // Filter products created in the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
                const productDate = new Date(product.createdAt);
                return productDate >= thirtyDaysAgo;

              case "tees":
              case "t-shirts":
                return (
                  mainCategoryLower.includes("tee") ||
                  mainCategoryLower.includes("t-shirt") ||
                  product.subcategory?.toLowerCase().includes("tee")
                );

              case "hoodies":
                return (
                  mainCategoryLower.includes("hoodie") ||
                  product.subcategory?.toLowerCase().includes("hoodie")
                );

              case "crewnecks":
                return (
                  mainCategoryLower.includes("crewneck") ||
                  mainCategoryLower.includes("crew neck") ||
                  product.subcategory?.toLowerCase().includes("crewneck")
                );

              case "outwear":
              case "outerwear":
                return (
                  mainCategoryLower.includes("outwear") ||
                  mainCategoryLower.includes("outerwear") ||
                  mainCategoryLower.includes("jacket") ||
                  product.subcategory?.toLowerCase().includes("outwear")
                );

              case "shorts":
                return (
                  mainCategoryLower.includes("short") ||
                  product.subcategory?.toLowerCase().includes("short")
                );

              case "accessories":
                return (
                  mainCategoryLower.includes("accessor") ||
                  product.subcategory?.toLowerCase().includes("accessor")
                );

              default:
                // For other categories, check both mainCategory and subcategory
                return (
                  mainCategoryLower.includes(categoryLower) ||
                  genderLower === categoryLower ||
                  product.subcategory?.toLowerCase().includes(categoryLower)
                );
            }
          });
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
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
    // Use originalId to navigate to the main product
    navigate(`/product/${id}`);
  };

  // In the return statement, make sure we're using the right fields:
  return (
    <div className="w-[90%] sm:w-[95vw] mx-auto mb-8">
      {/* Product Count */}
      <div className="mb-4 text-gray-600">
        Showing {currentProducts.length} of {products.length} products
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 mt-6">
        {currentProducts.map((item) => (
          <div
            key={item._id}
            onClick={() => handleProductClick(item.originalId)} // Use originalId for navigation
            className="flex flex-col items-start w-full bg-white hover:shadow-lg border border-gray-200 p-2 sm:p-4 cursor-pointer transition-shadow group"
          >
            <div className="relative w-full h-[250px] sm:h-[300px] overflow-hidden">
              <img
                src={item.images?.[0]} // Use optional chaining for safety
                alt={item.name || item.itemName}
                className={`w-full h-full object-contain absolute inset-0 transition-transform duration-700 ease-in-out
          ${
            item.images?.[1] ? "group-hover:opacity-0" : "group-hover:scale-110"
          } 
        `}
              />

              {item.images?.[1] && (
                <img
                  src={item.images[1]}
                  alt={item.name || item.itemName}
                  className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-110"
                />
              )}
            </div>

            <div className="flex flex-col w-full text-sm items-center">
              <span className="line-clamp-2 font-semibold">
                {item.name || item.itemName}
              </span>
              <span className="font-bold">${item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default ProductRow;
