const User = require("../models/User");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body; //productID is actually variantID with color

    // Extract the actual variant ID and color from productId
    const [variantId, color] = productId.includes("_")
      ? productId.split("_")
      : [productId, null];

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Find the product and variant by searching through all products
    let foundProduct = null;
    let foundItem = null;
    let foundVariant = null;

    const products = await Product.find();

    for (const product of products) {
      let found = false;
      for (const genderKey of ["male", "female", "unisex"]) {
        const items = product.genders[genderKey];
        for (const item of items) {
          for (const variant of item.variants) {
            if (variant._id.toString() === variantId) {
              foundProduct = product;
              foundItem = item;
              foundVariant = variant;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) break;
    }

    if (!foundVariant || !foundItem) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    const existingItem = user.cart.find(
      (item) =>
        item.variantId &&
        item.variantId.toString() === variantId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += parseInt(quantity) || 1;
    } else {
      user.cart.push({
        productId: foundItem._id, // Store the productItem ID
        variantId: variantId, // Store the variant ID
        quantity: parseInt(quantity) || 1,
        size,
        color: foundVariant.color,
        image: foundVariant.images?.[0] || "", // Image from variant
        price: foundItem.price || 0, // Price from productItem
        subCategory: foundItem.subCategory || "", // subCategory from productItem
        name: foundItem.name || "", // Name from productItem
      });
    }

    await user.save();
    res.json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure cart exists
    if (!user.cart) {
      user.cart = [];
    }

    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cart.id(req.params.itemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    cartItem.quantity = parseInt(quantity) || 1;
    await user.save();

    res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart.pull(req.params.itemId);
    await user.save();

    res.json({ message: "Item removed", cart: user.cart });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];
    await user.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: err.message });
  }
};
