const httpStatus = require("http-status");
const catchAsync = require("../helpers/catchAsync");
const PatientHistoryService = require("../services/PatientHistoryService");

const index = catchAsync(async (req, res) => {
  const patientHistory = await PatientHistoryService.getPatientHistory(
    req.query.timezone
  );
  res.status(httpStatus.OK).send(patientHistory);
});

const getPatientReports = catchAsync(async (req, res) => {
  const patientReports = await PatientHistoryService.getPatientReports(
    req.params.id,
    req.query.timezone
  );
  res.status(httpStatus.OK).send(patientReports);
});

module.exports = {
  index,
  getPatientReports,
};
