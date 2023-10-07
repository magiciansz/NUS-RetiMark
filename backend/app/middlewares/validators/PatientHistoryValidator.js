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
  (req, res, next) => {
    return BadRequestError(req, res, next);
  },
];

const validateGetSortedPatientHistory = [
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
  validateGetSortedPatientHistory,
};
