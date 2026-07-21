const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");

const createPasswordResetToken = async (userId) => {
  const { token, jti, expiresAt } = jwt.generatePasswordResetToken({
    id: userId,
  });
  const tokenHash = await bcrypt.hash(token, 10);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      jti,
      expiresAt,
      userId,
    },
  });

  return token;
};

module.exports = {
  createPasswordResetToken,
};
