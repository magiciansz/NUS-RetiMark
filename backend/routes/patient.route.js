const express = require("express");
const router = express.Router();
const PatientController = require("../app/controllers/PatientController");
const {
  validateUploadImageParameters,
  validatePatientID,
} = require("../app/middlewares/validators");

router.post(
  "/import/:userId",
  validateUploadImageParameters,
  PatientController.addToBucketFromURL
);
router.get("/get/:id", validatePatientID, PatientController.getPatient);

module.exports = router;
