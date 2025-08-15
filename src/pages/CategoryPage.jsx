import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductRow from "../components/ProductRow";

function CategoryPage() {
  const { category, pageNum } = useParams();

  // parse pageNum or fallback to 1
  const currentPage = pageNum ? parseInt(pageNum, 10) : 1;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-[94%] mx-auto py-6">
        <h1 className="text-3xl font-bold capitalize mb-6">
          {category === "all" ? "All Products" : category}
        </h1>
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
