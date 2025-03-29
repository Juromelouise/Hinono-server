const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { items, location, totalPrice } = req.body;

    const order = await Order.create({
      items,
      user: req.user.id,
      location,
      totalPrice,
      status: "Pending",
    });

    res.status(200).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};
