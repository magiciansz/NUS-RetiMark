import axios from "axios";

async function createPatient({
  accessToken,
  patient,
  leftEye,
  rightEye,
  docNotes,
  report,
}) {
  const formData = new FormData();
  formData.append("name", patient.name);
  formData.append("date_of_birth", patient.dateOfBirth);
  formData.append("sex", patient.gender);
  formData.append("left_diabetic_retinopathy_stage", 0);
  formData.append("right_diabetic_retinopathy_stage", 0);
  formData.append("left_diabetic_retinopathy_prob", 0);
  formData.append("right_diabetic_retinopathy_prob", 0);
  formData.append("left_ocular_prob", 0);
  formData.append("right_ocular_prob", 0);
  formData.append("left_glaucoma_prob", 0);
  formData.append("right_glaucoma_prob", 0);
  formData.append("doctor_notes", docNotes);
  formData.append("right_eye_image", rightEye);
  formData.append("left_eye_image", leftEye);
  formData.append("report_pdf", report);
  console.log("form data for create patient");
  formData.forEach((value, key) => {
    console.log("Field:", key, "Value:", value);
  });

  return axios.post(
    `http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/patient?timezone=Asia/Singapore`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      "Content-Type": "multipart/form-data",
    }
  );
}

async function updatePatient({ accessToken, id, leftEye, rightEye, report }) {
  const formData = new FormData();
  formData.append("left_diabetic_retinopathy_stage", 0);
  formData.append("right_diabetic_retinopathy_stage", 0);
  formData.append("left_diabetic_retinopathy_prob", 0);
  formData.append("right_diabetic_retinopathy_prob", 0);
  formData.append("left_ocular_prob", 0);
  formData.append("right_ocular_prob", 0);
  formData.append("left_glaucoma_prob", 0);
  formData.append("right_glaucoma_prob", 0);
  formData.append("doctor_notes", "hi");
  formData.append("right_eye_image", rightEye);
  formData.append("left_eye_image", leftEye);
  formData.append("report_pdf", report);
  console.log("form data for update patient");
  formData.forEach((value, key) => {
    console.log("Field:", key, "Value:", value);
  });

  return axios.patch(
    `http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/patient/${id}?timezone=Asia/Singapore`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      "Content-Type": "multipart/form-data",
    }
  );
}

export default {
  createPatient,
  updatePatient,
};
