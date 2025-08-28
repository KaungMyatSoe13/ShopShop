const Product = require("../models/Product");

// @desc   Upload images
// @route  POST /api/upload-images
// @access Admin
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Create full HTTP URLs instead of just paths
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const imageUrls = req.files.map(
      (file) => `${baseUrl}/uploads/${file.filename}`
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc   Add a new product
// @route  POST /api/products
// @access Admin
// @desc   Add a new product
// @route  POST /api/products
// @access Admin
exports.addProduct = async (req, res) => {
  try {
    const { batchName, genders } = req.body;
    const createdProducts = [];

    // Process each gender category
    for (const [gender, products] of Object.entries(genders)) {
      if (products && products.length > 0) {
        for (const productItem of products) {
          // Create a separate product document for each item
          const productData = {
            batchName,
            mainCategory: productItem.mainCategory,
            subCategory: productItem.subCategory,
            gender: gender,
            itemName: productItem.variants[0]?.name || "Unnamed Product", // Get name from first variant
            description: productItem.variants[0]?.description || "",
            price: productItem.price,
            variants: productItem.variants.map((variant) => ({
              color: variant.color,
              images: variant.images,
              sizes: variant.sizes,
            })),
          };

          const product = new Product(productData);
          const savedProduct = await product.save();
          createdProducts.push(savedProduct);
        }
      }
    }

    res.status(201).json({
      message: "Products created successfully",
      products: createdProducts,
      count: createdProducts.length,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// @desc   Get all products
// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all products flattened by color variants
// @route  GET /api/products/by-color
// @access Public
// @desc   Get all products flattened by color variants
// @route  GET /api/products/by-color
// @access Public
exports.getProductsByColor = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const flattenedProducts = [];

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        flattenedProducts.push({
          _id: `${product._id}_${variant.color}`,
          originalId: product._id,
          batchName: product.batchName,
          name: product.itemName,
          itemName: product.itemName,
          description: product.description,
          mainCategory: product.mainCategory,
          subCategory: product.subCategory,
          price: product.price,
          gender: product.gender,
          color: variant.color,
          images: variant.images,
          sizes: variant.sizes,
          createdAt: product.createdAt,
        });
      });
    });

    res.json(flattenedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error fetching products by color:", err);
  }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
// @access Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update product
// @route  PUT /api/products/:id
// @access Admin
exports.updateProduct = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
