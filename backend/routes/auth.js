const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");
const passwordController = require("../controllers/passwordController");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const productController = require("../controllers/ProductController");

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
router.post(
  "/upload-images",
  auth,
  upload.array("images", 5),
  productController.uploadImages
);

router.post("/products", auth, productController.addProduct);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", auth, productController.updateProduct);
router.delete("/products/:id", auth, productController.deleteProduct);

module.exports = router;
