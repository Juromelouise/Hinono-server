const Product = require("../models/Product");
const { uploadMultiple } = require("../utils/Cloudinary");

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
