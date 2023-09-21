const User = require("../../../app/models/User");

describe("User Model", () => {
  describe("User validation", () => {
    let newUser;
    let username = "testuser@1234";
    let password = "testpasswor@Dd1234";
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
      newUser.set("username", "abcd");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if username has spaces", async () => {
      newUser.set("username", "abcD@1 2345");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if password is not a string", async () => {
      newUser.set("password", 12345);
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if length of password is less than 8", async () => {
      newUser.set("password", "abcD@5");
      await expect(newUser.validate()).rejects.toThrow();
    });

    test("should throw validation error if password has spaces", async () => {
      newUser.set("password", "abcD@5 234");
      await expect(newUser.validate()).rejects.toThrow();
    });
    test("should throw validation error if password has no lower space character", async () => {
      newUser.set("password", "ABC@123MMM");
      await expect(newUser.validate()).rejects.toThrow();
    });
    test("should throw validation error if password has no upper space character", async () => {
      newUser.set("password", "abc@123mmm");
      await expect(newUser.validate()).rejects.toThrow();
    });
    test("should throw validation error if password has no number", async () => {
      newUser.set("password", "abc@mMMmmm");
      await expect(newUser.validate()).rejects.toThrow();
    });
    test("should throw validation error if password has no special character", async () => {
      newUser.set("password", "123Mxmxmmx1");
      await expect(newUser.validate()).rejects.toThrow();
    });
  });
});
