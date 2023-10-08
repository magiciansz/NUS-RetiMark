const {
  convertPatientHistoryFormat,
} = require("../helpers/PatientHistoryUtil");
const { formatPatientOutputTimezone } = require("../helpers/PatientUtil");
const Patient = require("../models/Patient");
const PatientHistory = require("../models/PatientHistory");
const { getPatientByID } = require("./PatientService");
const { Op } = require("sequelize");

const getPatientHistory = async (timezone = "UTC", thresholds) => {
  const patients = await Patient.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            {
              left_ocular_prob: { [Op.gte]: thresholds.ocular_lower_threshold },
            },
            {
              left_ocular_prob: { [Op.lte]: thresholds.ocular_upper_threshold },
            },
          ],
        },
        {
          [Op.and]: [
            {
              right_ocular_prob: {
                [Op.gte]: thresholds.ocular_lower_threshold,
              },
            },
            {
              right_ocular_prob: {
                [Op.lte]: thresholds.ocular_upper_threshold,
              },
            },
          ],
        },
        {
          [Op.and]: [
            {
              left_glaucoma_prob: {
                [Op.gte]: thresholds.glaucoma_lower_threshold,
              },
            },
            {
              left_glaucoma_prob: {
                [Op.lte]: thresholds.glaucoma_upper_threshold,
              },
            },
          ],
        },
        {
          [Op.and]: [
            {
              right_glaucoma_prob: {
                [Op.gte]: thresholds.glaucoma_lower_threshold,
              },
            },
            {
              right_glaucoma_prob: {
                [Op.lte]: thresholds.glaucoma_upper_threshold,
              },
            },
          ],
        },
        {
          [Op.and]: [
            {
              left_diabetic_retinopathy_prob: {
                [Op.gte]: thresholds.diabetic_retinopathy_lower_threshold,
              },
            },
            {
              left_diabetic_retinopathy_prob: {
                [Op.lte]: thresholds.diabetic_retinopathy_upper_threshold,
              },
            },
          ],
        },
        {
          [Op.and]: [
            {
              right_diabetic_retinopathy_prob: {
                [Op.gte]: thresholds.diabetic_retinopathy_lower_threshold,
              },
            },
            {
              right_diabetic_retinopathy_prob: {
                [Op.lte]: thresholds.diabetic_retinopathy_upper_threshold,
              },
            },
          ],
        },
        // Add more conditions as needed
      ],
    },
    attributes: ["id"],
    raw: true,
  });
  const arrayOfIds = patients.map((patient) => patient.id);
  const patientHistory = await PatientHistory.findAll({
    order: [
      ["id", "ASC"],
      ["version", "DESC"],
    ],
    where: {
      id: arrayOfIds,
    },
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
