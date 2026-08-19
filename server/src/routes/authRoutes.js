const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const normalizeIp = require("../middleware/rateLimit/normalizeIp");
const {
  loginRateLimiter,
  refreshTokenRateLimiter,
  forgotPasswordRateLimiter,
  resendVerificationRateLimiter,
} = require("../middleware/rateLimit/authRateLimiter.js");
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
  normalizeIp,
  resendVerificationRateLimiter,
  validate(resendVerificationSchema),
  authControllers.resendVerificationEmail,
);

router.post(
  "/forgot-password",
  normalizeIp,
  forgotPasswordRateLimiter,
  validate(forgotPasswordSchema),
  authControllers.forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authControllers.resetPassword,
);

router.post(
  "/login",
  normalizeIp,
  loginRateLimiter,
  validate(loginSchema),
  authControllers.loginUser,
);

router.post("/refresh-token", normalizeIp, refreshTokenRateLimiter, authControllers.refreshToken);

router.get("/profile", authMiddleware, authControllers.getProfile);

router.post("/logout", authControllers.logoutUser);

module.exports = router;
