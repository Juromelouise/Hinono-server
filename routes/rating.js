const route = require("express").Router();
const { createRating, updateRating, deleteRating } = require("../controllers/RatingController");
const { isAuthenticated } = require("../middleware/auth");

route.post("/create", isAuthenticated, createRating);
route.put("/update/:id", isAuthenticated, updateRating);
route.delete("/delete/:id", isAuthenticated, deleteRating);

module.exports = route;