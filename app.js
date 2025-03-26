const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const user = require("./routes/user");
const product = require("./routes/product")

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/user", user);
app.use("/product", product);

module.exports = app;
