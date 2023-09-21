const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isLength: {
          args: [8],
          msg: "password has to be a length of at least 8 characters or numbers.",
        },
        noSpaces(password) {
          if (password.indexOf(" ") >= 0) {
            throw new Error("password cannot have blank spaces.");
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        isLength: {
          args: [8],
          msg: "username has to be a length of at least 8 characters or numbers.",
        },
        noSpaces(username) {
          if (username.indexOf(" ") >= 0) {
            throw new Error("username cannot have blank spaces.");
          }
        },
      },
    },
  },
  {
    tableName: "UserTbl",
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },
    hooks: {
      beforeCreate: async (record) => {
        record.setDataValue(
          "password",
          await bcrypt.hash(record.dataValues.password, 8)
        );
      },
      beforeUpdate: async (record) => {
        record.setDataValue(
          "password",
          await bcrypt.hash(record.dataValues.password, 8)
        );
      },
    },
  }
);

User.prototype.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

User.isUsernameTaken = async function (username) {
  const user = await User.findOne({ where: { username: username } });
  return user !== null;
};

module.exports = User;
