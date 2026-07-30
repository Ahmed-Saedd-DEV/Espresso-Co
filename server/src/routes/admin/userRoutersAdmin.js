const express = require("express");
const router = express.Router();

const userControllersAdmin = require("../../controllers/admin/userControllersAdmin.js");
const authMiddleware = require("../../middleware/authMiddleware.js");
const permit = require("../../middleware/permissionMiddleware.js");
const validate = require("../../middleware/validate.js");
const {
  getAllUsersQuerySchema,
  userIdSchema,
  updateUserSchema,
} = require("../../validators/admin/user.validator.js");

router.get(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(getAllUsersQuerySchema),
  userControllersAdmin.getAllUsers,
);
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(userIdSchema),
  userControllersAdmin.getUserById,
);
router.patch(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(updateUserSchema),
  userControllersAdmin.updateUser,
);
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  userControllersAdmin.deleteUser,
);

module.exports = router;
