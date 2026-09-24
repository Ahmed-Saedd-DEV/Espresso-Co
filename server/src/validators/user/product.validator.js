const { z } = require("zod");

const productQuerySchema = z.object({
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

      sort: z
        .enum(["name", "price", "stock", "createdAt", "updatedAt"])
        .optional(),

      order: z.enum(["asc", "desc"]).optional(),

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

      category: z
        .string()
        .trim()
        .min(1, "Category cannot be empty")
        .max(100, "Category must not exceed 100 characters")
        .optional(),

      categoryId: z.coerce
        .number()
        .int("Category ID must be an integer")
        .positive("Category ID must be greater than 0")
        .optional(),

      search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .max(100, "Search must not exceed 100 characters")
        .optional(),
    })
    .strict()
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

const productIdSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),
    })
    .strict(),
});

module.exports = {
  productQuerySchema,
  productIdSchema,
};
