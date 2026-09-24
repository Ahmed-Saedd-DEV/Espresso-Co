const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one digit");

const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),

      email: z.string().trim().toLowerCase().email("Invalid email address"),

      password: passwordSchema,
    })
    .strict(),
});

const loginSchema = z.object({
  body: z
    .object({
      email: z.string().trim().toLowerCase().email("Invalid email address"),

      password: z.string().min(1, "Password is required"),
    })
    .strict(),
});

const verifyEmailSchema = z.object({
  query: z
    .object({
      token: z.string().trim().min(1, "Verification token is required"),
    })
    .strict(),
});

const resendVerificationSchema = z.object({
  body: z
    .object({
      email: z.string().trim().toLowerCase().email("Invalid email address"),
    })
    .strict(),
});

const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().trim().toLowerCase().email("Invalid email address"),
    })
    .strict(),
});

const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().trim().min(1, "Reset token is required"),

      newPassword: passwordSchema,
    })
    .strict(),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  passwordSchema,
};
