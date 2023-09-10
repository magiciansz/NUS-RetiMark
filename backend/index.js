const path = require("path");
// load dependencies
const env = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");

const app = express();

//Loading Routes
const webRoutes = require("./routes/web");
const sequelize = require("./config/database");

const errorController = require("./app/controllers/ErrorController");

env.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); // Add this middleware to parse JSON data
app.use(webRoutes);
app.use(errorController.pageNotFound);
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

sequelize
  //.sync({force : true})
  .sync()
  .then(() => {
    app.listen(process.env.DOCKER_PORT);
    //pending set timezone
    console.log(
      "App listening on port " +
        process.env.DOCKER_PORT +
        " within the container"
    );
    console.log(
      "The port " +
        process.env.DOCKER_PORT +
        " is mapped to local port " +
        process.env.LOCAL_PORT
    );
  })
  .catch((err) => {
    console.log(err);
  });
