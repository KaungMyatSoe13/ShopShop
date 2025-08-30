const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");
const passwordController = require("../controllers/passwordController");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const productController = require("../controllers/ProductController");
const adminController = require("../controllers/adminController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
// Configure multer for file storage - MOVE THIS TO THE TOP
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Core authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// User management routes (protected)
router.get("/me", auth, userController.getMe);
//Address
router.post("/save-address", auth, userController.saveUserAddress);
router.put("/addresses/:addressId", auth, userController.updateUserAddress);
router.get("/addresses", auth, userController.getAddresses);
router.put("/profile", auth, userController.updateProfile);
router.put(
  "/change-password",
  auth,
  userController.changePasswordWithCurrentPassword
);
router.delete("/account", auth, userController.deleteAccount);

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

// Google OAuth routes
router.post("/google", authController.googleAuth);

// Product routes - NOW upload is defined
// Product routes - Place this BEFORE the /products/:id route
router.post(
  "/upload-images",
  auth,
  upload.array("images", 5),
  productController.uploadImages
);

// Product routes
router.post("/products", auth, productController.addProduct);
router.get("/products/by-color", productController.getProductsByColor); // Add this line HERE
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById); // This must come AFTER /products/by-color
router.put("/products/:id", auth, productController.updateProduct);
router.delete("/products/:id", auth, productController.deleteProduct);

// Cart routes
router.post("/cart/add", auth, cartController.addToCart);
router.get("/cart", auth, cartController.getCart);
router.put("/cart/:itemId", auth, cartController.updateCartItem);
router.delete("/cart/:itemId", auth, cartController.removeFromCart);
router.delete("/cart", auth, cartController.clearCart);

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

// Order routes
router.post("/orders", auth, orderController.createOrder);
router.get("/orders", auth, orderController.getUserOrders);
router.get("/orders/:id", auth, orderController.getOrderById);

// Add this route for guest orders (no auth middleware)
router.post("/guest-orders", orderController.createOrder);
router.get("/guest-orders/:id", orderController.getOrderById);

module.exports = router;
