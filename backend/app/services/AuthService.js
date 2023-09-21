const httpStatus = require("http-status");
const tokenService = require("./TokenService");
const userService = require("./UserService");
const Token = require("../models/Token");
const ApiError = require("../middlewares/ApiError");
const { tokenTypes } = require("../../config/tokens");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username, true);
  if (!user || !(await user.validatePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return await userService.getUserByUsername(username);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      value: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token Not found");
  }
  await refreshTokenDoc.destroy();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @param {string} timezone
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken, timezone) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.destroy();
    return tokenService.generateAuthTokens(user, timezone);
  } catch (error) {
    if (error)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorised: Invalid or expired refresh token."
      );
  }
};

module.exports = {
  loginUserWithUsernameAndPassword,
  logout,
  refreshAuth,
};
