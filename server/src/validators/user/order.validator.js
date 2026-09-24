const { z } = require("zod");

const orderItemSchema = z
  .object({
    productId: z.coerce
      .number()
      .int("Product ID must be an integer")
      .positive("Product ID must be greater than 0"),

    quantity: z.coerce
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0")
      .optional(),
  })
  .strict();

const createOrderSchema = z.object({
  body: z
    .object({
      items: z
        .array(orderItemSchema)
        .min(1, "At least one order item is required"),
    })
    .strict(),
});

const orderIdSchema = z.object({
  params: z
    .object({
      orderId: z.coerce
        .number()
        .int("Order ID must be an integer")
        .positive("Order ID must be greater than 0"),
    })
    .strict(),
});

const getOrdersQuerySchema = z.object({
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
        .enum(["id", "total", "status", "createdAt", "updatedAt"])
        .optional(),

      order: z.enum(["asc", "desc"]).optional(),

      status: z.enum(["PENDING", "CANCELLED"]).optional(),
    })
    .strict(),
});

const updateOrderStatusSchema = z.object({
  params: z
    .object({
      orderId: z.coerce
        .number()
        .int("Order ID must be an integer")
        .positive("Order ID must be greater than 0"),
    })
    .strict(),

  body: z
    .object({
      status: z.enum(["CANCELLED"], {
        message: "Users can only cancel orders",
      }),
    })
    .strict(),
});

module.exports = {
  createOrderSchema,
  orderIdSchema,
  getOrdersQuerySchema,
  updateOrderStatusSchema,
};
