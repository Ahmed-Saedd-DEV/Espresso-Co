const { z } = require("zod");

const createReviewSchema = z.object({
  body: z.object({
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
      .max(1000, "Comment must not exceed 1000 characters")
      .optional(),
  }),
});

const getReviewsQuerySchema = z.object({
  query: z.object({
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
      .max(100, "Search must not exceed 100 characters")
      .optional(),
  }),
});

module.exports = {
  createReviewSchema,
  getReviewsQuerySchema,
};
