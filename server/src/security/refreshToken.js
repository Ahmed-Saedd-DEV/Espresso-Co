const prisma = require("../prisma/prismaClient");
const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");

const refreshToken = async (req, res) => {
  const refreshTokenValue = jwt.generateRefreshToken(req.user);
  const hashedRefreshToken = await bcrypt.hash(refreshTokenValue, 10);
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashedRefreshToken,
      userId: req.user.id,
    },
  });

  res.cookie("refreshToken", refreshTokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { refreshToken: refreshTokenValue };
};

const revokeRefreshToken = async (req, refreshTokenValue) => {
  const storedTokens = await prisma.refreshToken.findMany({
    where: { userId: req.user.id, revoked: false },
  });

  for (const token of storedTokens) {
    const isMatch = await bcrypt.compare(refreshTokenValue, token.tokenHash);
    if (isMatch) {
      await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revoked: true },
      });
      break;
    }
  }

  return { success: true };
};

module.exports = {
  refreshToken,
  revokeRefreshToken,
};
