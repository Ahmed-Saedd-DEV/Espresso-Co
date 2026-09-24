const { z } = require("zod");

const addToCartSchema = z.object({
  body: z
    .object({
      productId: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),

      quantity: z.coerce
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be greater than 0"),
    })
    .strict(),
});

const updateCartItemSchema = z.object({
  params: z
    .object({
      productId: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),
    })
    .strict(),

  body: z
    .object({
      quantity: z.coerce
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be greater than 0"),
    })
    .strict(),
});

const removeCartItemSchema = z.object({
  params: z
    .object({
      productId: z.coerce
        .number()
        .int("Product ID must be an integer")
        .positive("Product ID must be greater than 0"),
    })
    .strict(),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
};
