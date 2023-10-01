import axios from 'axios';

async function createPatient({ accessToken, leftEye, rightEye, report }) {
  console.log('in api', rightEye);
  const formData = new FormData();
  formData.append('name', 'jiahui6');
  formData.append('date_of_birth', '2001-02-02');
  formData.append('sex', 'F');
  formData.append('left_diabetic_retinography_stage', 0);
  formData.append('right_diabetic_retinography_stage', 0);
  formData.append('left_diabetic_retinography_prob', 0);
  formData.append('right_diabetic_retinography_prob', 0);
  formData.append('left_ocular_prob', 0);
  formData.append('right_ocular_prob', 0);
  formData.append('left_glaucoma_prob', 0);
  formData.append('right_glaucoma_prob', 0);
  formData.append('doctor_notes', 'hi');
  formData.append('right_eye_image', rightEye);
  formData.append('left_eye_image', leftEye);
  formData.append('report_pdf', report);
  console.log('form data');
  formData.forEach((value, key) => {
    console.log('Field:', key, 'Value:', value);
  });

  return axios.post(
    `http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/patient?timezone=Asia/Singapore`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      'Content-Type': 'multipart/form-data',
    }
  );
}

export default {
  createPatient,
};
