const Patient = require("../models/Patient");
const ApiError = require("../middlewares/ApiError");
const httpStatus = require("http-status");

const getPatientByID = async (id) => {
  const patient = await Patient.findOne({ where: { id: id } });
  if (patient === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

module.exports = {
  getPatientByID,
};
