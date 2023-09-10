const catchAsync = require("../helpers/catchAsync");
const TokenService = require("../services/TokenService");
const AuthService = require("../services/AuthService");
const UserService = require("../services/UserService");
const httpStatus = require("http-status");

const register = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  const tokens = await TokenService.generateAuthTokens(
    user,
    req.query.timezone
  );
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await AuthService.loginUserWithUsernameAndPassword(
    username,
    password
  );
  const tokens = await TokenService.generateAuthTokens(
    user,
    req.query.timezone
  );
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await AuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshAuthToken = catchAsync(async (req, res) => {
  const tokens = await AuthService.refreshAuth(
    req.body.refreshToken,
    req.query.timezone
  );
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshAuthToken,
};
