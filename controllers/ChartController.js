const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getMonthlySalesData = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: "$_id",
          totalSales: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching monthly sales data:", error);
    res.status(500).json({ message: "Error fetching monthly sales data" });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "items.product",
          as: "orderItems",
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $unwind: "$orderItems.items",
      },
      {
        $match: { "orderItems.items.product": { $exists: true } },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalSold: { $sum: "$orderItems.items.quantity" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          totalSold: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ message: "Error fetching top-selling products" });
  }
};
