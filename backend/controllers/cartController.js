const User = require("../models/User");
const product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    // Extract the actual ObjectId from productId (remove color variant)
    const [actualProductId, color] = productId.includes("_")
      ? productId.split("_")
      : [productId, null];

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    const existingItem = user.cart.find(
      (item) =>
        item.productId &&
        item.productId.toString() === actualProductId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += parseInt(quantity) || 1;
    } else {
      user.cart.push({
        productId: actualProductId,
        quantity: parseInt(quantity) || 1,
        size,
        color, // Add this
        image: product.variants?.[0]?.images?.[0] || "", // first image
        price: product.price || "",
        subCategory: product.subCategory || "",
        name: product.name || "",
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
