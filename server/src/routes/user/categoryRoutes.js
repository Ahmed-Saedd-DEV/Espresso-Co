const express = require("express");
const router = express.Router();

const categoryControllers = require("../../controllers/users/categoryControllers");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", categoryControllers.getCategories);
router.get("/:id", categoryControllers.getCategoryById);

module.exports = router;
