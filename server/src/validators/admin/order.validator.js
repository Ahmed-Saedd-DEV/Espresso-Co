const { z } = require("zod");

const orderIdSchema = z.object({
  params: z.object({
    orderId: z.coerce
      .number()
      .int("Order ID must be an integer")
      .positive("Order ID must be greater than 0"),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.coerce
      .number()
      .int("Order ID must be an integer")
      .positive("Order ID must be greater than 0"),
  }),

  body: z
    .object({
      status: z.string().trim().toUpperCase(),
    })
    .strict(),
});

const getAllOrdersSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int("Page must be an integer")
      .positive("Page must be greater than 0")
      .optional(),

    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .positive("Limit must be greater than 0")
      .optional(),

    sort: z
      .enum(["id", "total", "status", "createdAt", "updatedAt"])
      .optional(),

    order: z.enum(["asc", "desc"]).optional(),

    status: z
      .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
      .optional(),
  }),
});

module.exports = {
  orderIdSchema,
  updateOrderStatusSchema,
  getAllOrdersSchema,
};
