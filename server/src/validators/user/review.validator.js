const { z } = require("zod");

const createReviewSchema = z.object({
  body: z
    .object({
      productId: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),

      rating: z.coerce
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must not exceed 5"),

      comment: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment must not exceed 1000 characters")
        .optional(),
    })
    .strict(),
});

const getReviewsQuerySchema = z.object({
  query: z
    .object({
      productId: z.coerce.number().int().positive().optional(),
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

      sort: z.enum(["id", "rating", "createdAt", "updatedAt"]).optional(),

      order: z.enum(["asc", "desc"]).optional(),

      rating: z.coerce
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must not exceed 5")
        .optional(),

      search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .max(100, "Search must not exceed 100 characters")
        .optional(),
    })
    .strict(),
});

const updateReviewSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z
    .object({
      rating: z.coerce.number().int().min(1).max(5).optional(),
      comment: z.string().trim().min(1).max(1000).optional(),
    })
    .strict()
    .refine((data) => data.rating !== undefined || data.comment !== undefined, {
      message: "At least one field must be provided",
    }),
});

const deleteReviewSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

module.exports = {
  createReviewSchema,
  getReviewsQuerySchema,
  updateReviewSchema,
  deleteReviewSchema,
};
