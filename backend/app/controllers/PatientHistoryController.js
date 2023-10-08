const httpStatus = require("http-status");
const catchAsync = require("../helpers/catchAsync");
const PatientHistoryService = require("../services/PatientHistoryService");

const index = catchAsync(async (req, res) => {
  const thresholds = {
    ocular_lower_threshold: req.query.ocular_lower_threshold,
    ocular_upper_threshold: req.query.ocular_upper_threshold,
    glaucoma_lower_threshold: req.query.glaucoma_lower_threshold,
    glaucoma_upper_threshold: req.query.glaucoma_upper_threshold,
    diabetic_retinopathy_lower_threshold:
      req.query.diabetic_retinopathy_lower_threshold,
    diabetic_retinopathy_upper_threshold:
      req.query.diabetic_retinopathy_upper_threshold,
  };
  const patientHistory = await PatientHistoryService.getPatientHistory(
    req.query.timezone,
    thresholds
  );
  res.status(httpStatus.OK).send(patientHistory);
});

const getPatientReports = catchAsync(async (req, res) => {
  const patientReports = await PatientHistoryService.getPatientReports(
    req.params.id,
    req.query.sort,
    req.query.timezone
  );
  res.status(httpStatus.OK).send(patientReports);
});

module.exports = {
  index,
  getPatientReports,
};
