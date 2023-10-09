const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const auth = require("../app/middlewares/auth");

const {
  validateUserDetails,
  validateUserId,
} = require("../app/middlewares/validators/UserValidator");

// for testing + admin users (if the need ever arises)

router.route("/").post(auth(), validateUserDetails, userController.createUser);
router
  .route("/:userId")
  .get(validateUserId, userController.getUser)
  .patch(validateUserDetails, userController.updateUser)
  .delete(validateUserId, userController.deleteUser);
module.exports = router;
