const express = require("express");
const router = express.Router();
const testRoute = require("./test.route");

const defaultRoutes = [
  {
    path: "/test",
    route: testRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
