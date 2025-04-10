const route = require("express").Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  promoteProduct,
} = require("../controllers/ProductController");
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
route.put(
  "/:id",
  isAuthenticated,
  Admin,
  upload.array("images"),
  updateProduct
);
route.delete("/:id", isAuthenticated, Admin, deleteProduct);
route.post("/promotions", isAuthenticated, Admin, promoteProduct);

module.exports = route;
