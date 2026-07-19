const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authControllers.registerUser);
router.get("/verify-email", authControllers.verifyEmail);
router.post(
  "/resend-verification",
  authMiddleware,
  authControllers.resendVerificationEmail,
);
router.post("/login", authControllers.loginUser);
router.post("/refresh-token", authControllers.refreshToken);
router.get("/profile", authMiddleware, authControllers.getProfile);
router.get("/logout", authMiddleware, authControllers.logoutUser);

module.exports = router;
