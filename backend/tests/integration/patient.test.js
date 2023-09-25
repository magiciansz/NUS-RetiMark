const setUpTestDB = require("../utils/setUpTestDB");
const Patient = require("../../app/models/Patient");
const request = require("supertest");
const app = require("../../appconfig");
const httpStatus = require("http-status");
const PatientHistory = require("../../app/models/PatientHistory");
const s3 = require("../../app/helpers/AwsUtil");
const path = require("path");
const User = require("../../app/models/User");
const moment = require("moment-timezone");
const TokenService = require("../../app/services/TokenService");
const { tokenTypes } = require("../../config/tokens");

setUpTestDB();

describe("Patient Routes", () => {
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
  });
  describe("POST /api/v1/patient", () => {
    test("should return 201 and successfully register user if request data is ok, with visit_date in default timezone", async () => {
      const res = await request(app)
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      const ageDate = new Date(Date.now() - new Date(date_of_birth));
      const createdPatient = {
        name: name,
        date_of_birth: date_of_birth,
        sex: sex,
        age: Math.abs(ageDate.getUTCFullYear() - 1970),
        left_eye_image: res.body.patient.left_eye_image,
        right_eye_image: res.body.patient.right_eye_image,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
        report_link: res.body.patient.report_link,
        version: 1,
        id: expect.anything(),
        visit_date: expect.anything(),
      };
      expect(res.body.patient).toMatchObject(createdPatient);
      const left_eye_image_url = await s3.getSignedUrl("getObject", {
        Key: res.body.patient.left_eye_image,
      });
      expect(left_eye_image_url).toBeDefined();
      const right_eye_image_url = await s3.getSignedUrl("getObject", {
        Key: res.body.patient.right_eye_image,
      });
      expect(right_eye_image_url).toBeDefined();
      const pdf_report_link = await s3.getSignedUrl("getObject", {
        Key: res.body.patient.report_link,
      });
      expect(pdf_report_link).toBeDefined();

      const addedPatient = await Patient.findOne({
        where: { id: res.body.patient.id },
      });
      expect(addedPatient).toMatchObject(createdPatient);
      expect(res.body.patient.visit_date).toMatch("+00:00");

      const patientHistory = await PatientHistory.findOne({
        where: {
          id: res.body.patient.id,
          version: res.body.patient.version,
        },
      });
      expect(patientHistory).toMatchObject(createdPatient);
    });

    test("should return 201 and successfully register user if request data is ok, with visit_date in specified timezone", async () => {
      const res = await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      const ageDate = new Date(Date.now() - new Date(date_of_birth));
      const createdPatient = {
        name: name,
        date_of_birth: date_of_birth,
        sex: sex,
        age: Math.abs(ageDate.getUTCFullYear() - 1970),
        left_eye_image: res.body.patient.left_eye_image,
        right_eye_image: res.body.patient.right_eye_image,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
        report_link: res.body.patient.report_link,
        version: 1,
        id: expect.anything(),
        visit_date: expect.anything(),
      };
      expect(res.body.patient).toMatchObject(createdPatient);
      const addedPatient = await Patient.findOne({
        where: { id: res.body.patient.id },
      });
      expect(addedPatient).toMatchObject(createdPatient);
      expect(res.body.patient.visit_date).toMatch("+08:00");
      const patientHistory = await PatientHistory.findOne({
        where: {
          id: res.body.patient.id,
          version: res.body.patient.version,
        },
      });
      expect(patientHistory).toMatchObject(createdPatient);
    });
    test("should return 400 if timezone specified is invalid", async () => {
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Wakanda" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if name is empty", async () => {
      delete patient["name"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 if access token is not attached", async () => {
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 if access token is not valid", async () => {
      const expiry = moment().subtract(
        process.env.TOKEN_ACCESS_EXPIRATION_MINUTES,
        "minutes"
      );
      const newAccessToken = TokenService.generateToken(
        user.id,
        expiry,
        tokenTypes.ACCESS
      );
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${newAccessToken}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 400 if date_of_birth is empty", async () => {
      delete patient["date_of_birth"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if date_of_birth is not in a date format", async () => {
      patient.date_of_birth = "199402223";
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if date_of_birth is not a valid date", async () => {
      patient.date_of_birth = "2099-05-01";
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if sex is empty", async () => {
      delete patient["sex"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if sex is invalid", async () => {
      patient.sex = "They";
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_eye_image is empty", async () => {
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_eye_image is empty", async () => {
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
        .attach(
          "left_eye_image",
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if report_pdf is empty", async () => {
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
        .attach(
          "right_eye_image",
          path.join(__dirname, "..", "files", "react.png")
        )
        .attach(
          "left_eye_image",
          path.join(__dirname, "..", "files", "docker.jpeg")
        )
        .field(patient)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_diabetic_retinography_stage is empty", async () => {
      delete patient["left_diabetic_retinography_stage"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_diabetic_retinography_stage is not a valid value between 0 and 4", async () => {
      patient.left_diabetic_retinography_stage = 5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_diabetic_retinography_prob is empty", async () => {
      delete patient["left_diabetic_retinography_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_diabetic_retinography_prob is not a valid value between 0 and 1", async () => {
      patient.left_diabetic_retinography_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_diabetic_retinography_stage is empty", async () => {
      delete patient["right_diabetic_retinography_stage"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_diabetic_retinography_stage is not a valid value between 0 and 4", async () => {
      patient.right_diabetic_retinography_stage = 5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_diabetic_retinography_prob is empty", async () => {
      delete patient["right_diabetic_retinography_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_diabetic_retinography_prob is not a valid value between 0 and 1", async () => {
      patient.right_diabetic_retinography_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_ocular_prob is empty", async () => {
      delete patient["left_ocular_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_ocular_prob is not a valid value between 0 and 1", async () => {
      patient.left_ocular_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_ocular_prob is empty", async () => {
      delete patient["right_ocular_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_ocular_prob is not a valid value between 0 and 1", async () => {
      patient.right_ocular_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_glaucoma_prob is empty", async () => {
      delete patient["left_glaucoma_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if left_glaucoma_prob is not a valid value between 0 and 1", async () => {
      patient.left_glaucoma_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_glaucoma_prob is empty", async () => {
      delete patient["right_glaucoma_prob"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if right_glaucoma_prob is not a valid value between 0 and 1", async () => {
      patient.right_glaucoma_prob = 1.5;
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if doctor_notes is empty", async () => {
      delete patient["doctor_notes"];
      await request(app)
        .post("/api/v1/patient")
        .query({ timezone: "Asia/Singapore" })
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
