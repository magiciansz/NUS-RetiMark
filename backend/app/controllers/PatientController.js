const Patient = require("../models/Patient");

const DateUtil = require("../helpers/DateUtil");
const AWS = require("aws-sdk");
const httpStatus = require("http-status");

const {
  SuccessResponse,
  ResourceNotFoundError,
} = require("../middlewares/responseCodes");

const PatientService = require("../services/PatientService");
const AWS_BUCKET = process.env.AWS_BUCKET;
const s3 = new AWS.S3({ params: { Bucket: AWS_BUCKET } });

// refactor to use service and new error framework
const getImage = async (req, res, next) => {
  try {
    const url = await s3.getSignedUrlPromise("getObject", {
      Key: req.query.url,
      Expires: 500,
    });
    return SuccessResponse(
      req,
      res,
      next,
      "Object successfully retrieved.",
      url
    );
  } catch (err) {
    next(err);
  }
};

// images from browser
// params: UserId,
// query: category which takes in: left_eye_resized_image, right_eye_resized_image, left_eye_image, right_eye_image
// body: imageBinary which contains base64 representation of image
// refactor to use service and new error framework

const addToBucketFromURL = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.userId } });
    if (!patient) {
      return ResourceNotFoundError(
        req,
        res,
        next,
        `Patient with ID ${req.params.userId} is not found in the database`
      );
    }
    var buf = Buffer.from(
      req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const currentDate = DateUtil.getCurrentDateWithoutSpaces();
    await s3
      .putObject({
        Body: buf,
        Key: `/patient-images/${req.params.userId}/${req.query.category}/${currentDate}`,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise()
      .then(() => {
        return SuccessResponse(req, res, next, "Object successfully added");
      });
  } catch (err) {
    next(err);
  }
};

const getPatient = async (req, res, next) => {
  try {
    const patient = await PatientService.getPatientByID(req.params.id);
    res.status(httpStatus.OK).send(patient);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getImage,
  addToBucketFromURL,
  getPatient,
};
