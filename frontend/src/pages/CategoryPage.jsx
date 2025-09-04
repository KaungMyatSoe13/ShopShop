import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductRow from "../components/ProductRow";

function CategoryPage() {
  const { category, pageNum } = useParams();
  const currentPage = pageNum ? parseInt(pageNum, 10) : 1;

  const formatCategoryName = (cat) => {
    if (!cat) return "All Products";

    const categoryMap = {
      all: "All Products",
      men: "Men's Collection",
      women: "Women's Collection",
      kids: "Kids' Collection",
      children: "Kids' Collection",
      "new-arrivals": "New Arrivals",
      shoes: "Shoes",
      clothing: "Clothing",
      accessories: "Accessories",
      sports: "Sports",
      casual: "Casual Wear",
      formal: "Formal Wear",
    };

    const lowerCat = cat.toLowerCase();

    // Check if we have a specific mapping
    if (categoryMap[lowerCat]) {
      return categoryMap[lowerCat];
    }

    // Otherwise, capitalize first letter and replace hyphens with spaces
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-[94%] mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            {formatCategoryName(category)}
          </h1>

          {/* Breadcrumb */}
          <div className="text-center text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>{formatCategoryName(category)}</span>
          </div>
        </div>

        {/* Product Grid */}
        <ProductRow
          currentPage={currentPage}
          category={category}
          basePath={`/product-category/${category}`}
        />
      </main>
      <Footer />
    </div>
  );
}

export default CategoryPage;
