const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique combination of user, product, variant, and size
cartItemSchema.index(
  { userId: 1, productId: 1, variantId: 1, size: 1 },
  { unique: true }
);

module.exports = mongoose.model("Cart", cartItemSchema);
