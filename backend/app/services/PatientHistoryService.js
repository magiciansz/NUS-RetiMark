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

const getPatientReports = async (id, sort, timezone = "UTC") => {
  const patient = await getPatientByID(id);
  const order = sort == "ascending" ? "ASC" : "DESC";
  const patientReports = await PatientHistory.findAll({
    where: {
      id: patient.id,
    },
    order: [["version", order]],
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
