const prisma = require("../../prisma/prismaClient");
const orderUtils = require("../../utils/orderUtils");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");
const AppError = require("../../utils/errors/AppError");

const getAllOrders = async ({
  page,
  limit,
  sort: sortField,
  order,
  status,
}) => {
  const where = filter.getFiltered({ status }, {});
  const totalRecords = await prisma.order.count({ where });
  const paginationData = pagination.getPagination(page, limit, totalRecords);
  const whiteList = ["id", "total", "status", "createdAt", "updatedAt"];
  const normalizedSort = sort.resolveSortQuery({ sort: sortField, order });
  const sorting = sort.getSorting(
    normalizedSort.sort,
    normalizedSort.order,
    whiteList,
  );

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
    },
    skip: paginationData.skip,
    take: paginationData.take,
    orderBy: sorting,
  });

  return {
    orders,
    totalPages: paginationData.totalPages,
    totalRecords,
    page: paginationData.page,
    limit: paginationData.limit,
  };
};

const getOrderById = async (orderId) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid order ID", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid order ID", 400);
  }

  const normalizedStatus = (status || "").toUpperCase();
  const allowedStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const validTransitions = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new AppError("Invalid status", 400);
  }

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    const currentStatus = existingOrder.status.toUpperCase();
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(normalizedStatus)) {
      throw new AppError("Invalid status transition", 409);
    }

    if (normalizedStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
      const orderItems = existingOrder.orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await orderUtils.updateIncreaseStock(orderItems, tx);
    }

    return tx.order.update({
      where: { id },
      data: { status: normalizedStatus },
      include: {
        orderItems: true,
      },
    });
  });
};

const deleteOrder = async (orderId) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid order ID", 400);
  }

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    if (existingOrder.status === "CANCELLED") {
      throw new AppError("Order is already cancelled", 409);
    }

    const orderItems = existingOrder.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await orderUtils.updateIncreaseStock(orderItems, tx);

    return tx.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { orderItems: true },
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
