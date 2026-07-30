const { z } = require("zod");

const categoryName = z.string().trim().min(1, "Category name is required");

const createCategorySchema = z.object({
  body: z
    .object({
      name: categoryName,
    })
    .strict(),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be greater than 0"),
  }),

  body: z
    .object({
      name: categoryName,
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
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
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
};
