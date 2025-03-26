const mongoose = require("mongoose");
const Populate = require("mongoose-autopopulate");

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  },
});

ratingSchema.plugin(Populate);

module.exports = mongoose.model("Rating", ratingSchema);
