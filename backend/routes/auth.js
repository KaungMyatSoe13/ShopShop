const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");
const passwordController = require("../controllers/passwordController");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Core authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// User management routes (protected)
router.get("/me", auth, userController.getMe);
router.put("/profile", auth, userController.updateProfile);
router.put("/change-password", auth, userController.changePassword);
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

module.exports = router;
