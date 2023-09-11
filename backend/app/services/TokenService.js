const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const httpStatus = require("http-status");
const Token = require("../models/Token");
const ApiError = require("../middlewares/ApiError");
const { tokenTypes } = require("../../config/tokens");
const { Op } = require("sequelize");

const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.TOKEN_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    value: token,
    user_id: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

// for refresh token, or other tokens (if needed)
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  const tokenDoc = await Token.findOne({
    where: {
      value: token,
      type,
      user_id: payload.sub,
      expires: {
        [Op.gte]: moment(),
      },
      blacklisted: false,
    },
  });
  if (!tokenDoc) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden: Invalid or expired refresh token."
    );
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @param {String} timezone
 * @returns {Promise<Object>}
 */

const generateAuthTokens = async (user, timezone) => {
  const accessTokenExpires = moment().add(
    process.env.TOKEN_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
    "hours"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      // take in an appropriate timezone
      expires: accessTokenExpires.tz(timezone).toString(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.tz(timezone).toString(),
    },
  };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
