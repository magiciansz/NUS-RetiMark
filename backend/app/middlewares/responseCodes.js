const { validationResult } = require("express-validator");
const httpStatus = require("http-status");
const ApiError = require("../middlewares/ApiError");

// used for throwing errors when validating code, since code is repeated for all errors
const BadRequestError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new ApiError(
      httpStatus.BAD_REQUEST,
      JSON.stringify(errors.array())
    );
    return next(error);
  }
  next();
};

module.exports = {
  BadRequestError,
};
