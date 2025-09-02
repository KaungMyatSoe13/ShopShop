const Product = require("../models/Product");
const User = require("../models/User");

// Check admin access middleware
const checkAdminAccess = async (req, res, next) => {
  try {
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }
    req.adminUser = adminUser;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products for admin
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query = {
        $or: [
          { itemName: { $regex: search, $options: "i" } },
          { batchName: { $regex: search, $options: "i" } },
          { mainCategory: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Calculate total stock for each product
    const productsWithStock = products.map((product) => {
      const totalStock = product.variants.reduce((total, variant) => {
        return (
          total +
          variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0)
        );
      }, 0);

      return {
        ...product.toObject(),
        totalStock,
        totalVariants: product.variants.length,
      };
    });

    res.json({
      products: productsWithStock,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single product details for admin
const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate stock info
    const totalStock = product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0)
      );
    }, 0);

    const productWithStats = {
      ...product.toObject(),
      totalStock,
      totalVariants: product.variants.length,
      stockByVariant: product.variants.map((variant) => ({
        color: variant.color,
        totalStock: variant.sizes.reduce(
          (total, size) => total + size.stock,
          0
        ),
        sizes: variant.sizes,
      })),
    };

    res.json(productWithStats);
  } catch (error) {
    console.error("Get product details error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update stock for specific variant and size
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantIndex, sizeIndex, newStock } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.variants[variantIndex] &&
      product.variants[variantIndex].sizes[sizeIndex]
    ) {
      product.variants[variantIndex].sizes[sizeIndex].stock =
        parseInt(newStock);
      await product.save();
      res.json({ message: "Stock updated successfully", product });
    } else {
      res.status(400).json({ message: "Invalid variant or size index" });
    }
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Product.distinct("mainCategory");

    // Calculate total stock across all products
    const products = await Product.find({});
    const totalStock = products.reduce((total, product) => {
      return (
        total +
        product.variants.reduce((variantTotal, variant) => {
          return (
            variantTotal +
            variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0)
          );
        }, 0)
      );
    }, 0);

    // Count low stock products (less than 10 total stock)
    const lowStockProducts = products.filter((product) => {
      const productStock = product.variants.reduce((total, variant) => {
        return (
          total +
          variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0)
        );
      }, 0);
      return productStock < 10;
    }).length;

    // Count out of stock products
    const outOfStockProducts = products.filter((product) => {
      const productStock = product.variants.reduce((total, variant) => {
        return (
          total +
          variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0)
        );
      }, 0);
      return productStock === 0;
    }).length;

    res.json({
      totalProducts,
      totalCategories: totalCategories.length,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      categories: totalCategories,
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkAdminAccess,
  getAllProducts,
  getProductDetails,
  updateProduct,
  updateStock,
  deleteProduct,
  getProductStats,
};
