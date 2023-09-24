const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Remove storage configuration

const PatientController = require("../app/controllers/PatientController");
const {
  validatePatientID,
} = require("../app/middlewares/validators/UserValidator");

const {
  validateCreatePatient,
} = require("../app/middlewares/validators/PatientValidator");
router.get("/:id", validatePatientID, PatientController.index);

// add validation once confirm fields to add
router.patch("/:id", PatientController.update);

router.post(
  "",
  upload.fields([
    { name: "report_pdf" },
    { name: "left_eye_image" },
    { name: "right_eye_image" },
  ]),
  validateCreatePatient,
  PatientController.add
);

router.delete("/:id", PatientController.remove);

module.exports = router;
