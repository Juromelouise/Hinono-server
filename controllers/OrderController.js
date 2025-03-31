const Order = require("../models/Order");
const Product = require("../models/Product");
const { pushNotification } = require("../utils/Notification");

const updateProductStock = async (items) => {
  try {
    const bulkOperations = items.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOperations);
    console.log("Product stock updated successfully.");
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw new Error("Failed to update product stock.");
  }
};

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

    const pushToken = req.user.pushToken;
    const data = {
      title: "Order Confirmation",
      message: message,
      extraData: { orderId: order._id },
    };
    await pushNotification(data, pushToken);

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
    const { orderId, productId, quantity } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.product._id.toString() === productId
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
      const order = await Order.findByIdAndDelete(orderId);
      return res
        .status(200)
        .json({ message: "Order deleted as it has no items left", order });
    }

    order.totalPrice = order.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    await order.save();

    const message = `Order updated successfully! Total: $${order.totalPrice.toFixed(
      2
    )}`;

    const pushToken = req.user.pushToken;
    const data = {
      title: "Order Update",
      message: message,
      extraData: order,
    };

    await pushNotification(data, pushToken);

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order quantity:", error);
    res.status(500).json({ message: "Error updating order quantity" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const data = {
      title: "Order Cancellation",
      message: "Your order has been cancelled successfully.",
      extraData: order,
    };

    await pushNotification(data, req.user.pushToken);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

exports.getAllPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Pending" });

    if (!orders) {
      return res.status(404).json({ message: "No pending orders found" });
    }

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ message: "Error fetching pending orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Shipping") {
      await updateProductStock(order.items);
    }

    await pushNotification(
      {
        title: "Order Status Update",
        message: `Your order status has been ${req.body.status}`,
        extraData: { orderId: order._id },
      },
      order.user.pushToken
    );
    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
