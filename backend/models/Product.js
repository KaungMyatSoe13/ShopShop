const mongoose = require("mongoose");

// Sizes inside a variant
const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

// Variants (color + images + sizes)
const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    images: [{ type: String, required: true }], // URLs or file refs
    sizes: [sizeSchema],
  },
  { _id: false }
);

// Product Item
const productSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true },
    // Categories are flexible but validated
    mainCategory: {
      type: String,
      enum: ["T-shirt", "Sweater", "Shoe", "Accessory"],
      required: true,
    },
    subCategory: { type: String }, // optional
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
    },
    itemName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    variants: [variantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
