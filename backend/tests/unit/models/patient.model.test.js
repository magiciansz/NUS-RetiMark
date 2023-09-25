const { Sequelize } = require("sequelize");
const Patient = require("../../../app/models/Patient");

describe("Patient Model", () => {
  describe("Patient validation", () => {
    let patient;
    let name = "Tan Jun Jie";
    let date_of_birth = "1999-05-08";
    let sex = "M";
    let left_eye_image = "tests3bucket.com";
    let right_eye_image = "tests3bucket.com";
    let left_diabetic_retinography_stage = 1;
    let left_diabetic_retinography_prob = 0.56;
    let right_diabetic_retinography_stage = 3;
    let right_diabetic_retinography_prob = 0.11;
    let left_ocular_prob = 0.25;
    let right_ocular_prob = 0.05;
    let left_glaucoma_prob = 0.36;
    let right_glaucoma_prob = 0.55;
    let doctor_notes = "This patient is healthy.";
    let report_link = "testreportlink.com";
    beforeEach(async () => {
      patient = await Patient.build({
        name: name,
        date_of_birth: date_of_birth,
        sex: sex,
        left_eye_image: left_eye_image,
        right_eye_image: right_eye_image,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
        report_link: report_link,
      });
    });

    test("should correctly validate a valid patient", async () => {
      const expectedValidUser = {
        id: null,
        name: name,
        date_of_birth: date_of_birth,
        sex: sex,
        left_eye_image: left_eye_image,
        right_eye_image: right_eye_image,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
        report_link: report_link,
        visit_date: Sequelize.fn("NOW"),
        version: 0,
      };
      await expect(patient.validate()).resolves.toMatchObject(
        expectedValidUser
      );
    });

    test("should correctly validate a patient without report_link, left_eye_image and right_eye_image", async () => {
      const editedPatient = await Patient.build({
        date_of_birth: date_of_birth,
        sex: sex,
        name: name,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
      });
      const expectedValidUser = {
        id: null,
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
        visit_date: Sequelize.fn("NOW"),
        version: 0,
      };
      await expect(editedPatient.validate()).resolves.toMatchObject(
        expectedValidUser
      );
    });

    test("should throw validation error if name is not included when creating Patient", async () => {
      const editedPatient = await Patient.build({
        date_of_birth: date_of_birth,
        sex: sex,
        left_eye_image: left_eye_image,
        right_eye_image: right_eye_image,
        left_diabetic_retinography_stage: left_diabetic_retinography_stage,
        left_diabetic_retinography_prob: left_diabetic_retinography_prob,
        right_diabetic_retinography_stage: right_diabetic_retinography_stage,
        right_diabetic_retinography_prob: right_diabetic_retinography_prob,
        left_ocular_prob: left_ocular_prob,
        right_ocular_prob: right_ocular_prob,
        left_glaucoma_prob: left_glaucoma_prob,
        right_glaucoma_prob: right_glaucoma_prob,
        doctor_notes: doctor_notes,
        report_link: report_link,
      });
      await expect(editedPatient.validate()).rejects.toThrow();
    });

    test("should throw validation error if date of birth is not in correct format", async () => {
      patient.set("date_of_birth", "1999/03/1223");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if date of birth is after today", async () => {
      patient.set("date_of_birth", "2099/05/06");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if gender is not male or female", async () => {
      patient.set("sex", "They");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if left_diabetic_retinography_stage is not between 0 to 4", async () => {
      patient.set("left_diabetic_retinography_stage", "5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if left_diabetic_retinography_stage is not an integer", async () => {
      patient.set("left_diabetic_retinography_stage", "3.53");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if left_diabetic_retinography_prob is not a probability between 0 to 1", async () => {
      patient.set("left_diabetic_retinography_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if right_diabetic_retinography_stage is not between 0 to 4", async () => {
      patient.set("right_diabetic_retinography_stage", "5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if right_diabetic_retinography_stage is not an integer", async () => {
      patient.set("right_diabetic_retinography_stage", "3.53");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if right_diabetic_retinography_prob is not a probability between 0 to 1", async () => {
      patient.set("right_diabetic_retinography_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if left_ocular_prob is not a probability between 0 to 1", async () => {
      patient.set("left_ocular_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if right_ocular_prob is not a probability between 0 to 1", async () => {
      patient.set("right_ocular_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });
    test("should throw validation error if left_glaucoma_prob is not a probability between 0 to 1", async () => {
      patient.set("left_glaucoma_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });
    test("should throw validation error if right_glaucoma_prob is not a probability between 0 to 1", async () => {
      patient.set("right_glaucoma_prob", "1.5");
      await expect(patient.validate()).rejects.toThrow();
    });

    test("should throw validation error if left_eye_image is not a URL", async () => {
      patient.set("left_eye_image", "/relative/path");
      await expect(patient.validate()).rejects.toThrow();
    });
    test("should throw validation error if right_eye_image is not a URL", async () => {
      patient.set("right_eye_image", "/relative/path");
      await expect(patient.validate()).rejects.toThrow();
    });
    test("should throw validation error if report_link is not a URL", async () => {
      patient.set("report_link", "/relative/path");
      await expect(patient.validate()).rejects.toThrow();
    });
  });
});
