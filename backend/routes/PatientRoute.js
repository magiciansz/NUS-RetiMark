const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Remove storage configuration
const auth = require("../app/middlewares/auth");

const PatientController = require("../app/controllers/PatientController");
const {
  validatePatientID,
} = require("../app/middlewares/validators/UserValidator");

const {
  validateCreatePatient,
  validateUpdatePatient,
} = require("../app/middlewares/validators/PatientValidator");
router.get("/search", auth(), PatientController.search);

router.get("/:id", validatePatientID, PatientController.index);

router.patch(
  "/:id",
  upload.fields([
    { name: "report_pdf" },
    { name: "left_eye_image" },
    { name: "right_eye_image" },
  ]),
  auth(),
  validateUpdatePatient,
  PatientController.update
);

router.post(
  "",
  upload.fields([
    { name: "report_pdf" },
    { name: "left_eye_image" },
    { name: "right_eye_image" },
  ]),
  auth(),
  validateCreatePatient,
  PatientController.add
);

router.delete("/:id", PatientController.remove);

module.exports = router;
