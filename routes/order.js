const route = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
} = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/auth");

route.post("/create-order", isAuthenticated, createOrder);
route.get("/single/order/:id", isAuthenticated, getOrderById);
route.get("/user", isAuthenticated, getOrdersByUser);

module.exports = route;
