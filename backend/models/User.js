const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String },
  phone: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  googleId: { type: String },
  authMethod: {
    type: String,
    enum: ["manual", "google", "both"],
    default: "manual",
  },
  type: { type: String, enum: ["user", "admin"], default: "user" },

  savedAddresses: [
    {
      name: String,
      email: { type: String, required: true },
      phone: { type: String, required: true },
      label: { type: String, default: "Default" },
      township: String,
      fullAddress: String,
      isDefault: { type: Boolean, default: false },
    },
  ],

  // Add favorites array
  favorites: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      // Store additional info for quick access without populating
      productName: String,
      productPrice: Number,
      productImage: String,
      selectedColor: String,
      selectedSize: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  isGuest: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: function () {
      return !this.isGuest;
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
