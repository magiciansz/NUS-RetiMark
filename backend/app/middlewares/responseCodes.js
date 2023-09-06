const { check, validationResult } = require("express-validator");

// 404
const HttpNotFoundError = (req, res, next) => {
  const err = new Error(
    `The requested URL ${req.originalUrl} can't be found on the server.`
  );
  err.status = "Fail";
  err.statusCode = 404;
  next(err);
};

const ResourceNotFoundError = (req, res, next, message) => {
  const err = new Error(message);
  err.status = "Fail";
  err.statusCode = 404;
  next(err);
};

const BadRequestError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ status: 400, message: errors.array() });
  next();
};

const SuccessResponse = (req, res, next, message, data = null) => {
  if (data === null) {
    res.status(200).json({
      status: 200,
      message: message,
    });
  } else {
    res.status(200).json({
      status: 200,
      message: message,
      data: data,
    });
  }
};

module.exports = {
  HttpNotFoundError,
  ResourceNotFoundError,
  BadRequestError,
  SuccessResponse,
};
