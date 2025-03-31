const Product = require("../models/Product");
const { uploadMultiple } = require("../utils/Cloudinary");
const { pushNotification } = require("../utils/Notification");
const User = require("../models/User");

exports.createProduct = async (req, res) => {
  try {
    const images = await uploadMultiple(req.files, "products");
    req.body.images = images;
    const product = await Product.create(req.body);
    const products = await Product.find();
    return res.status(201).json({ data: product, success: true, products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products);
    return res.status(200).json({ data: products, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files) {
      await Product.findByIdAndUpdate(id, req.body);
      const products = await Product.find();
      return res.status(200).json({ success: true, products });
    } else {
      const images = await uploadMultiple(req.files, "products");
      req.body.images = images;
      await Product.findByIdAndUpdate(id, req.body);
      const products = await Product.find();
      return res.status(200).json({ success: true, products });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.promoteProduct = async (req, res) => {
  try {
    const { productId, description, title } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const users = await User.find({ pushToken: { $ne: null } });
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users with push tokens found" });
    }

    const notificationData = {
      title: title,
      message: description,
      extraData: { product: product },
    };

    for (const user of users) {
      await pushNotification(notificationData, user.pushToken);
    }

    res.status(200).json({
      message: "Product promoted successfully and notifications sent",
    });
  } catch (error) {
    console.error("Error promoting product:", error);
    res.status(500).json({ message: "Error promoting product" });
  }
};
