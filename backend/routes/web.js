const express = require("express");
const router = express.Router();
const patientRoute = require("./patient.route");
const { HttpNotFoundError } = require("../app/middlewares/responseCodes");

const defaultRoutes = [
  {
    path: "/api/v1/patient",
    route: patientRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.all("*", (req, res, next) => {
  return HttpNotFoundError(req, res, next);
});

module.exports = router;
