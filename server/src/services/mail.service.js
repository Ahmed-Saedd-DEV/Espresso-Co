const transporter = require("../utils/email");

const sendVerificationEmail = async (email, token) => {
  const verificationLink =
    `http://localhost:5000/auth/verify-email?token=${token}`;


  const info = await transporter.sendMail({
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
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5000/auth/reset-password?token=${token}`;

  const info = await transporter.sendMail({
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
  console.log("Password reset email sent: %s", token);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};