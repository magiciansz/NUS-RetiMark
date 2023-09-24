const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const afterCreateUpdateHandler = async (record, transaction) => {
  await sequelize.models.PatientHistory.create(
    {
      id: record.id,
      version: record.version,
      name: record.name,
      age: record.age,
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
      doctor_notes: record.doctor_notes,
      report_link: record.report_link,
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
      defaultValue: 0,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          format: "YYYY-MM-DD",
          strictMode: true,
        },
        isBeforeToday(date) {
          if (new Date(date) >= new Date()) {
            throw new Error("The date must be before today.");
          }
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
    },
    sex: {
      type: DataTypes.ENUM,
      values: ["M", "F"],
      validate: {
        isValidGender(gender) {
          if (!((gender === "M") | (gender === "F"))) {
            throw new Error("The gender is not valid.");
          }
        },
      },
    },
    left_eye_image: {
      type: DataTypes.STRING,
      isURL: {
        require_tld: false,
      },
    },
    right_eye_image: {
      type: DataTypes.STRING,
      isURL: {
        require_tld: false,
      },
    },
    left_diabetic_retinography_stage: {
      type: DataTypes.TINYINT,
      validate: {
        isInt: {
          min: 0,
          max: 4,
        },
      },
    },
    left_diabetic_retinography_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_diabetic_retinography_stage: {
      type: DataTypes.TINYINT,
      validate: {
        isInt: {
          min: 0,
          max: 4,
        },
      },
    },
    right_diabetic_retinography_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    left_ocular_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_ocular_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    left_glaucoma_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_glaucoma_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    doctor_notes: {
      type: DataTypes.STRING,
    },
    report_link: {
      type: DataTypes.STRING,
      validate: {
        isURL: {
          require_tld: false,
        },
      },
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
        const ageDate = new Date(Date.now() - new Date(record.date_of_birth));
        record.setDataValue("age", Math.abs(ageDate.getUTCFullYear() - 1970));
      },
      beforeCreate: async (record) => {
        const ageDate = new Date(Date.now() - new Date(record.date_of_birth));
        record.setDataValue("age", Math.abs(ageDate.getUTCFullYear() - 1970));
      },
      afterUpdate: async (record, options) => {
        const { transaction } = options;
        await afterCreateUpdateHandler(record, transaction);
      },
    },
  }
);

module.exports = Patient;
