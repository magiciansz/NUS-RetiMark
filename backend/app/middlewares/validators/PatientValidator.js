const { query, body, param } = require("express-validator");
const { BadRequestError } = require("../responseCodes");
const moment = require("moment-timezone");

const validateCreatePatient = [
  query("timezone")
    .custom((value) => {
      if (value !== undefined) {
        if (!moment.tz.names().includes(value)) {
          return false;
        }
      }
      return true;
    })
    .withMessage("timezone is not valid"),
  body("name")
    .not()
    .isEmpty()
    .withMessage("name cannot be empty")
    .bail()
    .isString()
    .withMessage("name has to be a string")
    .bail(),
  body("date_of_birth")
    .not()
    .isEmpty()
    .withMessage("date_of_birth cannot be empty")
    .bail()
    .isDate({
      format: "YYYY-MM-DD",
      strictMode: true,
    })
    .withMessage("date_of_birth has to be a valid date with format YYYY-MM-DD")
    .bail()
    .custom((value) => {
      return new Date(value) < new Date();
    })
    .withMessage("date_of_birth has to be a valid date."),
  body("sex")
    .not()
    .isEmpty()
    .withMessage("sex cannot be empty")
    .bail()
    .custom((value) => {
      return (value === "M") | (value === "F");
    })
    .withMessage("sex has to be either M or F."),
  body("left_diabetic_retinography_stage")
    .not()
    .isEmpty()
    .withMessage("left_diabetic_retinography_stage cannot be empty")
    .bail()
    .isInt({ min: 0, max: 4 })
    .withMessage("left_diabetic_retinography_stage has to be betweeen 0 and 4"),
  body("left_diabetic_retinography_prob")
    .not()
    .isEmpty()
    .withMessage("left_diabetic_retinography_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_diabetic_retinography_prob has to be betweeen 0 and 1"),
  body("right_diabetic_retinography_stage")
    .not()
    .isEmpty()
    .withMessage("right_diabetic_retinography_stage cannot be empty")
    .bail()
    .isInt({ min: 0, max: 4 })
    .withMessage(
      "right_diabetic_retinography_stage has to be betweeen 0 and 4"
    ),
  body("right_diabetic_retinography_prob")
    .not()
    .isEmpty()
    .withMessage("right_diabetic_retinography_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_diabetic_retinography_prob has to be betweeen 0 and 1"),
  body("left_ocular_prob")
    .not()
    .isEmpty()
    .withMessage("left_ocular_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_ocular_prob has to be betweeen 0 and 1"),
  body("right_ocular_prob")
    .not()
    .isEmpty()
    .withMessage("right_ocular_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_ocular_prob has to be betweeen 0 and 1"),
  body("left_glaucoma_prob")
    .not()
    .isEmpty()
    .withMessage("left_glaucoma_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_glaucoma_prob has to be betweeen 0 and 1"),
  body("right_glaucoma_prob")
    .not()
    .isEmpty()
    .withMessage("right_glaucoma_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_glaucoma_prob has to be betweeen 0 and 1"),
  body("doctor_notes")
    .not()
    .isEmpty()
    .withMessage("doctor_notes cannot be empty"),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateUpdatePatient = [
  query("timezone")
    .custom((value) => {
      if (value !== undefined) {
        if (!moment.tz.names().includes(value)) {
          return false;
        }
      }
      return true;
    })
    .withMessage("timezone is not valid"),
  body("left_diabetic_retinography_stage")
    .not()
    .isEmpty()
    .withMessage("left_diabetic_retinography_stage cannot be empty")
    .bail()
    .isInt({ min: 0, max: 4 })
    .withMessage("left_diabetic_retinography_stage has to be betweeen 0 and 4"),
  body("left_diabetic_retinography_prob")
    .not()
    .isEmpty()
    .withMessage("left_diabetic_retinography_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_diabetic_retinography_prob has to be betweeen 0 and 1"),
  body("right_diabetic_retinography_stage")
    .not()
    .isEmpty()
    .withMessage("right_diabetic_retinography_stage cannot be empty")
    .bail()
    .isInt({ min: 0, max: 4 })
    .withMessage(
      "right_diabetic_retinography_stage has to be betweeen 0 and 4"
    ),
  body("right_diabetic_retinography_prob")
    .not()
    .isEmpty()
    .withMessage("right_diabetic_retinography_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_diabetic_retinography_prob has to be betweeen 0 and 1"),
  body("left_ocular_prob")
    .not()
    .isEmpty()
    .withMessage("left_ocular_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_ocular_prob has to be betweeen 0 and 1"),
  body("right_ocular_prob")
    .not()
    .isEmpty()
    .withMessage("right_ocular_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_ocular_prob has to be betweeen 0 and 1"),
  body("left_glaucoma_prob")
    .not()
    .isEmpty()
    .withMessage("left_glaucoma_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("left_glaucoma_prob has to be betweeen 0 and 1"),
  body("right_glaucoma_prob")
    .not()
    .isEmpty()
    .withMessage("right_glaucoma_prob cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("right_glaucoma_prob has to be betweeen 0 and 1"),
  body("doctor_notes")
    .not()
    .isEmpty()
    .withMessage("doctor_notes cannot be empty"),
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

module.exports = {
  validateCreatePatient,
  validateUpdatePatient,
  validatePatientID,
};
