const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "DoctorTbl",
  }
);

module.exports = Doctor;
