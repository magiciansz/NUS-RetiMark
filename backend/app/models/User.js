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
    },
    username: {
      type: DataTypes.STRING,
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
