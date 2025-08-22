const mongoose = require("mongoose");

// Define the product item schema (to avoid repetition)
const productItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    mainCategory: String,
    subCategory: String,
    images: [String],
    variants: [
      {
        color: {
          type: String,
          required: true,
        },
        sizes: [
          {
            size: {
              type: String,
              required: true,
            },
            stock: {
              type: Number,
              required: true,
              default: 0,
            },
          },
        ],
      },
    ],
    price: Number,
  },
  { _id: true }
); // Each product gets its own _id

const productSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    genders: {
      male: [productItemSchema],
      female: [productItemSchema],
      unisex: [productItemSchema], // You might want this too
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
