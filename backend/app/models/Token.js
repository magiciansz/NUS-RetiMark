const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
const { tokenTypes } = require("../../config/tokens");

const Token = sequelize.define(
  "Token",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
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
    timestamps: true,
  }
);

module.exports = Token;
