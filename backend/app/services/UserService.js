const httpStatus = require("http-status");
const User = require("../models/User");
const ApiError = require("../middlewares/ApiError");

const createUser = async (userBody) => {
  const user = await User.findOne({ where: { username: userBody.username } });
  if (user !== null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  await User.create(userBody);
  return await User.findOne({ where: { username: userBody.username } });
};

const getUserById = async (id) => {
  const user = User.findOne({ where: { id: id } });
  if (user === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// boolean passed in to return password if needed
const getUserByUsername = async (username, includePassword = false) => {
  if (includePassword) {
    return await User.findOne({
      where: { username: username },
      attributes: ["id", "username", "password"],
    });
  }
  return await User.findOne({ where: { username: username } });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (await User.isUsernameTaken(updateBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  user.set(updateBody);
  await user.save();
  return await getUserById(userId);
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  deleteUserById,
  updateUserById,
};
