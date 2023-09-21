const setUpTestDB = require("../utils/setUpTestDB");
const User = require("../../app/models/User");
const request = require("supertest");
const app = require("../../appconfig");
const httpStatus = require("http-status");

setUpTestDB();

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/register", () => {
    let newUser;
    let timezone;
    let token;
    beforeEach(() => {
      newUser = {
        username: "testinguser1",
        password: "testingpassword2",
      };
      timezone = "Asia/Singapore";
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.CREATED);
      expect(res.body.user).not.toHaveProperty("password");
      expect(res.body.user).toEqual({
        id: expect.anything(),
        username: newUser.username,
        password: newUser.password,
      });
      const dbUser = await User.findOne({ where: { id: res.body.user.id } });
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        username: newUser.username,
        id: res.body.user.id,
      });
    });
  });
});
