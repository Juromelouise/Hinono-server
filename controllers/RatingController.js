const Product = require("../models/Product");
const Rating = require("../models/Ratings");

exports.createRating = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res.status(200).json({ message: "Rating not created" });
    }
    const newRating = await Rating.create({
      rating,
      comment,
      user: userId,
    });

    await Product.findByIdAndUpdate(
      productId,
      { $push: { ratings: newRating._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Rating created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const updatedRating = await Rating.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({
      message: "Rating updated successfully",
      updatedRating,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Failed to update rating" });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    await Rating.findByIdAndDelete(id);

    const product = await Product.findOneAndUpdate(
      { ratings: id },
      { $pull: { ratings: id } },
      { new: true }
    );

    res.status(200).json({ message: "Rating deleted successfully", product });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: "Failed to delete rating" });
  }
};
