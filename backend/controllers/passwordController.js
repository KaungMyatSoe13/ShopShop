const PasswordReset = require("../models/PasswordReset");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { changePassword } = require("./userController");
require("dotenv").config();

// Email transporter for password reset emails
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.AUTH_PASS,
  },
});

// Forgot password - send reset email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = uuidv4() + user._id;
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Save reset token to database
    const passwordReset = new PasswordReset({
      userId: user._id.toString(),
      resetToken: hashedResetToken,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    await passwordReset.save();

    // Send reset email
    const baseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/reset-password/${user._id}/${resetToken}`;

    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your ShopShop account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { userId, resetToken, newPassword } = req.body;
  try {
    // Find the reset record
    const resetRecord = await PasswordReset.findOne({
      userId: userId.toString(),
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Check if token is expired
    if (resetRecord.expiresAt < Date.now()) {
      await PasswordReset.deleteOne({ userId: userId.toString() });
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Verify reset token
    const isValidToken = await bcrypt.compare(
      resetToken,
      resetRecord.resetToken
    );
    if (!isValidToken) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    // Delete the reset record
    await PasswordReset.deleteOne({ userId: userId.toString() });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset message
    setPasswordMessage("");

    // Frontend validation
    if (!newPassword || !confirmPassword) {
      setPasswordMessage(
        "Please fill in the new password and confirm password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordMessage("You must be logged in to change password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success
        setPasswordMessage("Password changed successfully ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Backend validation errors (wrong current password, weak password, etc.)
        setPasswordMessage(data.message || "Failed to change password.");
      }
    } catch (err) {
      setPasswordMessage("Something went wrong. Please try again.");
      console.error("Password change error:", err);
    }
  };
};
