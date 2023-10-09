const auth = require("../app/middlewares/auth");
const express = require("express");

const PatientHistoryController = require("../app/controllers/PatientHistoryController");
const {
  validateGetPatientHistory,
} = require("../app/middlewares/validators/PatientHistoryValidator");
const {
  validatePatientID,
} = require("../app/middlewares/validators/PatientValidator");

const router = express.Router();

router.get(
  "",
  auth(),
  validateGetPatientHistory,
  PatientHistoryController.index
);

router.get(
  "/:id/reports",
  auth(),
  validatePatientID,
  validateGetPatientHistory,
  PatientHistoryController.getPatientReports
);

module.exports = router;
