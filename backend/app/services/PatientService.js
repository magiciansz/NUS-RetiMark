const Patient = require("../models/Patient");
const ApiError = require("../middlewares/ApiError");
const httpStatus = require("http-status");
const {
  uploadPatientFiles,
  formatPatientOutput,
} = require("../helpers/PatientUtil");

const getPatientByID = async (id) => {
  const patient = await Patient.findOne({ where: { id: id } });
  if (patient === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

const addPatient = async (body, files, timezone = "UTC") => {
  const patient = await Patient.create({
    date_of_birth: body.date_of_birth,
    sex: body.sex,
    name: body.name,
    left_diabetic_retinography_stage: body.left_diabetic_retinography_stage,
    left_diabetic_retinography_prob: body.left_diabetic_retinography_prob,
    right_diabetic_retinography_stage: body.right_diabetic_retinography_stage,
    right_diabetic_retinography_prob: body.right_diabetic_retinography_prob,
    left_ocular_prob: body.left_ocular_prob,
    right_ocular_prob: body.right_ocular_prob,
    left_glaucoma_prob: body.left_glaucoma_prob,
    right_glaucoma_prob: body.right_glaucoma_prob,
    doctor_notes: body.doctor_notes,
  });
  const urls = await uploadPatientFiles(patient, files);
  await (await patient.update(urls)).reload();
  return formatPatientOutput(patient, timezone);
};

const updatePatient = async (id, body) => {
  const patient = await getPatientByID(id);
  await patient.update({
    left_eye_image: body.left_eye_image,
    right_eye_image: body.right_eye_image,
    left_diabetic_retinography_stage: body.left_diabetic_retinography_stage,
    left_diabetic_retinography_prob: body.left_diabetic_retinography_prob,
    right_diabetic_retinography_stage: body.right_diabetic_retinography_stage,
    right_diabetic_retinography_prob: body.right_diabetic_retinography_prob,
    left_ocular_prob: body.left_ocular_prob,
    right_ocular_prob: body.right_ocular_prob,
    left_glaucoma_prob: body.left_glaucoma_prob,
    right_glaucoma_prob: body.right_glaucoma_prob,
    doctor_notes: body.doctor_notes,
    report_link: body.report_link,
  });
  return patient;
};

const deletePatient = async (id) => {
  const patient = await getPatientByID(id);
  await patient.destroy();
};

module.exports = {
  getPatientByID,
  addPatient,
  updatePatient,
  deletePatient,
};
