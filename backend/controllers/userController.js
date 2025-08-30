const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Current User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add this method to your userController.js

// Save user address
// exports.saveUserAddress = async (req, res) => {
//   try {
//     const {
//       name,
//       region,
//       city,
//       township,
//       fullAddress,
//       phone,
//       label = "Default",
//       isDefault = false,
//     } = req.body;

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update recent contact info
//     if (name) user.name = name;
//     if (phone) user.phone = phone;

//     // If setting as default, remove default from other addresses
//     const defaultAddressIndex = user.savedAddresses.findIndex(
//       (addr) => addr.isDefault
//     );

//     if (isDefault) {
//       user.savedAddresses.forEach((addr) => {
//         addr.isDefault = false;
//       });
//     }

//     // Check if address already exists
//     const existingAddressIndex = user.savedAddresses.findIndex(
//       (addr) =>
//         addr.region === region &&
//         addr.city === city &&
//         addr.township === township &&
//         addr.fullAddress === fullAddress
//     );

//     if (existingAddressIndex !== -1) {
//       // Update existing address
//       user.savedAddresses[existingAddressIndex].isDefault = isDefault;
//       user.savedAddresses[existingAddressIndex].label = label;
//     } else {
//       // Add new address
//       // If this is the first address, make it default regardless
//       const shouldBeDefault = user.savedAddresses.length === 0 || isDefault;

//       user.savedAddresses.push({
//         label,
//         region,
//         city,
//         township,
//         fullAddress,
//         isDefault: shouldBeDefault,
//       });
//     }

//     await user.save();

//     res.json({ message: "Address saved successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.saveUserAddress = async (req, res) => {
  try {
    const {
      name,
      email, // Changed from region
      phone, // Changed from city
      township,
      fullAddress,
      label = "Default",
      isDefault = false,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the default address to update
    const defaultAddressIndex = user.savedAddresses.findIndex(
      (addr) => addr.isDefault
    );

    if (defaultAddressIndex !== -1) {
      // Update existing default address
      user.savedAddresses[defaultAddressIndex] = {
        ...user.savedAddresses[defaultAddressIndex],
        name,
        email, // Save address-specific email
        phone, // Save address-specific phone
        label,
        township,
        fullAddress,
        isDefault: true,
      };
    } else {
      // No default address exists, create one
      user.savedAddresses.push({
        name,
        email,
        phone,
        label,
        township,
        fullAddress,
        isDefault: true,
      });
    }

    await user.save();

    res.json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, displayName, phone } = req.body; // include displayName
    const updateData = {};

    if (name) updateData.name = name;
    if (displayName) updateData.displayName = displayName; // add this
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/change-password
exports.changePasswordWithCurrentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).json({ message: "New password is required" });
    }

    // basic policy: min 8 chars, at least 1 letter + 1 number
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword);
    if (!pwOk) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain at least one letter and one number",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user already has a password, verify currentPassword
    if (user.password && user.password.length > 0) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // prevent reusing the same password
      const sameAsOld = await bcrypt.compare(newPassword, user.password);
      if (sameAsOld) {
        return res.status(400).json({
          message: "New password must be different from current password",
        });
      }
    }
    // If user has NO password (e.g., Google-only account), allow setting one without currentPassword.

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Get user with password
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Delete user
    await User.findByIdAndDelete(req.userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/userController.js
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("savedAddresses name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      addresses: user.savedAddresses,
      userName: user.name, // Return user's main name separately
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { region, city, township, fullAddress, label } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.savedAddresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update the specific address
    user.savedAddresses[addressIndex] = {
      ...user.savedAddresses[addressIndex],
      region,
      city,
      township,
      fullAddress,
      label: label || user.savedAddresses[addressIndex].label,
    };

    await user.save();

    res.json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
