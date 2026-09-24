const transporter = require("../utils/email");

const getClientUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${getClientUrl()}/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Welcome!</h2>
      <p>Please verify your email by clicking the button below.</p>

      <a href="${verificationLink}">
        Verify Email
      </a>
    `,
  });

  console.log(`Verification email sent to ${email}`);
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>
      <p>Please click the button below to reset your password.</p>

      <a href="${resetLink}">
        Reset Password
      </a>
    `,
  });

  console.log(`Password reset email sent to ${email}`);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
