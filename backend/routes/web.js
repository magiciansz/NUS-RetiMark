const express = require("express");
const router = express.Router();
const patientRoute = require("./PatientRoute");
const authRoute = require("./AuthRoute");
const userRoute = require("./UserRoute");
const PatientHistoryRoute = require("./PatientHistoryRoute");
const ApiError = require("../app/middlewares/ApiError");
const httpStatus = require("http-status");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/.well-known/pki-validation/", // Change the path to your desired destination
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const defaultRoutes = [
  {
    path: "/api/v1/patient",
    route: patientRoute,
  },
  {
    path: "/api/v1/auth",
    route: authRoute,
  },
  {
    path: "/api/v1/user",
    route: userRoute,
  },
  {
    path: "/api/v1/patient-history",
    route: PatientHistoryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// health check
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// upload SSL cert
router.post("/upload-certificate", upload.single("file"), (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload a file");
  }
  res.status(200).send("File Uploaded Successfully");
});

router.all("*", () => {
  throw new ApiError(httpStatus.NOT_FOUND, "Route not found");
});

module.exports = router;
