import React, { useState, useRef } from "react";
import ProfileSideBar from "../adminComponents/ProfileSideBar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AddProduct() {
  const formRef = useRef(null);

  const [product, setProduct] = useState({
    batchName: "",
    genders: {
      male: [],
      female: [],
      unisex: [],
    },
  });

  // Update these state variables
  const [currentProduct, setCurrentProduct] = useState({
    mainCategory: "",
    subCategory: "",
    price: "",
    variants: [],
    targetGender: "male",
  });

  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    description: "",
    color: "",
    sizes: [],
    images: [],
  });

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "Brown", "White", "Red", " Blue", "Green", "Gray"];
  const genders = ["male", "female", "unisex"];
  const mainCategories = ["T-shirt", "Sweater", "Shoe", "Accessory"];

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      const res = await fetch(`${BACKEND_URL}api/auth/upload-images`, {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Batch name belongs to top-level product
    if (name === "batchName") {
      setProduct((prev) => ({
        ...prev,
        batchName: value,
      }));
      return;
    }

    // Handle file uploads for currentVariant
    if (name === "images" && files) {
      const imageFiles = Array.from(files);
      setCurrentVariant((prev) => ({
        ...prev,
        images: imageFiles,
      }));
      return;
    }

    // Fields that belong to currentProduct
    if (
      ["mainCategory", "subCategory", "price", "targetGender"].includes(name)
    ) {
      setCurrentProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // Fields that belong to currentVariant (name, description, color, etc.)
    if (["name", "description", "color"].includes(name)) {
      setCurrentVariant((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }
  };

  const handleVariantSizeChange = (size, stock) => {
    const existingIndex = currentVariant.sizes.findIndex(
      (s) => s.size === size
    );

    if (stock > 0) {
      if (existingIndex >= 0) {
        const newSizes = [...currentVariant.sizes];
        newSizes[existingIndex] = { size, stock: parseInt(stock) };
        setCurrentVariant({
          ...currentVariant,
          sizes: newSizes,
        });
      } else {
        setCurrentVariant({
          ...currentVariant,
          sizes: [...currentVariant.sizes, { size, stock: parseInt(stock) }],
        });
      }
    } else {
      if (existingIndex >= 0) {
        setCurrentVariant({
          ...currentVariant,
          sizes: currentVariant.sizes.filter((s) => s.size !== size),
        });
      }
    }
  };

  const addVariant = () => {
    if (
      !currentVariant.name ||
      !currentVariant.color ||
      currentVariant.sizes.length === 0 ||
      currentVariant.images.length === 0
    ) {
      alert(
        "Please fill in product name, select a color, add stock for at least one size, and upload images"
      );
      return;
    }
    setCurrentProduct({
      ...currentProduct,
      variants: [...currentProduct.variants, { ...currentVariant }],
    });
    // Keep name and description for next variant
    setCurrentVariant({
      name: currentVariant.name,
      description: currentVariant.description,
      color: "",
      sizes: [],
      images: [],
    });
  };

  const removeVariant = (index) => {
    setCurrentProduct({
      ...currentProduct,
      variants: currentProduct.variants.filter((_, i) => i !== index),
    });
  };

  const addProductToGender = () => {
    if (!currentProduct.targetGender || currentProduct.variants.length === 0) {
      alert("Please fill all required fields and add at least one variant");
      return;
    }
    const { targetGender, ...productData } = currentProduct;
    setProduct({
      ...product,
      genders: {
        ...product.genders,
        [targetGender]: [...product.genders[targetGender], { ...productData }],
      },
    });

    setCurrentProduct({
      mainCategory: "",
      subCategory: "",
      images: [],
      variants: [],
      price: "",
      targetGender: "male",
    });
  };

  const removeProductFromGender = (gender, productIndex) => {
    setProduct({
      ...product,
      genders: {
        ...product.genders,
        [gender]: product.genders[gender].filter((_, i) => i !== productIndex),
      },
    });
  };

  const handleProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedGenders = {};

      for (const [gender, products] of Object.entries(product.genders)) {
        updatedGenders[gender] = [];
        for (const prod of products) {
          const updatedVariants = [];

          // Process each variant to upload images
          for (const variant of prod.variants) {
            const imageUrls = await uploadImages(variant.images); // Upload images for each variant
            updatedVariants.push({
              ...variant,
              images: imageUrls, // Replace File objects with URLs
            });
          }

          updatedGenders[gender].push({
            ...prod,
            variants: updatedVariants, // Use updated variants with image URLs
          });
        }
      }

      const productData = {
        ...product,
        genders: updatedGenders,
      };

      const res = await fetch(`${BACKEND_URL}api/auth/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Batch added successfully!");
        setProduct({
          batchName: "",
          genders: {
            male: [],
            female: [],
            unisex: [],
          },
        });
        setCurrentProduct({
          mainCategory: "",
          subCategory: "",
          variants: [],
          price: "",
          targetGender: "male",
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error adding batch:", err);
      alert("Something went wrong!");
    }
  };

  const handleDiscard = () => {
    setProduct({
      batchName: "",
      genders: {
        male: [],
        female: [],
        unisex: [],
      },
    });
    setCurrentProduct({
      mainCategory: "",
      subCategory: "",
      images: [],
      variants: [],
      price: "",
      targetGender: "male",
    });
    setCurrentVariant({
      name: "",
      description: "",
      color: "",
      sizes: [],
    });
  };

  const removeImage = (index) => {
    const newImages = currentVariant.images.filter((_, i) => i !== index); // Change from currentProduct to currentVariant
    setCurrentVariant({
      // Change from currentProduct to currentVariant
      ...currentVariant,
      images: newImages,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border my-4 bg-white shadow-lg border">
          {/* Sidebar placeholder */}
          <ProfileSideBar />

          {/* Main content */}
          <div className="flex-grow sm:w-1/2 p-6 text-gray-700 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Batch Name - Top Level */}
              <div className="bg-white p-6  -lg shadow-md mb-6 border">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 ">
                  Batch Information
                </h3>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 ">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    name="batchName"
                    value={product.batchName}
                    onChange={handleChange}
                    placeholder="e.g., Summer Collection 2024"
                    className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Current Product Form */}
              <div className="bg-white p-6  -lg shadow-md mb-6 border">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 ">
                  Add Product to Batch
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Target Gender */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Gender Category *
                      </label>
                      <select
                        name="targetGender"
                        value={currentProduct.targetGender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                      >
                        {genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentVariant.name}
                        onChange={handleChange}
                        placeholder="e.g., Premium Leather Jacket"
                        className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={currentVariant.description}
                        onChange={handleChange}
                        placeholder="Product description..."
                        className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                        rows={4}
                      />
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Main Category *
                        </label>
                        <select
                          name="mainCategory"
                          value={currentProduct.mainCategory}
                          onChange={handleChange}
                          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                          required
                        >
                          <option value="">Select Main Category</option>
                          {mainCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Sub Category *
                        </label>
                        <div>
                          <input
                            type="text"
                            name="subCategory"
                            value={currentProduct.subCategory}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                            placeholder="Enter sub category"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleChange}
                        min="0"
                        step="10"
                        placeholder="0.00"
                        className="w-full border border-gray-300 px-4 py-3  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Images */}

                    {/* Variants Section */}
                    <div className="pt-4">
                      <h4 className="font-semibold text-lg text-gray-800">
                        Product Variants
                      </h4>

                      {/* Current Variant Builder */}
                      <div className="bg-gray-50 p-4  -lg mb-4">
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">
                            Images
                          </label>
                          <input
                            type="file"
                            name="images"
                            onChange={handleChange}
                            multiple
                            accept="image/*"
                            className="w-full border border-gray-300 py-2 px-4  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                          />
                          {currentVariant.images.length > 0 && ( // Change from currentProduct to currentVariant
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-2">
                                Selected images ({currentVariant.images.length}
                                ):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(currentVariant.images).map(
                                  // Change here too
                                  (file, index) => (
                                    <div
                                      key={index}
                                      className="relative bg-gray-100 p-2 text-sm"
                                    >
                                      <span className="text-xs">
                                        {file.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="ml-2 text-red-500 hover:text-red-700 font-bold hover:cursor-pointer"
                                      >
                                        Ã—
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Color Selection */}
                        <div className="mb-3">
                          <label className="block mb-2 font-medium text-gray-700">
                            Color
                          </label>
                          <select
                            value={currentVariant.color}
                            onChange={(e) =>
                              setCurrentVariant({
                                ...currentVariant,
                                color: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-3 py-2  -md focus:outline-none focus:ring-2 focus:ring- gray-500"
                          >
                            <option value="">Select Color</option>
                            {colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Size and Stock Input */}
                        <div className="mb-3">
                          <label className="block mb-2 font-medium text-gray-700">
                            Sizes & Stock
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {sizes.map((size) => (
                              <div
                                key={size}
                                className="flex items-center space-x-2"
                              >
                                <span className="text-sm w-8 text-gray-600">
                                  {size}:
                                </span>
                                <input
                                  type="number"
                                  placeholder="Stock"
                                  min="0"
                                  value={
                                    currentVariant.sizes.find(
                                      (s) => s.size === size
                                    )?.stock || ""
                                  }
                                  onChange={(e) =>
                                    handleVariantSizeChange(
                                      size,
                                      e.target.value
                                    )
                                  }
                                  className="
      border border-gray-300 px-2 py-1 text-sm   
      focus:outline-none focus:ring-1 focus:ring- gray-500
      w-16 sm:w-30 md:flex-1
    "
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={addVariant}
                          className="bg-gray-600 text-white px-4 py-2 text-sm hover:bg-gray-700 transition-colors hover:cursor-pointer"
                        >
                          Add Variant
                        </button>
                      </div>

                      {/* Display Added Variants */}
                      {currentProduct.variants.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2 text-gray-700">
                            Added Variants:
                          </h5>
                          {currentProduct.variants.map((variant, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 p-3 mb-2 bg-white"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm text-gray-800">
                                    Color: {variant.color}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Sizes:{" "}
                                    {variant.sizes
                                      .map((s) => `${s.size}(${s.stock})`)
                                      .join(", ")}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Images: {variant.images.length} file(s)
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add Product Button */}
                <div className="mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={addProductToGender}
                    className="bg-green-600 text-white px-6 py-3  -md hover:bg-green-700 transition-colors font-medium hover:cursor-pointer"
                  >
                    Add Product to{" "}
                    {currentProduct.targetGender.charAt(0).toUpperCase() +
                      currentProduct.targetGender.slice(1)}{" "}
                    Category
                  </button>
                </div>
              </div>

              {/* Display Added Products by Gender */}
              {Object.entries(product.genders).map(
                ([gender, products]) =>
                  products.length > 0 && (
                    <div
                      key={gender}
                      className="bg-white p-6 text-lg shadow-md mb-6 border"
                    >
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 capitalize">
                        {gender} Products ({products.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((prod, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 p-4 bg-gray-50  -lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-800">
                                {prod.variants && prod.variants.length > 0
                                  ? prod.variants[0].name
                                  : "Unnamed Product"}
                              </h4>
                              <button
                                type="button"
                                onClick={() =>
                                  removeProductFromGender(gender, index)
                                }
                                className="text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              ${prod.price}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {prod.mainCategory} â†’ {prod.subCategory}
                            </p>
                            <p className="text-sm text-gray-600">
                              Colors:{" "}
                              {prod.variants.map((v) => v.color).join(", ")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {prod.variants.length} variant(s)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleProduct}
                  disabled={
                    product.batchName === "" ||
                    Object.values(product.genders).every(
                      (arr) => arr.length === 0
                    )
                  }
                  className="bg-gray-800 text-white px-8 py-3  -md hover:bg-gray-900 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  Save Batch
                </button>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="bg-gray-400 text-white px-8 py-3  -md hover:bg-gray-500 transition-colors font-medium hover:cursor-pointer"
                >
                  Discard All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
