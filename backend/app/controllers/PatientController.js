const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Patient = require("../models/Patient");
const PatientHistory = require("../models/PatientHistory");
const Doctor = require("../models/Doctor");

exports.test = async (req, res, next) => {
  const newPatient = await Patient.create();
  const patient = await Patient.findOne({ where: { id: 1 } });
  res.send(patient);
};
