const Patient = require("../models/Patient");
const ApiError = require("../middlewares/ApiError");
const httpStatus = require("http-status");
const {
  uploadPatientFiles,
  formatPatientOutputTimezone,
} = require("../helpers/PatientUtil");
const sequelize = require("../../config/database");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getPatientByID = async (id) => {
  const patient = await Patient.findOne({ where: { id: id } });
  if (patient === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

const addPatient = async (body, files, timezone = "UTC") => {
  if (await Patient.isDuplicate(body.name, body.date_of_birth)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This patient has already been created."
    );
  }
  let patient;
  await sequelize.transaction(async (transaction) => {
    patient = await Patient.create(
      {
        date_of_birth: body.date_of_birth,
        sex: body.sex,
        name: body.name,
        left_diabetic_retinopathy_stage: body.left_diabetic_retinopathy_stage,
        left_diabetic_retinopathy_prob: body.left_diabetic_retinopathy_prob,
        right_diabetic_retinopathy_stage: body.right_diabetic_retinopathy_stage,
        right_diabetic_retinopathy_prob: body.right_diabetic_retinopathy_prob,
        left_ocular_prob: body.left_ocular_prob,
        right_ocular_prob: body.right_ocular_prob,
        left_glaucoma_prob: body.left_glaucoma_prob,
        right_glaucoma_prob: body.right_glaucoma_prob,
        doctor_notes: body.doctor_notes,
      },
      { transaction: transaction }
    );
    const urls = await uploadPatientFiles(patient, files);
    await patient.update(urls, { transaction: transaction });
  });
  await patient.reload();
  return formatPatientOutputTimezone(patient, timezone);
};

const updatePatient = async (id, body, files, timezone = "UTC") => {
  const patient = await getPatientByID(id);
  const urls = await uploadPatientFiles(patient, files);
  await patient.update({
    left_diabetic_retinopathy_stage: body.left_diabetic_retinopathy_stage,
    left_diabetic_retinopathy_prob: body.left_diabetic_retinopathy_prob,
    right_diabetic_retinopathy_stage: body.right_diabetic_retinopathy_stage,
    right_diabetic_retinopathy_prob: body.right_diabetic_retinopathy_prob,
    left_ocular_prob: body.left_ocular_prob,
    right_ocular_prob: body.right_ocular_prob,
    left_glaucoma_prob: body.left_glaucoma_prob,
    right_glaucoma_prob: body.right_glaucoma_prob,
    doctor_notes: body.doctor_notes,
    ...urls,
  });
  await patient.reload();
  return formatPatientOutputTimezone(patient, timezone);
};

const deletePatient = async (id) => {
  const patient = await getPatientByID(id);
  await patient.destroy();
};

const searchPatient = async (query) => {
  const patients = await Patient.findAll({
    where: {
      name: {
        [Op.like]: `%${query}%`,
      },
    },
    order: [["id", "ASC"]],
    attributes: ["id", "name", "date_of_birth", "sex"],
  });
  return { patients, totalCount: patients.length };
};

module.exports = {
  getPatientByID,
  addPatient,
  updatePatient,
  deletePatient,
  searchPatient,
};
