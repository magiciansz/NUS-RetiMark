const ApiError = require("../middlewares/ApiError");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const s3 = require("./AwsUtil");

const {
  formatDateTime,
  getCurrentDateWithoutSpaces,
} = require("../helpers/DateUtil");
/**
 * format patient output from Sequelize Object to object, converting timezone
 * @param {SequelizeObject} patient
 * @param {string} timezone
 * @returns {Object}
 */
const formatPatientOutput = (patient, timezone) => {
  const formattedPatient = patient.toJSON();
  formattedPatient.visit_date = formatDateTime(
    moment(formattedPatient.visit_date),
    timezone
  );
  return formattedPatient;
};

const uploadPatientFiles = async (patient, files) => {
  if (!files["right_eye_image"]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please upload a right_eye_image"
    );
  }
  if (!files["left_eye_image"]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please upload a left_eye_image."
    );
  }
  if (!files["report_pdf"]) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload a report_pdf.");
  }
  const left_eye_image = files["left_eye_image"][0];
  const right_eye_image = files["right_eye_image"][0];
  const report_pdf = files["report_pdf"][0];
  const currentDate = getCurrentDateWithoutSpaces();
  // version committed is always +1 of the current version
  const version = patient.version + 1;
  const left_eye_image_key = `patient-images-${process.env.NODE_ENV}/${patient.id}/left_eye_image/v${version}_${currentDate}`;
  const right_eye_image_key = `patient-images-${process.env.NODE_ENV}/${patient.id}/right_eye_image/v${version}_${currentDate}`;
  const report_pdf_key = `patient-images-${process.env.NODE_ENV}/${patient.id}/report_pdf/v${version}_${currentDate}`;
  await s3
    .putObject({
      Body: left_eye_image.buffer,
      Key: left_eye_image_key,
      ContentType: left_eye_image.mimetype,
    })
    .promise();
  await s3
    .putObject({
      Body: right_eye_image.buffer,
      Key: right_eye_image_key,
      ContentType: right_eye_image.mimetype,
    })
    .promise();
  await s3
    .putObject({
      Body: report_pdf.buffer,
      Key: report_pdf_key,
      ContentType: report_pdf.mimetype,
    })
    .promise();
  // get bucket DNS
  const s3BaseURL = await getBaseURLForS3(left_eye_image_key);
  return {
    left_eye_image: s3BaseURL + "/" + left_eye_image_key,
    right_eye_image: s3BaseURL + "/" + right_eye_image_key,
    report_link: s3BaseURL + "/" + report_pdf_key,
  };
};

const getBaseURLForS3 = async (key) => {
  const url = await s3.getSignedUrl("getObject", {
    Key: key,
  });
  const parts = url.split("/");
  const s3BaseURL = parts.slice(0, 3).join("/");
  return s3BaseURL;
};

module.exports = {
  formatPatientOutput,
  uploadPatientFiles,
};
