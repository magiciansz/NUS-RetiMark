const express = require("express");
const router = express.Router();
const PatientController = require("../app/controllers/PatientController");
const {
  validateUploadImageParameters,
  validateGetImageParameters,
} = require("../app/middlewares/validators");

router.post(
  "/import/:userId",
  validateUploadImageParameters,
  PatientController.addToBucketFromURL
);
router.get("/get", validateGetImageParameters, PatientController.getImage);

module.exports = router;