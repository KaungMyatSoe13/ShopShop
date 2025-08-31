import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Collapsible({ isOpen, children }) {
  return (
    <div
      style={{
        maxHeight: isOpen ? "1000px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}
    >
      <div className="pt-2">{children}</div>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Add these state variables

  const [availableStock, setAvailableStock] = useState(0);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const { addToCart } = useCart();

  const changeImageWithFade = (newIndex) => {
    setIsFading(true); // start fade out

    setTimeout(() => {
      setSelectedImageIndex(newIndex); // change image after fade out
      setIsFading(false); // fade in
    }, 300); // duration matches CSS transition duration
  };

  // Add this function to check stock when size/color changes
  const checkStock = (size, color) => {
    if (!product || !size || !color) {
      setAvailableStock(0);
      setIsOutOfStock(true);
      return;
    }

    const variant = product.variants.find((v) => v.color === color);
    if (variant) {
      const sizeData = variant.sizes.find((s) => s.size === size);
      if (sizeData) {
        setAvailableStock(sizeData.stock);
        setIsOutOfStock(sizeData.stock === 0);
        return;
      }
    }
    setAvailableStock(0);
    setIsOutOfStock(true);
  };

  // For swipe handling
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const productData = await response.json();

        setProduct(productData);
        // Set first variant as default if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
          setSelectedImageIndex(0);
          // Set first available size as default
          if (
            productData.variants[0].sizes &&
            productData.variants[0].sizes.length > 0
          ) {
            setSize(productData.variants[0].sizes[0].size);
            // Check stock for the default selection
            checkStock(
              productData.variants[0].sizes[0].size,
              productData.variants[0].color
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, skipping favorite check");
          return; // User not logged in, skip favorite check
        }

        console.log("Checking favorite status for product:", id);
        const url = `http://localhost:5000/api/favorites/check/${id}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Favorite status:", data.isFavorited);
          setIsFavorited(data.isFavorited);
        } else {
          console.error(
            "Failed to check favorite status:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Failed to check favorite status:", error);
        // Don't show error to user, just keep default false state
      }
    };

    if (id) {
      fetchProduct();
      checkFavoriteStatus();
    }
  }, [id]);

  // Add the handleFavoriteToggle function
  // Add the handleFavoriteToggle function
  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add favorites");
        return;
      }

      const favoriteData = {
        productId: product._id,
        productName: product.name || product.title,
        productPrice: product.price,
        productImage: selectedVariant?.images?.[0] || product.images?.[0] || "",
        selectedColor: selectedVariant?.color || "",
        selectedSize: size || "",
      };

      // Updated URL to match your working API path
      const response = await fetch(
        `http://localhost:5000/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(favoriteData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
        // Optional: Show success message
        // You could add a toast notification here
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      alert("Failed to update favorites");
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Keyboard navigation inside modal
  const onKeyDown = useCallback(
    (e) => {
      if (!showPreview || !product?.images) return;
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev === 0 ? product.images.length - 1 : prev - 1
        );
      } else if (e.key === "Escape") {
        setShowPreview(false);
      }
    },
    [showPreview, product?.images?.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Swipe handlers for modal
  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !product?.images) return;
    const distance = touchStartX - touchEndX;
    const threshold = 50; // minimum swipe distance in px

    if (distance > threshold) {
      // swipe left → next image
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else if (distance < -threshold) {
      // swipe right → previous image
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Get available sizes dynamically or use default
  const getAvailableSizes = () => {
    if (selectedVariant?.sizes && selectedVariant.sizes.length > 0) {
      return selectedVariant.sizes.map((sizeItem) => sizeItem.size);
    }
    return [];
  };

  // Update your add to cart function
  const handleAddToCart = async () => {
    // Validation checks
    if (!size) {
      alert("Please select a size");
      return;
    }

    if (!selectedVariant?.color) {
      alert("Please select a color");
      return;
    }
    if (quantity > availableStock) {
      alert(`Sorry this item is out of stock`);
      return;
    }

    if (isOutOfStock) {
      alert("This item is out of stock");
      return;
    }

    // Console logging for debugging
    console.log("Adding to cart:", {
      productId: product._id,
      itemName: product.itemName,
      size: size, // Changed from selectedSize
      color: selectedVariant?.color, // Changed from selectedColor
      quantity: quantity,
      price: product.price,
      availableStock: availableStock,
    });

    try {
      await addToCart(
        product._id,
        quantity,
        size, // Changed from selectedSize
        selectedVariant?.images?.[0] || "",
        selectedVariant?.color, // Changed from selectedColor
        product.price,
        product.subCategory,
        product.itemName
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Failed to add to cart");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-3 hover:opacity-80 transition"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const productImages = selectedVariant?.images || [];
  const selectedImage = productImages[selectedImageIndex] || productImages[0];
  const availableSizes = getAvailableSizes();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center relative">
            {/* Heart Button */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 z-10"
              aria-label="Favorite"
            >
              <FaHeart
                size={22}
                className={`transition-colors duration-300 hover:cursor-pointer ${
                  isFavorited
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-300"
                }`}
              />
            </button>

            <img
              src={selectedImage}
              alt={product.name || product.title}
              onClick={() => setShowPreview(true)}
              className={`w-full h-[78%] object-contain transition-all duration-300 cursor-pointer select-none`}
              style={{
                opacity: isFading ? 0 : 1,
                transition: "opacity 0.3s ease",
                userSelect: "none",
              }}
              draggable={false}
            />

            {/* Dots Navigation - only show if multiple images */}
            {productImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {productImages.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => changeImageWithFade(index)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition ${
                      selectedImageIndex === index
                        ? "bg-black"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">
              {product.name || product.title}
            </h1>

            {product.brand && (
              <p className="text-gray-600 text-lg">{product.brand}</p>
            )}

            {product.color && (
              <p className="text-gray-600">Color: {product.color}</p>
            )}

            <p className="text-2xl font-semibold text-gray-900">
              {product.price}MMK
            </p>
            {/* Variant/Color Selection */}
            {product?.variants && product.variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant, index) => (
                    <button
                      key={`variant-${index}`}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedImageIndex(0);
                        if (variant.sizes && variant.sizes.length > 0) {
                          const firstSize = variant.sizes[0].size;
                          setSize(firstSize);
                          checkStock(firstSize, variant.color); // ADD THIS LINE
                        }
                      }}
                      className={`px-4 py-2 border transition hover:cursor-pointer ${
                        selectedVariant === variant
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-300"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Size */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Size</h3>
              <div className="flex gap-2 flex-wrap ">
                {availableSizes.map((s, index) => (
                  <button
                    key={`size-${index}-${s}`}
                    onClick={() => {
                      setSize(s);
                      checkStock(s, selectedVariant?.color);
                    }}
                    className={`px-4 py-2 border transition hover:cursor-pointer
    ${
      size === s
        ? "bg-black text-white border-black" // selected state (no hover color change)
        : "bg-white text-black border-gray-400 hover:bg-gray-300" // non-selected hover
    }
  `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Quantity</h3>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-20 px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {size && selectedVariant?.color && (
              <p
                className={`text-sm ${
                  availableStock < 5 ? "text-red-600" : "text-green-600"
                }`}
              >
                {availableStock > 0
                  ? `${availableStock} in stock`
                  : "Out of stock"}
              </p>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !size || !selectedVariant?.color}
              className={`w-full py-3 transition  font-medium ${
                isOutOfStock || !size || !selectedVariant?.color
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-black text-white hover:bg-gray-800 hover:cursor-pointer"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {/* Product Categories/Tags */}
            {/* {(product.mainCategory || product.gender) && (
              <div className="flex gap-2 mt-4">
                {product.mainCategory && (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                    {product.mainCategory}
                  </span>
                )}
                {product.gender && (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                    {product.gender}
                  </span>
                )}
              </div>
            )} */}

            {/* Collapsible Sections */}
            <div className="space-y-4 text-sm text-gray-700 pt-6 border-t">
              {/* Details */}
              <div>
                <div
                  onClick={() => toggleSection("details")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline text-lg">
                    Details
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "details" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "details"}>
                  <div className="space-y-2 mt-2">
                    {product.details ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: product.details }}
                      />
                    ) : (
                      <>
                        <p>• Premium Quality Product</p>
                        <p>• 100% Authentic</p>
                        <p>• Comfortable Fit</p>
                        {product.material && (
                          <p>• Material: {product.material}</p>
                        )}
                      </>
                    )}
                  </div>
                </Collapsible>
              </div>

              {/* Size Guide */}
              <div className="border-t pt-4">
                <div
                  onClick={() => toggleSection("size")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline text-lg">
                    Size Guide
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "size" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "size"}>
                  <div className="overflow-x-auto mt-2">
                    <table className="table-auto w-full text-left border">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Size</th>
                          <th className="border px-2 py-1">Chest (in)</th>
                          <th className="border px-2 py-1">Length (in)</th>
                          <th className="border px-2 py-1">Shoulder (in)</th>
                          <th className="border px-2 py-1">Sleeve (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">MEDIUM</td>
                          <td className="border px-2 py-1">22</td>
                          <td className="border px-2 py-1">29</td>
                          <td className="border px-2 py-1">22</td>
                          <td className="border px-2 py-1">8.5</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">LARGE</td>
                          <td className="border px-2 py-1">23.5</td>
                          <td className="border px-2 py-1">30</td>
                          <td className="border px-2 py-1">23</td>
                          <td className="border px-2 py-1">9</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">XLARGE</td>
                          <td className="border px-2 py-1">25</td>
                          <td className="border px-2 py-1">31</td>
                          <td className="border px-2 py-1">24</td>
                          <td className="border px-2 py-1">9.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Collapsible>
              </div>

              {/* Shipping */}
              <div className="border-t pt-4 border-b pb-4">
                <div
                  onClick={() => toggleSection("shipping")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline text-lg">
                    Shipping
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "shipping" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "shipping"}>
                  <ul className="list-disc pl-5 mt-2">
                    <li>YANGON: 1–2 business days</li>
                    <li>MANDALAY: 2–4 business days</li>
                    <li>OTHER CITIES: 2–7 business days</li>
                  </ul>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Preview Modal */}
      {showPreview && productImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: "none" }}
        >
          {/* Stop modal close when clicking on image */}
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90%] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Navigation arrows - only show if multiple images */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? productImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:text-gray-300 transition"
                aria-label="Previous Image"
              >
                <FaArrowLeft size={30} className="hover:cursor-pointer" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === productImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:text-gray-300 transition"
                aria-label="Next Image"
              >
                <FaArrowRight size={30} className="hover:cursor-pointer" />
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition"
            aria-label="Close Preview"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
