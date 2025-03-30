const Order = require("../models/Order");
const { Expo } = require("expo-server-sdk");

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

    const productNames = order.items
      .map((item) => item.product.name)
      .join(", ");
    const message = `Order placed successfully! Total: $${totalPrice.toFixed(
      2
    )}. Products: ${productNames}`;

    const expo = new Expo();
    const pushToken = req.user.pushToken;

    if (Expo.isExpoPushToken(pushToken)) {
      const messages = [
        {
          to: pushToken,
          sound: "default",
          body: message,
          data: { orderId: order._id },
        },
      ];

      await expo.sendPushNotificationsAsync(messages);
    } else {
      console.error("Invalid Expo push token:", pushToken);
    }

    res.status(200).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.updateOrderQuantity = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { orderId, productId, quantity } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    if (quantity === 0) {
      order.items.splice(itemIndex, 1);
    } else {
      order.items[itemIndex].quantity = quantity;
    }

    if (order.items.length === 0) {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ message: "Order deleted as it has no items left" });
    }

    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order quantity:", error);
    res.status(500).json({ message: "Error updating order quantity" });
  }
};