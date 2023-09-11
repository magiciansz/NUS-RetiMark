const express = require("express");
const router = express.Router();

const AuthController = require("../app/controllers/AuthController");
const {
  validateUserDetailsAndTimezone,
  validateLogout,
  validateLogin,
  validateRefreshTokens,
} = require("../app/middlewares/validators");

router.post(
  "/register",
  validateUserDetailsAndTimezone,
  AuthController.register
);
router.post("/login", validateLogin, AuthController.login);

router.post("/logout", validateLogout, AuthController.logout);

router.post(
  "/refresh-tokens",
  validateRefreshTokens,
  AuthController.refreshTokens
);

module.exports = router;
