const { z } = require("zod");

const getAllReviewsQuerySchema = z.object({
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
      sort: z.enum(["id", "rating", "createdAt", "updatedAt"]).optional(),
      order: z.enum(["asc", "desc"]).optional(),
      rating: z.coerce
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .optional(),
      search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .max(200, "Search must not exceed 200 characters")
        .optional(),
      productId: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0")
        .optional(),
    })
    .strict(),
});

const reviewIdSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("Review ID must be an integer")
        .positive("Review ID must be greater than 0"),
    })
    .strict(),
});

const bulkDeleteReviewsSchema = z.object({
  body: z
    .object({
      ids: z
        .array(
          z.coerce
            .number()
            .int("ID must be an integer")
            .positive("ID must be greater than 0"),
        )
        .min(1, "At least one review id is required")
        .max(100, "Cannot delete more than 100 reviews at once"),
    })
    .strict(),
});

module.exports = {
  getAllReviewsQuerySchema,
  reviewIdSchema,
  bulkDeleteReviewsSchema,
};
