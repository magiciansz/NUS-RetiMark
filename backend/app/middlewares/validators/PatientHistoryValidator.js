const { query } = require("express-validator");
const { BadRequestError } = require("../responseCodes");
const moment = require("moment-timezone");

const validateGetPatientHistory = [
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
  query("ocular_lower_threshold")
    .not()
    .isEmpty()
    .withMessage("ocular_lower_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("ocular_lower_threshold has to be betweeen 0 and 1"),
  query("ocular_upper_threshold")
    .not()
    .isEmpty()
    .withMessage("ocular_upper_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("ocular_upper_threshold has to be betweeen 0 and 1"),
  query("glaucoma_lower_threshold")
    .not()
    .isEmpty()
    .withMessage("glaucoma_lower_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("glaucoma_lower_threshold has to be betweeen 0 and 1"),
  query("glaucoma_upper_threshold")
    .not()
    .isEmpty()
    .withMessage("glaucoma_upper_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage("glaucoma_upper_threshold has to be betweeen 0 and 1"),
  query("diabetic_retinopathy_upper_threshold")
    .not()
    .isEmpty()
    .withMessage("diabetic_retinopathy_upper_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage(
      "diabetic_retinopathy_upper_threshold has to be betweeen 0 and 1"
    ),
  query("diabetic_retinopathy_lower_threshold")
    .not()
    .isEmpty()
    .withMessage("diabetic_retinopathy_lower_threshold cannot be empty")
    .bail()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage(
      "diabetic_retinopathy_lower_threshold has to be betweeen 0 and 1"
    ),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateGetPatientReports = [
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
  query("sort")
    .not()
    .isEmpty()
    .withMessage("sort cannot be empty.")
    .bail()
    .custom((value) => {
      return ["ascending", "descending"].includes(value);
    })
    .withMessage(
      "sort is not valid, please choose from ascending or descending"
    ),
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

module.exports = {
  validateGetPatientHistory,
  validateGetPatientReports,
};
