import axios from 'axios';

async function createPatient({
  accessToken,
  patient,
  leftEye,
  rightEye,
  docNotes,
  report,
  leftEyeResults,
  rightEyeResults,
}) {
  const formData = new FormData();
  formData.append('name', patient.name);
  formData.append('date_of_birth', patient.dateOfBirth);
  formData.append('sex', patient.gender);
  formData.append(
    'left_diabetic_retinopathy_stage',
    leftEyeResults.diabetic[0]
  );
  formData.append(
    'right_diabetic_retinopathy_stage',
    rightEyeResults.diabetic[0]
  );
  formData.append('left_diabetic_retinopathy_prob', leftEyeResults.diabetic[1]);
  formData.append(
    'right_diabetic_retinopathy_prob',
    rightEyeResults.diabetic[1]
  );
  formData.append('left_ocular_prob', leftEyeResults.amd);
  formData.append('right_ocular_prob', rightEyeResults.amd);
  formData.append('left_glaucoma_prob', leftEyeResults.glaucoma);
  formData.append('right_glaucoma_prob', rightEyeResults.glaucoma);
  formData.append('doctor_notes', docNotes || 'NIL');
  formData.append('right_eye_image', rightEye);
  formData.append('left_eye_image', leftEye);
  formData.append('report_pdf', report);

  return axios.post(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/patient?timezone=Asia/Singapore`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      'Content-Type': 'multipart/form-data',
    }
  );
}

async function updatePatient({
  accessToken,
  id,
  leftEye,
  rightEye,
  report,
  docNotes,
  leftEyeResults,
  rightEyeResults,
}) {
  const formData = new FormData();
  formData.append(
    'left_diabetic_retinopathy_stage',
    leftEyeResults.diabetic[0]
  );
  formData.append(
    'right_diabetic_retinopathy_stage',
    rightEyeResults.diabetic[0]
  );
  formData.append('left_diabetic_retinopathy_prob', leftEyeResults.diabetic[1]);
  formData.append(
    'right_diabetic_retinopathy_prob',
    rightEyeResults.diabetic[1]
  );
  formData.append('left_ocular_prob', leftEyeResults.amd);
  formData.append('right_ocular_prob', rightEyeResults.amd);
  formData.append('left_glaucoma_prob', leftEyeResults.glaucoma);
  formData.append('right_glaucoma_prob', rightEyeResults.glaucoma);
  formData.append('doctor_notes', docNotes || 'NIL');
  formData.append('right_eye_image', rightEye);
  formData.append('left_eye_image', leftEye);
  formData.append('report_pdf', report);
  return axios.patch(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/patient/${id}?timezone=Asia/Singapore`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      'Content-Type': 'multipart/form-data',
    }
  );
}

async function getPastReports({ accessToken, id, sort }) {
  return axios.get(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/patient-history/${id}/reports`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { sort },
    }
  );
}

async function searchPatient({ accessToken, query }) {
  return axios.get(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/patient/search`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { query },
    }
  );
}

export default {
  createPatient,
  updatePatient,
  getPastReports,
  searchPatient,
};
