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

module.exports = {
  validateGetPatientHistory,
};
