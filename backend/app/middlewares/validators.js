const { query, param, body } = require("express-validator");
const { BadRequestError } = require("./responseCodes");

const validateUploadImageParameters = [
  param("userId")
    .not()
    .isEmpty()
    .withMessage("UserId cannot be empty.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("UserId should have a minimum value of 1.")
    .bail(),
  // body("imageBinary")
  //   .not()
  //   .isEmpty()
  //   .withMessage("imageBinary cannot be empty.")
  //   .bail(),
  query("category")
    .not()
    .isEmpty()
    .withMessage("Category cannot be empty.")
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
];

module.exports = {
  validateUploadImageParameters,
  validateGetImageParameters,
};
