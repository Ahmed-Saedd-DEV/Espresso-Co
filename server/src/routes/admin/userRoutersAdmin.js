const express = require("express");
const router = express.Router();

const userControllersAdmin = require("../../controllers/admin/userControllersAdmin.js");
const authMiddleware = require("../../middleware/authMiddleware.js");
const permit = require("../../middleware/permissionMiddleware.js");

router.get(
  "/",
  authMiddleware,
  permit("ADMIN"),
  userControllersAdmin.getAllUsers,
);
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  userControllersAdmin.getUserById,
);
router.patch(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  userControllersAdmin.updateUser,
);
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  userControllersAdmin.deleteUser,
);
