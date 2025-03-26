const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};