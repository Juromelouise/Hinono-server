const route = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderQuantity,
  deleteOrder,
  getAllPendingOrders,
  updateOrderStatus,
} = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/auth");

route.post("/create-order", isAuthenticated, createOrder);
route.get("/single/order/:id", isAuthenticated, getOrderById);
route.get("/user", isAuthenticated, getOrdersByUser);
route.put("/update/quantity", isAuthenticated, updateOrderQuantity);
route.delete("/delete/:id", isAuthenticated, deleteOrder);
route.get("/all/orders", isAuthenticated, getAllPendingOrders);
route.put("/update/status/:id", isAuthenticated, updateOrderStatus);

module.exports = route;
