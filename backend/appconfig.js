const path = require("path");
// load dependencies
const env = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const cors = require("cors");
const app = express();

//Loading Routes
const webRoutes = require("./routes/web");

env.config();
const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); // Add this middleware to parse JSON data
app.use(webRoutes);
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || `error`;
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stack: error.stack.split("\n"),
  });
};
app.use(errorHandler);

module.exports = app;
