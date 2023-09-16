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
router.get("/:id", validatePatientID, PatientController.index);

// add validation once confirm fields to add
router.patch("/:id", PatientController.update);

router.post("", PatientController.add);

module.exports = router;
