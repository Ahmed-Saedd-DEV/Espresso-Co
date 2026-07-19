const prisma = require("../prisma/prismaClient");

const requireVerifiedUser = async (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isVerified: true },
    });

    if (!user?.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to validate account status" });
  }
};

module.exports = requireVerifiedUser;
