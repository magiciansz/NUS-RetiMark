const express = require("express");
const router = express.Router();
const patientRoute = require("./patient.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const ApiError = require("../app/middlewares/ApiError");
const httpStatus = require("http-status");

const defaultRoutes = [
  {
    path: "/api/v1/patient",
    route: patientRoute,
  },
  {
    path: "/api/v1/auth",
    route: authRoute,
  },
  {
    path: "/api/v1/user",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.all("*", () => {
  throw new ApiError(httpStatus.NOT_FOUND, "Route not found");
});

module.exports = router;
