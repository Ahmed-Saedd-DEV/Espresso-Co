const createRateLimiter = require("./createRateLimiter");

const loginRateLimiter = createRateLimiter({
  prefix: "login_rate_limit",
  capacity: 5,
  refillInterval: 60,
  ttl: 3600,
});

const refreshTokenRateLimiter = createRateLimiter({
  prefix: "refresh_token_rate_limit",
  capacity: 5,
  refillInterval: 60,
  ttl: 3600,
});

const forgotPasswordRateLimiter = createRateLimiter({
  prefix: "forgot_password_rate_limit",
  capacity: 5,
  refillInterval: 60,
  ttl: 3600,
});

const resendVerificationRateLimiter = createRateLimiter({
  prefix: "resend_verification_rate_limit",
  capacity: 5,
  refillInterval: 60,
  ttl: 3600,
});

module.exports = {
  loginRateLimiter,
  refreshTokenRateLimiter,
  forgotPasswordRateLimiter,
  resendVerificationRateLimiter,
};