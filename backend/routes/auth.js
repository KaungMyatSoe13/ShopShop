const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/register", authController.register);
router.post("/login", authController.login);
// Email verification routes (mounted under /api/auth)
router.get("/user/verify/:userId/:uniqueString", authController.verifyEmail);
router.get("/user/verified", authController.verifiedPage);
router.post(
  "/user/resend-verification",
  authController.resendVerificationEmail
);

module.exports = router;
