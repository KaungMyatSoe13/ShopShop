const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc   Upload images to Cloudinary
// @route  POST /api/upload-images
// @access Admin
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = [];
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce-portfolio", // Organized folder in Cloudinary
        transformation: [
          {
            width: 800,
            height: 800,
            crop: "limit",
            quality: "auto",
            format: "auto",
          },
        ],
      })
    );

    const results = await Promise.all(uploadPromises);

    // Extract secure URLs from Cloudinary response
    results.forEach((result) => {
      imageUrls.push(result.secure_url);
    });

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls, // These are now Cloudinary URLs
    });
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ message: err.message });
  }
};

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
            itemName: productItem.variants[0]?.name || "Unnamed Product",
            description: productItem.variants[0]?.description || "",
            price: productItem.price,
            variants: productItem.variants.map((variant) => ({
              color: variant.color,
              images: variant.images, // These are now Cloudinary URLs from frontend
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
          images: variant.images, // Cloudinary URLs
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

    // If there are new images, upload them to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ecommerce-portfolio",
          transformation: [
            {
              width: 800,
              height: 800,
              crop: "limit",
              quality: "auto",
              format: "auto",
            },
          ],
        })
      );

      const results = await Promise.all(uploadPromises);
      updateData.images = results.map((result) => result.secure_url);
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

    // Optional: Delete images from Cloudinary
    // You'd need to store cloudinary public_ids to do this efficiently
    // For now, just delete from database

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
