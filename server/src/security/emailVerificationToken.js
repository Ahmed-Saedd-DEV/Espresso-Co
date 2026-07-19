const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const { generateEmailVerificationToken } = require("../utils/jwt");

const createEmailVerificationToken = async (userId) => {
  const { token, jti } = generateEmailVerificationToken({ id: userId });
  const tokenHash = await bcrypt.hash(token, 10);

  await prisma.emailVerificationToken.create({
    data: {
      tokenHash,
      jti,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId,
    },
  });

  return token;
};

module.exports = {
  createEmailVerificationToken,
};
