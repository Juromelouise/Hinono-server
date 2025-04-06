const routes = require("express").Router();
const {
  getMonthlySalesData,
  getTopSellingProducts,
} = require("../controllers/ChartController");

routes.get("/monthly-sales", getMonthlySalesData);
routes.get("/top-selling-products", getTopSellingProducts);

module.exports = routes;
