const { Sequelize, DataTypes } = require("sequelize");
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
    left_eye_resized_image: {
      type: DataTypes.STRING,
    },
    right_eye_resized_image: {
      type: DataTypes.STRING,
    },
    left_diabetic_retinography_stage_0: {
      type: DataTypes.FLOAT,
    },
    left_diabetic_retinography_stage_1: {
      type: DataTypes.FLOAT,
    },
    left_diabetic_retinography_stage_2: {
      type: DataTypes.FLOAT,
    },
    left_diabetic_retinography_stage_3: {
      type: DataTypes.FLOAT,
    },
    left_diabetic_retinography_stage_4: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage_0: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage_1: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage_2: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage_3: {
      type: DataTypes.FLOAT,
    },
    right_diabetic_retinography_stage_4: {
      type: DataTypes.FLOAT,
    },
    left_ocular: {
      type: DataTypes.TINYINT,
    },
    right_ocular: {
      type: DataTypes.TINYINT,
    },
    left_glaucoma: {
      type: DataTypes.TINYINT,
    },
    right_glaucoma: {
      type: DataTypes.TINYINT,
    },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PatientHistoryTbl",
  }
);

module.exports = PatientHistory;
