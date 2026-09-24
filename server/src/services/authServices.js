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
const AppError = require("../utils/errors/AppError");

const registerUser = async (userData) => {
  const { email, password, name } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) {
    throw new AppError("Email already exists", 409);
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
    throw new AppError("Invalid verification token", 400);
  }
  if (!storedToken.jti || storedToken.jti !== payload.jti) {
    throw new AppError("Invalid verification token", 400);
  }
  const isMatch = await bcrypt.compare(token, storedToken.tokenHash);
  if (!isMatch) {
    throw new AppError("Invalid verification token", 400);
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
    throw new AppError("Email is already verified", 409);
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
    throw new AppError("User not found", 404);
  }

  await prisma.passwordResetToken.deleteMany({
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
    throw new AppError("Invalid password reset token", 400);
  }
  if (!storedToken.jti || storedToken.jti !== payload.jti) {
    throw new AppError("Invalid password reset token", 400);
  }
  const isMatch = await bcrypt.compare(token, storedToken.tokenHash);
  if (!isMatch) {
    throw new AppError("Invalid password reset token", 400);
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
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
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
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.revoked) {
    throw new AppError("Refresh token revoked", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  if (storedToken.userId !== decoded.id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const match = await bcrypt.compare(refreshTokenValue, storedToken.tokenHash);

  if (!match) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
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
  };
};

const getProfile = async (userId) => {
  const parsedUserId = Number(userId);

  if (!Number.isInteger(parsedUserId)) {
    throw new AppError("Valid user ID is required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: { id: true, name: true, email: true, role: true, isVerified: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const logoutUser = async (refreshToken) => {
  const payload = jwt.verifyRefreshToken(refreshToken);
  if (!payload || !payload.jti || !payload.id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokens = await prisma.refreshToken.findUnique({
    where: {
      jti: payload.jti,
    },
  });
  if (!tokens) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (tokens.revoked) {
    throw new AppError("Refresh token revoked", 401);
  }

  if (tokens.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  if (tokens.userId !== payload.id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const match = await bcrypt.compare(refreshToken, tokens.tokenHash);

  if (!match) {
    throw new AppError("Invalid refresh token", 401);
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
