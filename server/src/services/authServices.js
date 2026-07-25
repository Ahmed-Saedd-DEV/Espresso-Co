const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const { buildAccessTokenPayload } = require("../utils/authUtils");
const {
  createEmailVerificationToken,
} = require("../security/emailVerificationToken");
const { createPasswordResetToken } = require("../security/passwordToken");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./mail.service");

const EMAIL_VERIFICATION_ERROR_MESSAGE =
  "Invalid or expired verification token";

const buildRefreshTokenCookie = (token) => {
  const secureAttribute =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `refreshToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${secureAttribute}`;
};

const registerUser = async (userData) => {
  const { email, password, name } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const existingUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "USER",
    },
  });

  const emailVerificationToken = await createEmailVerificationToken(
    existingUser.id,
  );
  await sendVerificationEmail(existingUser.email, emailVerificationToken);

  return {
    message: "User registered successfully. Please verify your email.",
    user: { name: existingUser.name, email: existingUser.email },
  };
};

const verifyEmail = async (token) => {
  const payload = jwt.verifyEmailVerificationToken(token);
  const storedToken = await prisma.emailVerificationToken.findUnique({
    where: { userId: payload.id },
  });
  if (
    !storedToken ||
    !storedToken.expiresAt ||
    storedToken.expiresAt < new Date()
  ) {
    throw new Error("Invalid verification token");
  }
  if (!storedToken.jti || storedToken.jti !== payload.jti) {
    throw new Error("Invalid verification token");
  }
  const isMatch = await bcrypt.compare(token, storedToken.tokenHash);
  if (!isMatch) {
    throw new Error("Invalid verification token");
  }
  await prisma.user.update({
    where: { id: payload.id },
    data: { isVerified: true },
  });
  await prisma.emailVerificationToken.delete({ where: { userId: payload.id } });
  return { message: "Email verified successfully" };
};

const resendVerificationEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      message:
        "If an account exists and is not verified, a verification email has been sent.",
    };
  }
  if (user.isVerified) {
    throw new Error("Email is already verified");
  }
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });
  const emailVerificationToken = await createEmailVerificationToken(user.id);
  await sendVerificationEmail(user.email, emailVerificationToken);

  return { message: "Verification email sent successfully" };
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const passwordResetToken = await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });
  const token = await createPasswordResetToken(user.id);
  await sendPasswordResetEmail(user.email, token);
  return {
    message: "If this email exists, we have sent a password reset link.",
  };
};

const resetPassword = async (token, newPassword) => {
  const payload = jwt.verifyPasswordResetToken(token);
  const storedToken = await prisma.passwordResetToken.findUnique({
    where: { userId: payload.id },
  });

  if (
    !storedToken ||
    !storedToken.expiresAt ||
    storedToken.expiresAt < new Date()
  ) {
    throw new Error("Invalid password reset token");
  }
  if (!storedToken.jti || storedToken.jti !== payload.jti) {
    throw new Error("Invalid password reset token");
  }
  const isMatch = await bcrypt.compare(token, storedToken.tokenHash);
  if (!isMatch) {
    throw new Error("Invalid password reset token");
  }
  await prisma.user.update({
    where: { id: payload.id },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
  await prisma.passwordResetToken.delete({ where: { userId: payload.id } });
  await prisma.refreshToken.deleteMany({
    where: { userId: payload.id },
  });
  return { message: "Password reset successfully" };
};

const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.accessToken(buildAccessTokenPayload(user));
  const { token: refreshToken, jti } = jwt.generateRefreshToken(
    buildAccessTokenPayload(user),
  );
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashedRefreshToken,
      jti,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    },
  });

  return {
    message: "Login successful",
    token: accessToken,
    refreshToken,
    refreshTokenCookie: buildRefreshTokenCookie(refreshToken),
  };
};

const refreshToken = async (refreshTokenValue) => {
  const decoded = jwt.verifyRefreshToken(refreshTokenValue);
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      jti: decoded.jti,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.revoked) {
    throw new Error("Refresh token revoked");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  if (storedToken.userId !== decoded.id) {
    throw new Error("Invalid refresh token");
  }

  const match = await bcrypt.compare(refreshTokenValue, storedToken.tokenHash);

  if (!match) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = jwt.accessToken(buildAccessTokenPayload(user));
  const { token: newRefreshToken, jti: newJti } = jwt.generateRefreshToken(
    buildAccessTokenPayload(user),
  );
  const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { jti: decoded.jti },
      data: { revoked: true },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: newHashedRefreshToken,
        jti: newJti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: decoded.id,
      },
    }),
  ]);

  return {
    token: accessToken,
    refreshToken: newRefreshToken,
    refreshTokenCookie: buildRefreshTokenCookie(newRefreshToken),
  };
};

const getProfile = async (userId) => {
  const parsedUserId = Number(userId);

  if (!Number.isInteger(parsedUserId)) {
    throw new Error("Valid user ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: { name: true, email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const logoutUser = async (refreshToken) => {
  const payload = jwt.verifyRefreshToken(refreshToken);
  if (!payload || !payload.jti || !payload.id) {
    throw new Error("Invalid refresh token");
  }

  const tokens = await prisma.refreshToken.findUnique({
    where: {
      jti: payload.jti,
    },
  });
  if (!tokens) {
    throw new Error("Invalid refresh token");
  }

  if (tokens.revoked) {
    throw new Error("Refresh token revoked");
  }

  if (tokens.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  if (tokens.userId !== payload.id) {
    throw new Error("Invalid refresh token");
  }

  const match = await bcrypt.compare(refreshToken, tokens.tokenHash);

  if (!match) {
    throw new Error("Invalid refresh token");
  }

  await prisma.refreshToken.update({
    where: {
      jti: payload.jti,
    },
    data: {
      revoked: true,
    },
  });
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  refreshToken,
  getProfile,
  logoutUser,
};
