const {
  convertPatientHistoryFormat,
} = require("../helpers/PatientHistoryUtil");
const PatientHistory = require("../models/PatientHistory");

const getPatientHistory = async (timezone = "UTC") => {
  const patientHistory = await PatientHistory.findAll({
    order: [
      ["id", "ASC"],
      ["version", "ASC"],
    ],
  });
  return convertPatientHistoryFormat(patientHistory, timezone);
};

module.exports = { getPatientHistory };
