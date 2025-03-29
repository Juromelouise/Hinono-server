const mongoose = require("mongoose");
const Populate = require("mongoose-autopopulate");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        autopopulate: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipping", "Delivered", "Cancelled"],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.plugin(Populate);

module.exports = mongoose.model("Order", orderSchema);
