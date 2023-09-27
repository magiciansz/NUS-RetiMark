const auth = require("../app/middlewares/auth");
const express = require("express");

const PatientHistoryController = require("../app/controllers/PatientHistoryController");
const {
  validateGetPatientHistory,
} = require("../app/middlewares/validators/PatientHistoryValidator");

const router = express.Router();

router.get(
  "",
  auth(),
  validateGetPatientHistory,
  PatientHistoryController.index
);

module.exports = router;
