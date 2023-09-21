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
        hasLowerCase(password) {
          if (!/[a-z]/.test(password)) {
            throw new Error("password needs a lowercase letter");
          }
        },
        hasUpperCase(password) {
          if (!/[A-Z]/.test(password)) {
            throw new Error("password needs a uppercase letter");
          }
        },
        hasNumber(password) {
          if (!/\d/.test(password)) {
            throw new Error("password needs a number");
          }
        },
        hasSpecialCharacter(password) {
          if (!/[#.?!@$%^&*-]/.test(password)) {
            throw new Error("password needs a special character #.-?!@$%^&*");
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
      // beforeUpdate: async (record) => {
      //   record.setDataValue(
      //     "password",
      //     await bcrypt.hash(record.dataValues.password, 8)
      //   );
      // },
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
