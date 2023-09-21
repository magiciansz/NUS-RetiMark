const Token = require("../../app/models/Token");
const sequelize = require("../../config/database");

const setupTestDB = () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
