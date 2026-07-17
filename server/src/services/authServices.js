const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const { buildAccessTokenPayload } = require("../utils/authUtils");

exports.registerUser = async (userData) => {
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
  return {
    message: "User registered successfully",
    user: { name: existingUser.name, email: existingUser.email },
  };
};

exports.loginUser = async (userData) => {
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
    refreshTokenCookie: `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`,
  };
};

exports.refreshToken = async (refreshTokenValue) => {
  const decoded = jwt.verifyRefreshToken(refreshTokenValue);
  const storedTokens = await prisma.refreshToken.findMany({
    where: {
      userId: decoded.id,
      revoked: false,
    },
  });

  let matchingToken = null;
  for (const storedToken of storedTokens) {
    const isValid = await bcrypt.compare(
      refreshTokenValue,
      storedToken.tokenHash,
    );
    if (isValid) {
      matchingToken = storedToken;
      break;
    }
  }

  if (!matchingToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = jwt.accessToken(
    buildAccessTokenPayload({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }),
  );
  const { token: newRefreshToken, jti: newJti } = jwt.generateRefreshToken(
    buildAccessTokenPayload({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }),
  );
  const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

  await prisma.refreshToken.update({
    where: { id: matchingToken.id },
    data: { revoked: true },
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash: newHashedRefreshToken,
      jti: newJti,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: decoded.id,
    },
  });

  return {
    token: accessToken,
    refreshToken: newRefreshToken,
    refreshTokenCookie: `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`,
  };
};

exports.getProfile = async (userId) => {
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

const logoutUser = async (userId) => {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId)) {
    throw new Error("Valid user ID is required");
  }

  await prisma.refreshToken.deleteMany({ where: { userId: parsedUserId } });
};

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  refreshToken: exports.refreshToken,
  getProfile: exports.getProfile,
  logoutUser: logoutUser,
};
