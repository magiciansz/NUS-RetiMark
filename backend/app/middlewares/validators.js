const { query, param, body } = require("express-validator");
const { BadRequestError } = require("./responseCodes");
const moment = require("moment-timezone");

const validateUploadImageParameters = [
  param("userId")
    .not()
    .isEmpty()
    .withMessage("userId cannot be empty.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("userId should have a minimum value of 1.")
    .bail(),
  // body("imageBinary")
  //   .not()
  //   .isEmpty()
  //   .withMessage("imageBinary cannot be empty.")
  //   .bail(),
  query("category")
    .not()
    .isEmpty()
    .withMessage("category cannot be empty.")
    .bail()
    .isIn([
      "left_eye_resized_image",
      "right_eye_resized_image",
      "left_eye_image",
      "right_eye_image",
    ])
    .withMessage(
      `Allowed values for category are: ${[
        "left_eye_resized_image",
        "right_eye_resized_image",
        "left_eye_image",
        "right_eye_image",
      ]}`
    ),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateGetImageParameters = [
  query("url").not().isEmpty().withMessage("url cannot be empty.").bail(),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validatePatientID = [
  param("id").not().isEmpty().withMessage("id cannot be empty."),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateLogin = [
  body("username").not().isEmpty().withMessage("username cannot be empty."),
  body("password").not().isEmpty().withMessage("password cannot be empty."),
  query("timezone")
    .not()
    .isEmpty()
    .withMessage("timezone cannot be empty")
    .bail()
    .isIn(moment.tz.names())
    .withMessage("timezone is not valid"),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateLogout = [
  body("refreshToken")
    .not()
    .isEmpty()
    .withMessage("refreshToken cannot be empty."),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateRefreshAuthToken = [
  body("refreshToken")
    .not()
    .isEmpty()
    .withMessage("refreshToken cannot be empty."),
  query("timezone")
    .not()
    .isEmpty()
    .withMessage("timezone cannot be empty")
    .bail()
    .isIn(moment.tz.names())
    .withMessage("timezone is not valid"),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

// creating / updating user details

const validateUserDetails = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("username cannot be empty.")
    .bail()
    .isLength({
      min: 8,
    })
    .withMessage(
      "username has to be a length of at least 8 characters or numbers."
    )
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage("username cannot have blank spaces."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password cannot be empty.")
    .bail()
    .isLength({
      min: 8,
    })
    .withMessage(
      "password has to be a length of at least 8 characters or numbers."
    )
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage("password cannot have blank spaces."),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateUserDetailsAndTimezone = [
  query("timezone")
    .not()
    .isEmpty()
    .withMessage("timezone cannot be empty")
    .bail()
    .isIn(moment.tz.names())
    .withMessage("timezone is not valid"),
  body("username")
    .not()
    .isEmpty()
    .withMessage("username cannot be empty.")
    .bail()
    .isLength({
      min: 8,
    })
    .withMessage(
      "username has to be a length of at least 8 characters or numbers."
    )
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage("username cannot have blank spaces."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password cannot be empty.")
    .bail()
    .isLength({
      min: 8,
    })
    .withMessage(
      "password has to be a length of at least 8 characters or numbers."
    )
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage("password cannot have blank spaces."),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateUserId = [
  param("userId").not().isEmpty().withMessage("User ID cannot be empty."),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

module.exports = {
  validateUploadImageParameters,
  validateGetImageParameters,
  validatePatientID,
  validateLogin,
  validateUserDetails,
  validateUserId,
  validateUserDetailsAndTimezone,
  validateLogout,
  validateRefreshAuthToken,
};
