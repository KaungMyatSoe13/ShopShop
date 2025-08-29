const Order = require("../models/Order");
const User = require("../models/User");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { cartItems, billingDetails, paymentMethod } = req.body;
    const userId = req.userId; // from auth middleware

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Calculate totals
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingCost = calculateShippingCost(billingDetails.city);
    const total = subtotal + shippingCost;

    // Create order
    const order = new Order({
      orderId,
      userId,
      items: cartItems.map((item) => ({
        productId: item._id,
        itemName: item.itemName,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shippingCost,
      total,
      shippingAddress: {
        email: billingDetails.email,
        phone: billingDetails.phone,
        region: billingDetails.region,
        city: billingDetails.city,
        township: billingDetails.township,
        fullAddress: billingDetails.fullAddress,
        deliveryNotes: billingDetails.orderNotes,
      },
      payment: {
        method: paymentMethod,
        status: "pending",
      },
    });

    await order.save();

    // Optional: Clear user's cart after successful order
    // await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order.orderId,
    });
  } catch (error) {
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
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
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
