import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fixed URL - add /api prefix
      const url = `${BACKEND_URL}/api/admin/products?page=${page}&limit=12&search=${search}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalProducts(data.pagination?.totalProducts || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      // Fixed URL - correct path
      const res = await fetch(`${BACKEND_URL}/api/admin/products/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const statsData = await res.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  // Add this component to your AdminProducts.jsx for showing variants

  const VariantDisplay = ({ variants }) => {
    return (
      <div className="space-y-2">
        {variants.map((variant, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4  -full border border-gray-300"
              style={{
                backgroundColor: variant.color.toLowerCase(),
                // Fallback for colors that aren't CSS color names
                background:
                  variant.color.toLowerCase() === "white"
                    ? "#ffffff"
                    : variant.color.toLowerCase(),
              }}
              title={variant.color}
            />
            <span className="text-xs text-gray-600">{variant.color}</span>
            <span className="text-xs text-gray-400">
              ({variant.sizes.reduce((total, size) => total + size.stock, 0)}{" "}
              units)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Product deleted successfully");
        fetchProducts(currentPage, searchTerm);
        fetchStats();
      } else {
        const error = await res.json();
        alert("Failed to delete product: " + error.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product");
    }
  };

  const getStockStatus = (totalStock) => {
    if (totalStock === 0)
      return { text: "Out of Stock", color: "text-red-600 bg-red-100" };
    if (totalStock < 10)
      return { text: "Low Stock", color: "text-orange-600 bg-orange-100" };
    return { text: "In Stock", color: "text-green-600 bg-green-100" };
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin  -full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 justify-center w-full">
        <div className="flex flex-col w-[95%] max-w-7xl mt-4 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-600 text-white  hover:bg-gray-800 hover:cursor-pointer px-3 py-2 sm:px-6 sm:py-2 text-[10px] sm:text-md"
            >
              Back to Admin Panel
            </button>
            <h1 className="text-lg sm:text-3xl font-semibold">Products</h1>
            <button
              onClick={() => navigate("/admin/products/add")}
              className="bg-gray-600 text-white  hover:bg-gray-800 transition hover:cursor-pointer px-3 py-2 sm:px-6 sm:py-2 text-[10px] sm:text-md"
            >
              Add New Product
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4  -lg shadow border">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Products
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="bg-white p-4  -lg shadow border">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Stock
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStock}
                </p>
              </div>
              <div className="bg-white p-4  -lg shadow border">
                <h3 className="text-sm font-medium text-gray-500">
                  Categories
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCategories}
                </p>
              </div>
              <div className="bg-white p-4  -lg shadow border">
                <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.lowStockProducts}
                </p>
              </div>
              <div className="bg-white p-4  -lg shadow border">
                <h3 className="text-sm font-medium text-gray-500">
                  Out of Stock
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {stats.outOfStockProducts}
                </p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white p-4  -lg shadow ">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products by name, batch, or category..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border border-gray-300  focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-500">
                Showing {products.length} of {totalProducts} products
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3  ">
              Error: {error}
              <button
                onClick={() => fetchProducts(currentPage, searchTerm)}
                className="ml-4 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Products Table - Desktop */}
          <div className="hidden md:block bg-white  -lg shadow overflow-hidden">
            <div className="overflow-x-auto border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.totalStock);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 object-cover  "
                                src={
                                  product.variants?.[0]?.images?.[0] ||
                                  "/placeholder.png"
                                }
                                alt={product.itemName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.itemName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.batchName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.mainCategory}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.gender}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.price.toLocaleString()} MMK
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold ${stockStatus.color}`}
                          >
                            {product.totalStock} units
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {stockStatus.text}
                          </div>
                        </td>
                        {/* Enhanced variants column */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-1">
                            {product.totalVariants} colors
                          </div>
                          <VariantDisplay variants={product.variants || []} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
                            className="text-indigo-600 hover:text-indigo-900 hover:cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(product._id, product.itemName)
                            }
                            className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Grid - Mobile */}
          <div className="md:hidden space-y-4">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.totalStock);
              return (
                <div key={product._id} className="bg-white  shadow p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      className="h-20 w-20 object-cover  "
                      src={
                        product.variants?.[0]?.images?.[0] || "/placeholder.png"
                      }
                      alt={product.itemName}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.itemName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.batchName}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {product.price.toLocaleString()} MMK
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold ${stockStatus.color}`}
                        >
                          {product.totalStock} units
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.totalVariants} variants
                        </span>
                      </div>
                      <div className="flex space-x-3 mt-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/${product._id}/edit`)
                          }
                          className="text-xs bg-blue-600 text-white px-3 py-1   hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id, product.itemName)
                          }
                          className="text-xs bg-red-600 text-white px-3 py-1   hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6  -lg shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium   text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex  -md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-black border-black text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? `No products match "${searchTerm}"`
                  : "Get started by adding your first product."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/admin/products/add")}
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 hover:cursor-pointer"
                >
                  Add Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
