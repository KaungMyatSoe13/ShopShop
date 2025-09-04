import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AdminEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentVariant, setCurrentVariant] = useState({
    images: [],
  });

  const [product, setProduct] = useState({
    batchName: "",
    mainCategory: "",
    subCategory: "",
    gender: "",
    itemName: "",
    description: "",
    price: "",
    variants: [],
  });

  const categories = ["T-shirt", "Sweater", "Shoe", "Accessory"];
  const genders = ["male", "female", "unisex"];
  const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/admin/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedImage = (variantIndex, imageIndex) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              tempImages:
                variant.tempImages?.filter((_, i) => i !== imageIndex) || [],
            }
          : variant
      ),
    }));
  };

  const removeExistingImage = (variantIndex, imageIndex) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              images: variant.images.filter((_, i) => i !== imageIndex),
            }
          : variant
      ),
    }));
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      const res = await fetch(`${BACKEND_URL}/api/auth/upload-images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      return res.ok ? data.imageUrls : [];
    } catch (err) {
      console.error("Error uploading images:", err);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleVariantChange = (variantIndex, field, value) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const handleSizeStockChange = (variantIndex, sizeIndex, newStock) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, sIndex) =>
                sIndex === sizeIndex
                  ? { ...size, stock: parseInt(newStock) || 0 }
                  : size
              ),
            }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          images: [""],
          sizes: standardSizes.map((size) => ({ size, stock: 0 })),
        },
      ],
    }));
  };

  const removeVariant = (variantIndex) => {
    if (window.confirm("Are you sure you want to remove this variant?")) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, index) => index !== variantIndex),
      }));
    }
  };

  const addImageUrl = (variantIndex) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, images: [...variant.images, ""] }
          : variant
      ),
    }));
  };

  const updateImageUrl = (variantIndex, imageIndex, url) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              images: variant.images.map((img, iIndex) =>
                iIndex === imageIndex ? url : img
              ),
            }
          : variant
      ),
    }));
  };

  const removeImageUrl = (variantIndex, imageIndex) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              images: variant.images.filter(
                (_, iIndex) => iIndex !== imageIndex
              ),
            }
          : variant
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !product.itemName ||
      !product.price ||
      !product.mainCategory ||
      !product.gender
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (product.variants.length === 0) {
      setError("Please add at least one variant");
      return;
    }

    // Validate variants
    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.color) {
        setError(`Variant ${i + 1}: Color is required`);
        return;
      }

      // Check if variant has either existing images or new images to upload
      const hasExistingImages = variant.images && variant.images.length > 0;
      const hasNewImages = variant.tempImages && variant.tempImages.length > 0;

      if (!hasExistingImages && !hasNewImages) {
        setError(`Variant ${i + 1}: At least one image is required`);
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);

      // Process variants to upload new images
      const updatedVariants = await Promise.all(
        product.variants.map(async (variant) => {
          let finalImages = [...(variant.images || [])]; // Keep existing images

          // Upload new images if any
          if (variant.tempImages && variant.tempImages.length > 0) {
            try {
              const newImageUrls = await uploadImages(variant.tempImages);
              finalImages = [...finalImages, ...newImageUrls];
            } catch (uploadError) {
              console.error("Error uploading images for variant:", uploadError);
              throw new Error(
                `Failed to upload images for variant with color: ${variant.color}`
              );
            }
          }

          // Return variant without tempImages
          const { tempImages, ...cleanVariant } = variant;
          return {
            ...cleanVariant,
            images: finalImages,
          };
        })
      );

      const updatedProduct = {
        ...product,
        variants: updatedVariants,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/admin/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin  -full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product.itemName) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Error Loading Product
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => fetchProduct()}
                className="bg-black text-white px-6 py-2   hover:bg-gray-800"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/admin/products")}
                className="bg-gray-300 text-gray-700 px-6 py-2   hover:bg-gray-400"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 justify-center w-full">
        <div className="flex flex-col w-[95%] max-w-4xl mt-4 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-gray-300 text-gray-700 px-6 py-2 text-xs sm:text-md  hover:bg-gray-400 transition hover:cursor-pointer"
            >
              Back to Products
            </button>
            <h1 className="text-sm sm:text-3xl font-bold">Edit Product</h1>
            <div className="space-x-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 text-xs sm:text-md  hover:bg-green-800 disabled:opacity-50 transition hover:cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3  ">
              {error}
            </div>
          )}

          {/* Basic Product Information */}
          <div className="bg-white  -lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={product.itemName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={product.batchName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Category *
                </label>
                <select
                  name="mainCategory"
                  value={product.mainCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={product.subCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={product.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (MMK) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white  -lg shadow p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Variants</h2>
              <button
                onClick={addVariant}
                className="bg-green-600 text-white text-xs sm:text-md px-4 py-2 hover:cursor-pointer hover:bg-green-700 transition"
              >
                Add Variant
              </button>
            </div>

            {product.variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="border border-gray-200  -lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Variant {variantIndex + 1}
                  </h3>
                  <button
                    onClick={() => removeVariant(variantIndex)}
                    className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                  >
                    Remove Variant
                  </button>
                </div>

                {/* Color */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, "color", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300  -md focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Red, Blue, Black"
                    required
                  />
                </div>

                {/* Images */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      handleVariantChange(variantIndex, "tempImages", files);
                    }}
                    multiple
                    accept="image/*"
                    className="w-full border border-gray-300 py-2 px-4 rounded-md"
                  />

                  {/* Show selected files */}
                  {variant.tempImages && variant.tempImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Selected images ({variant.tempImages.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.tempImages.map((file, index) => (
                          <div
                            key={index}
                            className="relative bg-gray-100 p-2 text-sm"
                          >
                            <span className="text-xs">{file.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeSelectedImage(variantIndex, index)
                              }
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show existing uploaded images */}
                  {variant.images && variant.images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Current images:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.images.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt=""
                              className="w-16 h-16 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeExistingImage(variantIndex, index)
                              }
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sizes and Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock by Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {variant.sizes.map((sizeItem, sizeIndex) => (
                      <div key={sizeIndex} className="text-center">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {sizeItem.size}
                        </label>
                        <input
                          type="number"
                          value={sizeItem.stock}
                          onChange={(e) =>
                            handleSizeStockChange(
                              variantIndex,
                              sizeIndex,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300   text-sm focus:ring-1 focus:ring-black focus:border-transparent"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Total stock for this variant:{" "}
                    {variant.sizes.reduce(
                      (total, size) => total + (size.stock || 0),
                      0
                    )}{" "}
                    units
                  </p>
                </div>
              </div>
            ))}

            {product.variants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No variants added yet.</p>
                <p className="text-sm">
                  Click "Add Variant" to create the first variant.
                </p>
              </div>
            )}
          </div>

          {/* Total Stock Summary */}
          {product.variants.length > 0 && (
            <div className="bg-gray-100  -lg p-4 border">
              <h3 className="font-medium text-gray-800 mb-2">Stock Summary</h3>
              <p className="text-sm text-gray-600">
                Total Product Stock:{" "}
                {product.variants.reduce(
                  (total, variant) =>
                    total +
                    variant.sizes.reduce(
                      (variantTotal, size) => variantTotal + (size.stock || 0),
                      0
                    ),
                  0
                )}{" "}
                units across {product.variants.length} variant
                {product.variants.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEditProduct;
