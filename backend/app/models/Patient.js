const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const afterCreateUpdateHandler = async (record, transaction) => {
  await sequelize.models.PatientHistory.create(
    {
      id: record.id,
      version: record.version,
      date_of_birth: record.date_of_birth,
      sex: record.sex,
      left_eye_image: record.left_eye_image,
      right_eye_image: record.right_eye_image,
      left_diabetic_retinography_stage: record.left_diabetic_retinography_stage,
      left_diabetic_retinography_prob: record.left_diabetic_retinography_prob,
      right_diabetic_retinography_stage:
        record.right_diabetic_retinography_stage,
      right_diabetic_retinography_prob: record.right_diabetic_retinography_prob,
      left_ocular_prob: record.left_ocular_prob,
      right_ocular_prob: record.right_ocular_prob,
      left_glaucoma_prob: record.left_glaucoma_prob,
      right_glaucoma_prob: record.right_glaucoma_prob,
      visit_date: record.visit_date,
    },
    { transaction }
  );
};

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    tableName: "PatientTbl",
    hooks: {
      beforeUpdate: async (record) => {
        record.setDataValue("version", record.dataValues.version + 1);
        record.setDataValue("visit_date", Sequelize.fn("NOW"));
      },
      afterUpdate: async (record, options) => {
        const { transaction } = options;
        await afterCreateUpdateHandler(record, transaction);
      },
      afterCreate: async (record, options) => {
        const { transaction } = options;
        await afterCreateUpdateHandler(record, transaction);
      },
    },
  }
);

module.exports = Patient;
