const User = require("../../../app/models/User");

describe("User Model", () => {
  describe("User validation", () => {
    let newUser;
    let username = "testuser1234";
    let password = "testpassword1234";
    beforeEach(async () => {
      newUser = await User.build({
        username: username,
        password: password,
      });
    });

    test("should correctly validate a valid user", async () => {
      const expectedValidUser = {
        id: null,
        username: username,
        password: password,
      };
      await expect(newUser.validate()).resolves.toMatchObject(
        expectedValidUser
      );
    });

    test("should throw validation error if username is not a string", async () => {
      newUser.set("username", 12345);
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if length of username is less than 8", async () => {
      newUser.set("username", "12345");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if username has spaces", async () => {
      newUser.set("username", "1234 5678");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if password is not a string", async () => {
      newUser.set("password", 12345);
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if length of password is less than 8", async () => {
      newUser.set("password", "12345");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if password has spaces", async () => {
      newUser.set("password", "1234 5678");
      await expect(newUser.validate()).rejects.toThrow();
    });
  });
});
