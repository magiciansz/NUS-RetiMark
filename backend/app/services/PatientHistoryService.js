const {
  convertPatientHistoryFormat,
} = require("../helpers/PatientHistoryUtil");
const { formatPatientOutputTimezone } = require("../helpers/PatientUtil");
const PatientHistory = require("../models/PatientHistory");
const { getPatientByID } = require("./PatientService");

const getPatientHistory = async (timezone = "UTC") => {
  const patientHistory = await PatientHistory.findAll({
    order: [
      ["id", "ASC"],
      ["version", "DESC"],
    ],
  });
  return convertPatientHistoryFormat(patientHistory, timezone);
};

const getPatientReports = async (id, timezone = "UTC") => {
  const patient = await getPatientByID(id);
  const patientReports = await PatientHistory.findAll({
    where: {
      id: patient.id,
    },
    order: [["version", "DESC"]],
    attributes: ["version", "doctor_notes", "report_link", "visit_date"],
    timezone: timezone,
  });
  const reports = patientReports.map(function (report) {
    return formatPatientOutputTimezone(report, timezone);
  });
  return {
    reports,
    totalCount: patientReports.length,
  };
};

module.exports = { getPatientHistory, getPatientReports };
