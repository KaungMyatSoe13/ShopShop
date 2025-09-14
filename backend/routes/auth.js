const express = require("express");
const router = express.Router();
const multer = require("multer");

// Controllers
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");
const passwordController = require("../controllers/passwordController");
const userController = require("../controllers/userController");
const productController = require("../controllers/ProductController");
const adminController = require("../controllers/adminController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const adminOrderController = require("../controllers/adminOrderController");
const adminUserController = require("../controllers/adminUserController");
const adminProductController = require("../controllers/adminProductController");

// Middleware
const auth = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// Core authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Google OAuth routes
router.post("/google", authController.googleAuth);

// Email verification routes
router.get("/user/verify/:userId/:uniqueString", emailController.verifyEmail);
router.get("/user/verified", emailController.verifiedPage);
router.post(
  "/user/resend-verification",
  emailController.resendVerificationEmail
);

// Password reset routes
router.post("/forgot-password", passwordController.forgotPassword);
router.post("/reset-password", passwordController.resetPassword);

// =====================================================
// USER MANAGEMENT ROUTES (Protected)
// =====================================================

// User profile routes
router.get("/me", auth, userController.getMe);
router.put("/profile", auth, userController.updateProfile);
router.put(
  "/change-password",
  auth,
  userController.changePasswordWithCurrentPassword
);
router.delete("/account", auth, userController.deleteAccount);

// Address management
router.post("/save-address", auth, userController.saveUserAddress);
router.put("/addresses/:addressId", auth, userController.updateUserAddress);
router.get("/addresses", auth, userController.getAddresses);

// =====================================================
// PRODUCT ROUTES
// =====================================================

// File upload routes
router.post(
  "/upload-images",
  auth,
  upload.array("images", 5),
  productController.uploadImages
);

// Product management
router.post("/products", auth, productController.addProduct);
router.get("/products/by-color", productController.getProductsByColor);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", auth, productController.updateProduct);
router.delete("/products/:id", auth, productController.deleteProduct);

// =====================================================
// CART ROUTES (Protected)
// =====================================================

router.post("/cart/add", auth, cartController.addToCart);
router.get("/cart", auth, cartController.getCart);
router.put("/cart/:itemId", auth, cartController.updateCartItem);
router.delete("/cart/:itemId", auth, cartController.removeFromCart);
router.delete("/cart", auth, cartController.clearCart);

// =====================================================
// FAVORITES ROUTES (Protected)
// =====================================================

router.get("/favorites", auth, userController.getFavorites);
router.post("/favorites/toggle", auth, userController.toggleFavorite);
router.post("/favorites", auth, userController.addToFavorites);
router.delete(
  "/favorites/:productId",
  auth,
  userController.removeFromFavorites
);
router.get("/favorites/check/:productId", auth, userController.checkFavorite);

// =====================================================
// ORDER ROUTES
// =====================================================

// Protected order routes
router.post("/orders", auth, orderController.createOrder);
router.get("/orders", auth, orderController.getUserOrders);
router.get("/orders/:id", auth, orderController.getOrderById);

// Guest order routes (no auth required)
router.post("/guest-orders", orderController.createOrder);
router.get("/guest-orders/:id", orderController.getOrderById);

// =====================================================
// ADMIN ROUTES (Protected + Admin Access)
// =====================================================

// Admin profile routes
router.get("/me", auth, adminController.getMe, (req, res, next) => {
  console.log("Admin route accessed");
  next();
});
router.get("/admin/me", auth, adminController.getMe, (req, res, next) => {
  console.log("Admin route accessed");
  next();
});
router.get("/admin/details", auth, adminController.getMe, (req, res, next) => {
  console.log("Admin route accessed");
  next();
});

// Admin order management
router.get(
  "/admin/orders",
  auth,
  adminOrderController.checkAdminAccess,
  adminOrderController.getAllOrders
);
router.get(
  "/admin/orders/stats",
  auth,
  adminOrderController.checkAdminAccess,
  adminOrderController.getOrderStats
);
router.get(
  "/admin/orders/search",
  auth,
  adminOrderController.checkAdminAccess,
  adminOrderController.searchOrders
);
router.get(
  "/admin/orders/:id",
  auth,
  adminOrderController.checkAdminAccess,
  adminOrderController.getOrderDetails
);
router.put(
  "/admin/orders/:id/status",
  auth,
  adminOrderController.checkAdminAccess,
  adminOrderController.updateOrderStatus
);

// Admin customer management
router.get(
  "/admin/customers",
  auth,
  adminOrderController.checkAdminAccess,
  adminUserController.getAllUsers
);
router.get(
  "/admin/customers/:userId",
  auth,
  adminUserController.getCustomerDetails
);
router.get(
  "/admin/customers/:userId/orders",
  auth,
  adminUserController.getCustomerOrders
);
router.delete(
  "/admin/customers/:userId",
  auth,
  adminUserController.deleteCustomer
);

// Admin product management
router.get(
  "/admin/products",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.getAllProducts
);
router.get(
  "/admin/products/stats",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.getProductStats
);
router.get(
  "/admin/products/:productId",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.getProductDetails
);
router.put(
  "/admin/products/:productId",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.updateProduct
);
router.put(
  "/admin/products/:productId/stock",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.updateStock
);
router.delete(
  "/admin/products/:productId",
  auth,
  adminProductController.checkAdminAccess,
  adminProductController.deleteProduct
);

// Use the Cloudinary upload middleware
router.post(
  "/upload-images",
  auth,
  upload.array("images", 10),
  productController.uploadImages
);
router.post("/products", auth, productController.addProduct);
router.get("/products", productController.getProducts);

module.exports = router;
