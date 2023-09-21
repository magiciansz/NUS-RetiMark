const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
const { tokenTypes } = require("../../config/tokens");

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserTbl",
        key: "id",
      },
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: [tokenTypes.ACCESS, tokenTypes.REFRESH],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    tableName: "TokenTbl",
  }
);

module.exports = Token;
