const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/user/auth.validator.js");

router.post(
  "/register",
  validate(registerSchema),
  authControllers.registerUser,
);

router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  authControllers.verifyEmail,
);

router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  authControllers.resendVerificationEmail,
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authControllers.forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authControllers.resetPassword,
);

router.post("/login", validate(loginSchema), authControllers.loginUser);

router.post("/refresh-token", authControllers.refreshToken);

router.get("/profile", authMiddleware, authControllers.getProfile);

router.post("/logout", authControllers.logoutUser);

module.exports = router;
