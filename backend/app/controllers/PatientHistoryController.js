const httpStatus = require("http-status");
const catchAsync = require("../helpers/catchAsync");
const PatientHistoryService = require("../services/PatientHistoryService");

const index = catchAsync(async (req, res) => {
  const patientHistory = await PatientHistoryService.getPatientHistory(
    req.query.timezone
  );
  res.status(httpStatus.OK).send(patientHistory);
});

module.exports = {
  index,
};
