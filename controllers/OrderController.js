const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};