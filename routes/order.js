const route = require("express").Router();
const { createOrder } = require("../controllers/OrderController");
const { isAuthenticated } = require("../middleware/auth");

route.post("/create-order", isAuthenticated, createOrder);

module.exports = route;
