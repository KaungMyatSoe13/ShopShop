const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String },
  phone: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  googleId: { type: String }, // Add this field
  authMethod: {
    type: String,
    enum: ["manual", "google", "both"],
    default: "manual",
  }, // Track auth method
  type: { type: String, enum: ["user", "admin"], default: "user" },
  // In User.js
  // In User.js schema, update the cart array:
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variantId: { type: String }, // Add this line
      quantity: { type: Number, default: 0 },
      size: { type: String },
      color: { type: String },
      image: { type: String },
      price: { type: Number },
      subCategory: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
