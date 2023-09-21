const setUpTestDB = require("../utils/setUpTestDB");
const User = require("../../app/models/User");
const Token = require("../../app/models/Token");
const request = require("supertest");
const app = require("../../appconfig");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const TokenService = require("../../app/services/TokenService");
const { tokenTypes } = require("../../config/tokens");

setUpTestDB();

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/register", () => {
    let newUser;
    let timezone;
    beforeEach(() => {
      newUser = {
        username: "testinguser",
        password: "mMM@123455",
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
      });
      const dbUser = await User.findOne({ where: { id: res.body.user.id } });
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        username: newUser.username,
        id: res.body.user.id,
      });
      expect(res.body.tokens).toEqual({
        accessToken: { token: expect.anything(), expires: expect.anything() },
        refreshToken: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test("should return 400 error if username is empty", async () => {
      newUser.username = "";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if username is not a string", async () => {
      newUser.username = 123456790;

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if username is less than 8 characters", async () => {
      newUser.username = "123456";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if username has a space", async () => {
      newUser.username = "123456 2323";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is empty", async () => {
      newUser.password = "";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is not a string", async () => {
      newUser.password = 123456790;

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is less than 8 characters", async () => {
      newUser.password = "Aa@123";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password has a space", async () => {
      newUser.password = "Aa@123 2322";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password has no lowercase letter", async () => {
      newUser.password = "AA@1232322";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 error if password has no uppercase letter", async () => {
      newUser.password = "aa@1232322";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password has no number", async () => {
      newUser.password = "aA@AaAaaA";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
    test("should return 400 error if password has no special character", async () => {
      newUser.password = "aA123Aaaa";

      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 409 error if username already exists", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.CREATED);
      const nextUser = {
        username: "testinguser",
        password: "mMmm@123PP",
      };
      await request(app)
        .post("/api/v1/auth/register")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.CONFLICT);
    });
  });

  describe("POST /auth/v1/auth/login", () => {
    let newUser;
    let timezone;
    beforeEach(() => {
      newUser = {
        username: "testinguser",
        password: "mMM@123455",
      };
      timezone = "Asia/Singapore";
    });
    test("should return 200 and login user if email and password match", async () => {
      await User.create(newUser);
      const loginCredentials = {
        username: newUser.username,
        password: newUser.password,
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginCredentials)
        .query({ timezone: timezone })
        .expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        username: newUser.username,
      });

      expect(res.body.tokens).toEqual({
        accessToken: { token: expect.anything(), expires: expect.anything() },
        refreshToken: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test("should return 400 error if username is empty", async () => {
      newUser.username = "";

      await request(app)
        .post("/api/v1/auth/login")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if username is not a string", async () => {
      newUser.username = 123456790;

      await request(app)
        .post("/api/v1/auth/login")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is empty", async () => {
      newUser.password = "";

      await request(app)
        .post("/api/v1/auth/login")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is not a string", async () => {
      newUser.password = 123456790;

      await request(app)
        .post("/api/v1/auth/login")
        .query({ timezone: timezone })
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 error if there are no users with that email", async () => {
      const loginCredentials = {
        username: newUser.username,
        password: newUser.password,
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginCredentials)
        .query({ timezone: timezone })
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toMatchObject({
        status: httpStatus.UNAUTHORIZED,
        message: "Incorrect email or password",
      });
    });

    test("should return 401 error if password is wrong", async () => {
      await User.create(newUser);
      const loginCredentials = {
        username: newUser.username,
        password: "wrongPassword1",
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginCredentials)
        .query({ timezone: timezone })
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toMatchObject({
        status: httpStatus.UNAUTHORIZED,
        message: "Incorrect email or password",
      });
    });
  });

  describe("POST /v1/auth/logout", () => {
    let newUser;
    let timezone;
    beforeEach(() => {
      newUser = {
        username: "testinguser",
        password: "mMM@123455",
      };
      timezone = "Asia/Singapore";
    });
    test("should return 204 if refresh token is valid", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/api/v1/auth/logout")
        .send({ refreshToken: refreshToken })
        .expect(httpStatus.NO_CONTENT);

      const dbRefreshTokenDoc = await Token.findOne({ token: refreshToken });
      expect(dbRefreshTokenDoc).toBe(null);
    });

    test("should return 400 error if refresh token is missing from request body", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if refresh token is not found in the database", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/api/v1/auth/logout")
        .send({ refreshToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 404 error if refresh token is blacklisted", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH,
        true
      );

      await request(app)
        .post("/api/v1/auth/logout")
        .send({ refreshToken })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("POST /api/v1/auth/refresh-tokens", () => {
    let newUser;
    let timezone;
    beforeEach(() => {
      newUser = {
        username: "testinguser",
        password: "mMM@123455",
      };
      timezone = "Asia/Singapore";
    });
    test("should return 200 and new auth tokens if refresh token is valid", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      const res = await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send({ refreshToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        accessToken: { token: expect.anything(), expires: expect.anything() },
        refreshToken: { token: expect.anything(), expires: expect.anything() },
      });

      const dbRefreshTokenDoc = await Token.findOne({
        token: res.body.refreshToken.token,
      });
      expect(dbRefreshTokenDoc).toMatchObject({
        type: tokenTypes.REFRESH,
        user_id: user.id,
        blacklisted: false,
      });

      const dbRefreshTokenCount = await Token.count();
      expect(dbRefreshTokenCount).toBe(1);
    });

    test("should return 400 error if refresh token is missing from request body", async () => {
      await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    // if someone manages to save a token, using an invalid key
    test("should return 401 error if refresh token is signed using an invalid secret", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH,
        "invalidSecret"
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is not found in the database", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is blacklisted", async () => {
      const user = await User.create(newUser);
      const expires = moment().add(
        process.env.TOKEN_REFRESH_EXPIRATION_HOURS,
        "hours"
      );
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH,
        true
      );

      await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is expired", async () => {
      const user = await User.create(newUser);
      const expires = moment().subtract(1, "minutes");
      const refreshToken = TokenService.generateToken(
        user.id,
        expires,
        tokenTypes.REFRESH
      );
      await TokenService.saveToken(
        refreshToken,
        user.id,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/api/v1/auth/refresh-tokens")
        .query({ timezone: timezone })
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
