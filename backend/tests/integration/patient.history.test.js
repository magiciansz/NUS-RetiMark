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
  let createdPatient;
  let name = "Tan Jun Jie";
  let date_of_birth = "1999-05-08";
  let sex = "M";
  let left_diabetic_retinopathy_prob = 0.5;
  let right_diabetic_retinopathy_prob = 0.5;
  let left_ocular_prob = 0.5;
  let right_ocular_prob = 0.5;
  let left_glaucoma_prob = 0.5;
  let right_glaucoma_prob = 0.5;
  let doctor_notes = "This patient is healthy.";
  let user;
  let accessToken;
  let thresholds;
  beforeEach(async () => {
    patient = {
      name: name,
      date_of_birth: date_of_birth,
      sex: sex,
      left_diabetic_retinopathy_prob: left_diabetic_retinopathy_prob,
      right_diabetic_retinopathy_prob: right_diabetic_retinopathy_prob,
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
    thresholds = {
      ocular_lower_threshold: 0,
      ocular_upper_threshold: 1,
      glaucoma_lower_threshold: 0,
      glaucoma_upper_threshold: 1,
      diabetic_retinopathy_lower_threshold: 0,
      diabetic_retinopathy_upper_threshold: 1,
    };
    createdPatient = await request(app)
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
    test("Should return 200 and return all history if thresholds are 0-1", async () => {
      const res = await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
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
            left_diabetic_retinopathy_prob: left_diabetic_retinopathy_prob,
            right_diabetic_retinopathy_prob: right_diabetic_retinopathy_prob,
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
    test("Should return 200 and return all history in UTC if no timezone specified, if thresholds are 0-1", async () => {
      const res = await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query(thresholds)
        .expect(httpStatus.OK);
      expect(res.body[1][0].visit_date).toMatch("+00:00");
    });
    test("Should return 200 and return all history in ascending ID order, if thresholds are 0-1", async () => {
      patient.name = "Xi Gua";
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      const res = await request(app)
        .get("/api/v1/patient-history")
        .query(thresholds)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(Object.keys(res.body)).toHaveLength(2);
      expect(Object.keys(res.body)[0]).toBe("1");
      expect(Object.keys(res.body)[1]).toBe("2");
    });
    test("Should return 200 and return all history, keeping only one unique entry per date,if thresholds are 0-1", async () => {
      patient.name = "Xi Gua";
      const createdPatient = await request(app)
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
      await request(app)
        .patch(`/api/v1/patient/${createdPatient.body.patient.id}`)
        .attach(
          "left_eye_image",
          path.join(__dirname, "..", "files", "testimage1.jpeg")
        )
        .attach(
          "right_eye_image",
          path.join(__dirname, "..", "files", "testimage2.jpeg")
        )
        .attach(
          "report_pdf",
          path.join(__dirname, "..", "files", "testpdf.pdf")
        )
        .field(patient)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      const res = await request(app)
        .get("/api/v1/patient-history")
        .query(thresholds)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(Object.keys(res.body)).toHaveLength(2);
      expect(Object.keys(res.body)[0]).toBe("1");
      expect(Object.keys(res.body)[1]).toBe("2");
      expect(res.body[2]).toHaveLength(1);
      expect(res.body[2][0].version).toBe(2);
    });
    test("Should return 200 and only patients with a threshold within any given thresholds", async () => {
      patient.name = "Xi Gua";
      patient.left_diabetic_retinopathy_prob = 0.1;
      patient.right_diabetic_retinopathy_prob = 0.1;
      patient.left_glaucoma_prob = 0.1;
      patient.right_glaucoma_prob = 0.1;
      patient.left_ocular_prob = 0.1;
      patient.right_ocular_prob = 0.1;
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      thresholds = {
        ocular_lower_threshold: 0.05,
        ocular_upper_threshold: 0.2,
        glaucoma_lower_threshold: 0.05,
        glaucoma_upper_threshold: 0.2,
        diabetic_retinopathy_lower_threshold: 0.05,
        diabetic_retinopathy_upper_threshold: 0.2,
      };
      const res = await request(app)
        .get("/api/v1/patient-history")
        .query(thresholds)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(Object.keys(res.body)).toHaveLength(1);
      expect(Object.keys(res.body)[0]).toBe("2");
    });
    test("Should return 200 and patients, even if these patients only have 1 matching threshold", async () => {
      patient.name = "Xi Gua";
      patient.left_diabetic_retinopathy_prob = 0.1;
      patient.right_diabetic_retinopathy_prob = 1;
      patient.left_glaucoma_prob = 1;
      patient.right_glaucoma_prob = 1;
      patient.left_ocular_prob = 1;
      patient.right_ocular_prob = 1;
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      thresholds = {
        ocular_lower_threshold: 0.05,
        ocular_upper_threshold: 0.2,
        glaucoma_lower_threshold: 0.05,
        glaucoma_upper_threshold: 0.2,
        diabetic_retinopathy_lower_threshold: 0.05,
        diabetic_retinopathy_upper_threshold: 0.2,
      };
      const res = await request(app)
        .get("/api/v1/patient-history")
        .query(thresholds)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(Object.keys(res.body)).toHaveLength(1);
      expect(Object.keys(res.body)[0]).toBe("2");
    });
    test("Should return 200 and an empty result, if patients dont meet any of the thresholds", async () => {
      patient.name = "Xi Gua";
      patient.left_diabetic_retinopathy_prob = 1;
      patient.right_diabetic_retinopathy_prob = 1;
      patient.left_glaucoma_prob = 1;
      patient.right_glaucoma_prob = 1;
      patient.left_ocular_prob = 1;
      patient.right_ocular_prob = 1;
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
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.CREATED);
      thresholds = {
        ocular_lower_threshold: 0.05,
        ocular_upper_threshold: 0.2,
        glaucoma_lower_threshold: 0.05,
        glaucoma_upper_threshold: 0.2,
        diabetic_retinopathy_lower_threshold: 0.05,
        diabetic_retinopathy_upper_threshold: 0.2,
      };
      const res = await request(app)
        .get("/api/v1/patient-history")
        .query(thresholds)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(Object.keys(res.body)).toHaveLength(0);
    });
    test("Should return 400 if timezone is not valid", async () => {
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Wakanda", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if ocular_lower_threshold is not included", async () => {
      delete thresholds["ocular_lower_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if ocular_lower_threshold is not valid", async () => {
      thresholds.ocular_lower_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if ocular_upper_threshold is not included", async () => {
      delete thresholds["ocular_upper_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if ocular_upper_threshold is not valid", async () => {
      thresholds.ocular_upper_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if glaucoma_lower_threshold is not included", async () => {
      delete thresholds["glaucoma_lower_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if glaucoma_lower_threshold is not valid", async () => {
      thresholds.glaucoma_lower_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if glaucoma_upper_threshold is not included", async () => {
      delete thresholds["glaucoma_upper_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if glaucoma_upper_threshold is not valid", async () => {
      thresholds.glaucoma_upper_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if diabetic_retinopathy_lower_threshold is not included", async () => {
      delete thresholds["diabetic_retinopathy_lower_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if diabetic_retinopathy_lower_threshold is not valid", async () => {
      thresholds.diabetic_retinopathy_lower_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if diabetic_retinopathy_upper_threshold is not included", async () => {
      delete thresholds["diabetic_retinopathy_upper_threshold"];
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 400 if diabetic_retinopathy_upper_threshold is not valid", async () => {
      thresholds.diabetic_retinopathy_upper_threshold = 1.5;
      await request(app)
        .get("/api/v1/patient-history")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .expect(httpStatus.BAD_REQUEST);
    });
    test("Should return 401 if no access token provided", async () => {
      await request(app)
        .get("/api/v1/patient-history")
        .query({ timezone: "Asia/Singapore", ...thresholds })
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
        .get("/api/v1/patient-history")
        .query({ timezone: "Asia/Singapore", ...thresholds })
        .set("Authorization", `Bearer ${newAccessToken}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
  describe("GET /api/v1/patient-history/:id/reports", () => {
    test("should return 200 and a report, in specified timezone", async () => {
      const res = await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "descending" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.reports).toHaveLength(1);
      expect(res.body.reports[0]).toMatchObject({
        version: createdPatient.body.patient.version,
        doctor_notes: createdPatient.body.patient.doctor_notes,
        report_link: createdPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
      expect(res.body.reports[0].visit_date).toMatch("+08:00");
    });
    test("should return 200 and a report, in UTC if no timezone is given", async () => {
      const res = await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ sort: "descending" })
        .expect(httpStatus.OK);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.reports).toHaveLength(1);
      expect(res.body.reports[0]).toMatchObject({
        version: createdPatient.body.patient.version,
        doctor_notes: createdPatient.body.patient.doctor_notes,
        report_link: createdPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
      expect(res.body.reports[0].visit_date).toMatch("+00:00");
    });
    test("should return 200 and 2 reports after a PATCH action, sorted by descending time", async () => {
      const updatedPatient = await request(app)
        .patch(`/api/v1/patient/${createdPatient.body.patient.id}`)
        .query({ timezone: "Asia/Singapore" })
        .attach(
          "left_eye_image",
          path.join(__dirname, "..", "files", "testimage1.jpeg")
        )
        .attach(
          "right_eye_image",
          path.join(__dirname, "..", "files", "testimage2.jpeg")
        )
        .attach(
          "report_pdf",
          path.join(__dirname, "..", "files", "testpdf.pdf")
        )
        .field(patient)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      const res = await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "descending" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(res.body.totalCount).toBe(2);
      expect(res.body.reports).toHaveLength(2);
      expect(res.body.reports[0].version).toBeGreaterThan(
        res.body.reports[1].version
      );
      expect(res.body.reports[1]).toMatchObject({
        version: createdPatient.body.patient.version,
        doctor_notes: createdPatient.body.patient.doctor_notes,
        report_link: createdPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
      expect(res.body.reports[0]).toMatchObject({
        version: updatedPatient.body.patient.version,
        doctor_notes: updatedPatient.body.patient.doctor_notes,
        report_link: updatedPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
    });
    test("should return 200 and 2 reports after a PATCH action, sorted by ascending time", async () => {
      const updatedPatient = await request(app)
        .patch(`/api/v1/patient/${createdPatient.body.patient.id}`)
        .query({ timezone: "Asia/Singapore" })
        .attach(
          "left_eye_image",
          path.join(__dirname, "..", "files", "testimage1.jpeg")
        )
        .attach(
          "right_eye_image",
          path.join(__dirname, "..", "files", "testimage2.jpeg")
        )
        .attach(
          "report_pdf",
          path.join(__dirname, "..", "files", "testpdf.pdf")
        )
        .field(patient)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      const res = await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "ascending" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.OK);
      expect(res.body.totalCount).toBe(2);
      expect(res.body.reports).toHaveLength(2);
      expect(res.body.reports[1].version).toBeGreaterThan(
        res.body.reports[0].version
      );
      expect(res.body.reports[0]).toMatchObject({
        version: createdPatient.body.patient.version,
        doctor_notes: createdPatient.body.patient.doctor_notes,
        report_link: createdPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
      expect(res.body.reports[1]).toMatchObject({
        version: updatedPatient.body.patient.version,
        doctor_notes: updatedPatient.body.patient.doctor_notes,
        report_link: updatedPatient.body.patient.report_link,
        visit_date: expect.anything(),
      });
    });
    test("should return 400 if sort order is not given", async () => {
      await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if sort order is not valid", async () => {
      await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "wakanda" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 if timezone is not valid", async () => {
      await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Wakanda", sort: "ascending" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 401 if access token is not attached", async () => {
      await request(app)
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "ascending" })
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
        .get(
          `/api/v1/patient-history/${createdPatient.body.patient.id}/reports`
        )
        .query({ timezone: "Asia/Singapore", sort: "ascending" })
        .set("Authorization", `Bearer ${newAccessToken}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
    test("should return 404 if user isn't found", async () => {
      await request(app)
        .get(`/api/v1/patient-history/100/reports`)
        .query({ timezone: "Asia/Singapore", sort: "ascending" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
