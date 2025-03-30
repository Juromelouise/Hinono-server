const route = require("express").Router();
const {
  loginUser,
  registerUser,
  mobile,
  profile,
  addAddress,
  getAddresses,
  updatePushToken,
} = require("../controllers/UserController");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../utils/multer");

route.post("/login", loginUser);
route.post("/register", upload.single("avatar"), registerUser);
route.post("/google/login", upload.single("avatar"), mobile);
route.get("/profile", isAuthenticated, profile);
route.post("/add-address", isAuthenticated, addAddress);
route.get("/addresses", isAuthenticated, getAddresses);
route.put("/update-push-token", isAuthenticated, updatePushToken)

module.exports = route;
