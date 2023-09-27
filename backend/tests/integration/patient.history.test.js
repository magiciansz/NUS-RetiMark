const setUpTestDB = require("../utils/setUpTestDB");
const request = require("supertest");
const app = require("../../appconfig");
const httpStatus = require("http-status");
const PatientHistory = require("../../app/models/PatientHistory");
const User = require("../../app/models/User");
const moment = require("moment-timezone");
const TokenService = require("../../app/services/TokenService");
const { tokenTypes } = require("../../config/tokens");
const path = require("path");

setUpTestDB();

describe("Patient History Routes", () => {
  let patient;
  let name = "Tan Jun Jie";
  let date_of_birth = "1999-05-08";
  let sex = "M";
  let left_diabetic_retinography_stage = 1;
  let left_diabetic_retinography_prob = 0.56;
  let right_diabetic_retinography_stage = 2;
  let right_diabetic_retinography_prob = 0.11;
  let left_ocular_prob = 0.25;
  let right_ocular_prob = 0.05;
  let left_glaucoma_prob = 0.36;
  let right_glaucoma_prob = 0.55;
  let doctor_notes = "This patient is healthy.";
  let user;
  let accessToken;
  beforeEach(async () => {
    patient = {
      name: name,
      date_of_birth: date_of_birth,
      sex: sex,
      left_diabetic_retinography_stage: left_diabetic_retinography_stage,
      left_diabetic_retinography_prob: left_diabetic_retinography_prob,
      right_diabetic_retinography_stage: right_diabetic_retinography_stage,
      right_diabetic_retinography_prob: right_diabetic_retinography_prob,
      left_ocular_prob: left_ocular_prob,
      right_ocular_prob: right_ocular_prob,
      left_glaucoma_prob: left_glaucoma_prob,
      right_glaucoma_prob: right_glaucoma_prob,
      doctor_notes: doctor_notes,
    };
    user = await User.create({
      username: "testinguser",
      password: "mMM@123455",
    });
    const expires = moment().add(
      process.env.TOKEN_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );
    accessToken = TokenService.generateToken(
      user.id,
      expires,
      tokenTypes.ACCESS
    );
    await request(app)
      .post("/api/v1/patient")
      .attach(
        "left_eye_image",
        path.join(__dirname, "..", "files", "docker.jpeg")
      )
      .attach(
        "right_eye_image",
        path.join(__dirname, "..", "files", "react.png")
      )
      .attach(
        "report_pdf",
        path.join(
          __dirname,
          "..",
          "files",
          "BT4103 project proposal presentation guidelines.pdf"
        )
      )
      .field(patient)
      .set("Authorization", `Bearer ${accessToken}`);
  });
  describe("GET /api/v1/patient-history", () => {
    test("Should return 200 and return history if authorization provided", async () => {
      const res = await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore" })
        .expect(httpStatus.OK);
      const ageDate = new Date(Date.now() - new Date(date_of_birth));
      const expectedHistory = {
        1: [
          {
            name: name,
            date_of_birth: date_of_birth,
            sex: sex,
            age: Math.abs(ageDate.getUTCFullYear() - 1970),
            left_eye_image: res.body[1][0].left_eye_image,
            right_eye_image: res.body[1][0].right_eye_image,
            left_diabetic_retinography_stage: left_diabetic_retinography_stage,
            left_diabetic_retinography_prob: left_diabetic_retinography_prob,
            right_diabetic_retinography_stage:
              right_diabetic_retinography_stage,
            right_diabetic_retinography_prob: right_diabetic_retinography_prob,
            left_ocular_prob: left_ocular_prob,
            right_ocular_prob: right_ocular_prob,
            left_glaucoma_prob: left_glaucoma_prob,
            right_glaucoma_prob: right_glaucoma_prob,
            doctor_notes: doctor_notes,
            report_link: res.body[1][0].report_link,
            version: 1,
            id: 1,
            visit_date: expect.anything(),
          },
        ],
      };
      expect(res.body).toMatchObject(expectedHistory);
      const patientHistory = await PatientHistory.findAll({
        where: {
          id: 1,
        },
      });
      expect(patientHistory).toMatchObject(expectedHistory[1]);
      expect(res.body[1][0].visit_date).toMatch("+08:00");
    });
    test("Should return 200 and return history in UTC if no timezone specified", async () => {
      const res = await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(res.body[1][0].visit_date).toMatch("+00:00");
    });
    test("Should return 400 if timezone is not valid", async () => {
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Wakanda" })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 401 if no access token provided", async () => {
      await request(app)
        .get("/api/v1/patient-history")
        .query({ timezone: "Asia/Singapore" })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
