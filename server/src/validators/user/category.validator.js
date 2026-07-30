const { z } = require("zod");

const categoryQuerySchema = z.object({
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

      sort: z.enum(["id", "name", "createdAt", "updatedAt"]).optional(),

      order: z.enum(["asc", "desc"]).optional(),

      categoryId: z.coerce
        .number()
        .int("Category ID must be an integer")
        .positive("Category ID must be greater than 0")
        .optional(),

      search: z
        .string()
        .trim()
        .max(100, "Search must not exceed 100 characters")
        .optional(),

      stock: z.coerce
        .number()
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .optional(),

      price: z.coerce.number().min(0, "Price cannot be negative").optional(),

      minPrice: z.coerce
        .number()
        .min(0, "Minimum price cannot be negative")
        .optional(),

      maxPrice: z.coerce
        .number()
        .min(0, "Maximum price cannot be negative")
        .optional(),
    })
    .refine(
      (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice <= data.maxPrice,
      {
        message: "minPrice cannot be greater than maxPrice",
        path: ["minPrice"],
      },
    ),
});

const categoryIdSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be greater than 0"),
  }),
});

module.exports = {
  categoryQuerySchema,
  categoryIdSchema,
};
