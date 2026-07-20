const transporter = require("../utils/email");

const sendVerificationEmail = async (email, token) => {
  const verificationLink =
  `http://localhost:5000/auth/verify-email?token=${token}`;
    // `${process.env.CLIENT_URL}/verify-email?token=${token}`;

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

      <p>This link expires in 24 hours.</p>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};