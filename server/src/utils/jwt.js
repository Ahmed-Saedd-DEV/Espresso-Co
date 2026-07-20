const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const accessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateRefreshToken = (user) => {
  const jti = randomUUID();
  const token = jwt.sign({ id: user.id, jti }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { token, jti };
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const generateEmailVerificationToken = (user) => {
  const jti = randomUUID();

  const token = jwt.sign(
    { id: user.id, jti },
    process.env.JWT_EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return { token, jti, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }; // 1 day
};

const verifyEmailVerificationToken = (token) => {
  return jwt.verify(token, process.env.JWT_EMAIL_VERIFICATION_SECRET);
};


module.exports = {
  accessToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
};
