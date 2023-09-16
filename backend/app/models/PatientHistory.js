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
    date_of_birth: {
      type: DataTypes.DATEONLY,
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
    left_diabetic_retinography_stage: {
      type: DataTypes.TINYINT,
    },
    left_diabetic_retinography_prob: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage: {
      type: DataTypes.TINYINT,
    },
    right_diabetic_retinography_prob: {
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
