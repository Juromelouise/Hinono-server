const route = require("express").Router();
const {
  loginUser,
  registerUser,
  mobile,
} = require("../controllers/UserController");
const upload = require("../utils/multer");

route.post("/login", loginUser);
route.post("/register",upload.single("avatar"), registerUser);
route.post("/google/login",upload.single("avatar"), mobile);

module.exports = route;
