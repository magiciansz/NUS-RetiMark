const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PatientHistory = sequelize.define(
  "PatientHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    sex: {
      type: DataTypes.STRING,
    },
    left_eye_image: {
      type: DataTypes.STRING,
    },
    right_eye_image: {
      type: DataTypes.STRING,
    },
    left_diabetic_retinopathy_prob: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinopathy_prob: {
      type: DataTypes.FLOAT,
    },
    left_ocular_prob: {
      type: DataTypes.FLOAT,
    },
    right_ocular_prob: {
      type: DataTypes.FLOAT,
    },
    left_glaucoma_prob: {
      type: DataTypes.FLOAT,
    },
    right_glaucoma_prob: {
      type: DataTypes.FLOAT,
    },
    doctor_notes: {
      type: DataTypes.STRING,
    },
    report_link: {
      type: DataTypes.STRING,
    },
    visit_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PatientHistoryTbl",
  }
);

module.exports = PatientHistory;
