const { z } = require("zod");

const getAllUsersQuerySchema = z.object({
  query: z
    .object({
      page: z.coerce
        .number()
        .int("Page must be an integer")
        .positive("Page must be greater than 0")
        .optional(),

      limit: z.coerce
        .number()
        .int("Limit must be an integer")
        .min(1, "Limit must be at least 1")
        .max(100, "Limit must not exceed 100")
        .optional(),

      search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .max(100, "Search must not exceed 100 characters")
        .optional(),

      role: z.enum(["USER", "ADMIN"]).optional(),

      isVerified: z.enum(["true", "false"]).optional(),

      sort: z
        .enum(["id", "name", "email", "role", "createdAt", "updatedAt"])
        .optional(),

      order: z.enum(["asc", "desc"]).optional(),
    })
    .strict(),
});

const userIdSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("User ID must be an integer")
        .positive("User ID must be greater than 0"),
    })
    .strict(),
});

const updateUserSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("User ID must be an integer")
        .positive("User ID must be greater than 0"),
    })
    .strict(),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Name cannot be empty")
        .max(100, "Name must not exceed 100 characters")
        .optional(),

      email: z.string().trim().email("Invalid email address").optional(),

      role: z.enum(["USER", "ADMIN"]).optional(),

      isVerified: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});

module.exports = {
  getAllUsersQuerySchema,
  userIdSchema,
  updateUserSchema,
};
