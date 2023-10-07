const catchAsync = require("../helpers/catchAsync");
const httpStatus = require("http-status");

const PatientService = require("../services/PatientService");

// images from browser
// params: UserId,
// query: category which takes in: left_eye_resized_image, right_eye_resized_image, left_eye_image, right_eye_image
// body: imageBinary which contains base64 representation of image
// refactor to use service and new error framework

// const addToBucketFromURL = async (req, res, next) => {
//   try {
//     const patient = await Patient.findOne({ where: { id: req.params.userId } });
//     if (!patient) {
//       return ResourceNotFoundError(
//         req,
//         res,
//         next,
//         `Patient with ID ${req.params.userId} is not found in the database`
//       );
//     }
//     var buf = Buffer.from(
//       req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),
//       "base64"
//     );

//     const currentDate = DateUtil.getCurrentDateWithoutSpaces();
//     await s3
//       .putObject({
//         Body: buf,
//         Key: `/patient-images/${req.params.userId}/${req.query.category}/${currentDate}`,
//         ContentEncoding: "base64",
//         ContentType: "image/jpeg",
//       })
//       .promise()
//       .then(() => {
//         return SuccessResponse(req, res, next, "Object successfully added");
//       });
//   } catch (err) {
//     next(err);
//   }
// };

const index = catchAsync(async (req, res) => {
  const patient = await PatientService.getPatientByID(req.params.id);
  res.status(httpStatus.OK).send({ patient });
});

// update with image processing, and put the actual S3 link inside. same for the probabilities

const add = catchAsync(async (req, res) => {
  const patient = await PatientService.addPatient(
    req.body,
    req.files,
    req.query.timezone
  );
  res.status(httpStatus.CREATED).send({ patient });
});

const update = catchAsync(async (req, res) => {
  const patient = await PatientService.updatePatient(
    req.params.id,
    req.body,
    req.files,
    req.query.timezone
  );
  res.status(httpStatus.OK).send({ patient });
});

const remove = catchAsync(async (req, res) => {
  await PatientService.deletePatient(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const search = catchAsync(async (req, res) => {
  const results = await PatientService.searchPatient(req.query.query);
  res.status(httpStatus.OK).send(results);
});

module.exports = {
  index,
  update,
  add,
  remove,
  search,
};
