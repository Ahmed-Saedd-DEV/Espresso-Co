const { z } = require("zod");

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
      status: z.enum(["CANCELLED", "PROCESSING", "SHIPPED", "DELIVERED"], {
        message: "Status is invalid",
      }),
    })
    .strict(),
});

const getAllOrdersSchema = z.object({
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
        .positive("Limit must be greater than 0")
        .optional(),

      sort: z
        .enum(["id", "total", "status", "createdAt", "updatedAt"])
        .optional(),

      order: z.enum(["asc", "desc"]).optional(),

      status: z
        .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
        .optional(),
    })
    .strict(),
});

module.exports = {
  orderIdSchema,
  updateOrderStatusSchema,
  getAllOrdersSchema,
};
