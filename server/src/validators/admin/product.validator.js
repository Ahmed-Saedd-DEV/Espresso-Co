const { z } = require("zod");

const productFields = {
  name: z.string().trim().min(1, "Product name is required"),

  description: z.string().trim().min(1, "Product description is required"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  price: z.coerce
    .number()
    .finite("Price must be a valid number")
    .positive("Price must be greater than 0")
    .refine(
      (value) => Number.isInteger(value * 100),
      "Price must have at most 2 decimal places",
    ),

  categoryId: z.coerce
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be greater than 0")
    .nullable()
    .optional(),
};

const createProductSchema = z.object({
  body: z.object(productFields).strict(),
});

const getAllProductsQuerySchema = z.object({
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

      categoryId: z.coerce
        .number()
        .int("Category ID must be an integer")
        .positive("Category ID must be greater than 0")
        .optional(),

      sort: z
        .enum(["id", "name", "price", "stock", "createdAt", "updatedAt"])
        .optional(),

      order: z.enum(["asc", "desc"]).optional(),
    })
    .strict(),
});

const updateProductSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),
    })
    .strict(),

  body: z
    .object({
      name: productFields.name.optional(),
      description: productFields.description.optional(),
      stock: productFields.stock.optional(),
      price: productFields.price.optional(),
      categoryId: productFields.categoryId,
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
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

const deleteImageSchema = z.object({
  params: z
    .object({
      id: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),

      imageId: z.coerce
        .number()
        .int("Image ID must be an integer")
        .positive("Image ID must be greater than 0"),
    })
    .strict(),
});

module.exports = {
  getAllProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  deleteImageSchema,
};
