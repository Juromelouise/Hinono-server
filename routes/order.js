const route = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderQuantity,
} = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/auth");

route.post("/create-order", isAuthenticated, createOrder);
route.get("/single/order/:id", isAuthenticated, getOrderById);
route.get("/user", isAuthenticated, getOrdersByUser);
route.put("/update-quantity", isAuthenticated, updateOrderQuantity);

module.exports = route;
