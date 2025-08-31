const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { cartItems, billingDetails, paymentMethod, isGuest } = req.body;

    // Handle userId - it will be undefined for guest requests
    const userId = req.userId || null;

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!billingDetails || !billingDetails.email) {
      return res.status(400).json({ message: "Billing details are required" });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Calculate totals
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    const shippingCost = calculateShippingCost(billingDetails.city);
    const total = subtotal + shippingCost;

    // Check stock availability and reduce stock
    for (const item of cartItems) {
      const product = await Product.findById(item.productId || item._id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.itemName}`,
        });
      }

      // Find the variant and size
      let foundVariant = null;
      let foundSizeIndex = -1;

      for (const variant of product.variants) {
        const sizeIndex = variant.sizes.findIndex((s) => s.size === item.size);
        if (sizeIndex !== -1 && variant.color === item.color) {
          foundVariant = variant;
          foundSizeIndex = sizeIndex;
          break;
        }
      }

      if (!foundVariant || foundSizeIndex === -1) {
        return res.status(400).json({
          message: `Size ${item.size} in ${item.color} not available for ${item.itemName}`,
        });
      }

      // Check if sufficient stock
      const currentStock = foundVariant.sizes[foundSizeIndex].stock;
      if (currentStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.itemName}. Only ${currentStock} available, but ${item.quantity} requested.`,
        });
      }

      // Reduce stock
      foundVariant.sizes[foundSizeIndex].stock -= item.quantity;

      // Save the product with updated stock
      await product.save();
    }
    // END OF STOCK REDUCTION CODE

    // Create order
    const order = new Order({
      orderId,
      userId, // Will be null for guest users
      isGuestOrder: !userId, // This should be true when userId is null
      guestEmail: !userId ? billingDetails.email : undefined,

      // In createOrder function, update the items mapping
      items: cartItems.map((item) => ({
        name: item.name || "Unknown",
        productId: item.productId || item._id, // Use the actual product ID
        itemName: item.itemName || "Unknown Item",
        size: item.size || "",
        color: item.color || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || "",
      })),
      subtotal,
      shippingCost,
      total,
      shippingAddress: {
        name: billingDetails.name,
        email: billingDetails.email,
        phone: billingDetails.phone,
        region: billingDetails.region,
        city: billingDetails.city,
        township: billingDetails.township,
        fullAddress: billingDetails.fullAddress,
        deliveryNotes: billingDetails.orderNotes || "",
      },
      payment: {
        method: paymentMethod,
        status: "pending",
      },
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Order creation error:", error); // Add this for debugging
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Will be undefined for guest requests

    let order;

    // Try to find by orderId first (string format like "ORD-...")
    if (id.startsWith("ORD-")) {
      if (userId) {
        // For authenticated users
        order = await Order.findOne({ orderId: id, userId: userId });
      } else {
        // For guest users
        order = await Order.findOne({ orderId: id, userId: null });
      }
    } else {
      // Try to find by MongoDB _id
      if (userId) {
        order = await Order.findOne({ _id: id, userId: userId });
      } else {
        order = await Order.findOne({ _id: id, userId: null });
      }
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate shipping
const calculateShippingCost = (city) => {
  const shippingRates = {
    yangon: 3000,
    mandalay: 5000,
    naypyitaw: 6000,
  };

  return shippingRates[city.toLowerCase()] || 7000; // default for others
};
