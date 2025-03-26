const route = require("express").Router();
const { createProduct, getProducts } = require("../controllers/ProductController");
const upload = require("../utils/multer");
const { isAuthenticated, Admin } = require("../middleware/auth");

route.post(
  "/create",
  upload.array("images"),
  isAuthenticated,
  Admin,
  createProduct
);
route.get("/", getProducts);
module.exports = route;
