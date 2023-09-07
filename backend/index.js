const path = require("path");
// load dependencies
const env = require("dotenv");
const csrf = require("csurf");
const express = require("express");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressHbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store); // initalize sequelize with session store

const app = express();
const csrfProtection = csrf();
const router = express.Router();

//Loading Routes
const webRoutes = require("./routes/web");
const sequelize = require("./config/database");

const errorController = require("./app/controllers/ErrorController");

env.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// required for csurf
// app.use(
//   session({
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
//     store: new SequelizeStore({
//       db: sequelize,
//       table: "sessions",
//     }),
//   })
// );

// app.use(csrfProtection);
// app.use(flash());

// app.use((req, res, next) => {
// 	res.locals.isAuthenticated = req.session.isLoggedIn;
// 	res.locals.csrfToken = req.csrfToken();
// 	next();
// });

// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "web_layout",
//     extname: "hbs",
//   })
// );
// app.set("view engine", "hbs");
// app.set("views", "views");

app.use(express.json()); // Add this middleware to parse JSON data
app.use(webRoutes);
app.use(errorController.pageNotFound);

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || `error`;
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};

app.use(errorHandler);

sequelize
  //.sync({force : true})
  .sync()
  .then(() => {
    app.listen(process.env.DOCKER_PORT);
    //pending set timezone
    console.log("App listening on port " + process.env.DOCKER_PORT + " within the container");
    console.log("The port " + process.env.DOCKER_PORT + " is mapped to local port " + process.env.LOCAL_PORT)
  })
  .catch((err) => {
    console.log(err);
  });
